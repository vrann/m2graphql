<?php
/**
 * @author etulika
 */
namespace Magento\GraphQL\Model;

use \GraphQL\Type\Definition\ObjectType;
use \GraphQL\Type\Definition\InputObjectType;
use \GraphQL\Type\Definition\Type;
use \GraphQL\Type\Definition\ListOfType;
use \GraphQL\Type\Definition\ResolveInfo;
use Magento\Framework\App\ObjectManager;

/**
 * Class Type builds GraphQL schema for the Magento Service Contracts
 */
class Types
{
    /**
     * @var \Magento\Framework\Reflection\MethodsMap
     */
    private $methodMaps;

    /**
     * @var \Magento\Framework\Reflection\FieldNamer
     */
    private $fieldNamer;

    /**
     * @var \Magento\Webapi\Model\Config
     */
    private $webapiConfig;

    /**
     * @var array
     */
    private $dataInterfaces = [];

    /**
     * @var \Magento\Framework\Reflection\TypeProcessor
     */
    private $typeProcessor;

    /**
     * @var array
     */
    private $visited = [];

    /**
     * @var array
     */
    private $config = [];

    /**
     * @var \Magento\Framework\Webapi\ServiceOutputProcessor
     */
    private $serviceOutputProcessor;

    /**
     * @var \Magento\Framework\Webapi\ServiceInputProcessor
     */
    private $serviceInputProcessor;

    /**
     * @param \Magento\Framework\Reflection\MethodsMap $methodMaps
     * @param \Magento\Framework\Reflection\FieldNamer $fieldNamer
     * @param \Magento\Webapi\Model\Config $webapiConfig
     * @param \Magento\Framework\Reflection\TypeProcessor $typeProcessor
     * @param \Magento\Framework\Webapi\ServiceOutputProcessor $serviceOutputProcessor
     * @param \Magento\Framework\Webapi\ServiceInputProcessor $serviceInputProcessor
     * @param array $formats
     */
    public function __construct(
        \Magento\Framework\Reflection\MethodsMap $methodMaps,
        \Magento\Framework\Reflection\FieldNamer $fieldNamer,
        \Magento\Webapi\Model\Config $webapiConfig,
        \Magento\Framework\Reflection\TypeProcessor $typeProcessor,
        \Magento\Framework\Webapi\ServiceOutputProcessor $serviceOutputProcessor,
        \Magento\Framework\Webapi\ServiceInputProcessor $serviceInputProcessor,
        array $formats = []
    ) {
        $this->methodMaps = $methodMaps;
        $this->fieldNamer = $fieldNamer;
        $this->webapiConfig = $webapiConfig;
        $this->typeProcessor = $typeProcessor;
        $this->serviceOutputProcessor = $serviceOutputProcessor;
        $this->serviceInputProcessor = $serviceInputProcessor;
    }

    /**
     * @param $interface
     * @param bool $inputType
     * @return ListOfType|null|ObjectType|boolean
     */
    private function getDataType($interface, $inputType = false)
    {
        $key = $interface . ($inputType ? "_Input" : "");
        if (isset($this->dataInterfaces[$key])) {
            return $this->dataInterfaces[$key];
        }

        if ($this->typeProcessor->isArrayType($interface)) {
            $itemType = $this->typeProcessor->getArrayItemType($interface);
            if ($itemType == 'anyType' || isset($this->visited[$itemType]) && !isset($this->dataInterfaces[$itemType])) {
                $type =  Type::string();
                return new ListOfType($type);
            } else {
                $resultType = $this->getDataType($itemType, $inputType);
                if ($resultType) {
                    return new ListOfType($resultType);
                } else {
                    return false;
                }
            }
        } else if ($this->typeProcessor->isTypeSimple($interface)) {
            $resolvedType = null;
            switch ($interface) {
                case 'bool': $resolvedType = Type::boolean();
                    break;
                case 'boolean': $resolvedType = Type::boolean();
                    break;
                case 'int': $resolvedType = Type::int();
                    break;
                case 'float': $resolvedType = Type::float();
                    break;
                case 'string': $resolvedType = Type::string();
                    break;
            }
            return $resolvedType;
        } else {
            $this->visited[$key] = true;
            $fields = [];

            foreach ($this->methodMaps->getMethodsMap($interface) as $methodName => $method) {
                if (substr($methodName, 0, 3) === \Magento\Framework\Reflection\FieldNamer::GETTER_PREFIX) {
                    $fieldName = $this->fieldNamer->getFieldNameForMethodName($methodName);
                    $fieldName = is_null($fieldName) ? $methodName : $fieldName;
                    $args = null;
                    $resolveField = null;
                    if ($fieldName == 'custom_attributes') {
//                        //$type = 'Object';
//                        $metadataInterface = "";
//                        switch ($interface) {
//                            case "\Magento\Customer\Api\Data\AddressInterface":
//                                $metadataInterface = "\Magento\Customer\Api\AddressMetadataInterface";
//                                break;
//                            case "\Magento\Customer\Api\Data\CustomerInterface":
//                                break;
//                            case "\Magento\Catalog\Api\Data\ProductInterface":
//                                break;
//                            case "\Magento\Catalog\Api\Data\ProductAttributeInterface":
//                                break;
//                            case "\Magento\Catalog\Api\Data\CategoryAttributeInterface":
//                                break;
//                            case "\Magento\Catalog\Api\Data\CategoryInterface":
//                                break;
//                            case "\Magento\Framework\Api\Search\DocumentInterface":
//                                break;
//                            case "\Magento\Quote\Api\Data\AddressInterface":
//                                break;
//                        }
                        $args = ['filter' => ['type' => new ListOfType(Type::string())]];
                        $resolveField = function($value, $args, $context, ResolveInfo $info) {
                            return $value[$info->fieldName];
                        };
                    }

                    $type = null;
                    if ($method['type'] == 'mixed'
                        || (isset($this->visited[$method['type']]) && !isset($this->dataInterfaces[$method['type']]))) {
                        $type =  Type::string();
                    } else {
                        $type = $this->getDataType($method['type'], $inputType);
                    }
                    if (!$type) {
                        continue;
                    }
                    $fields[$fieldName] = [
                        'name' => $fieldName,
                        'type' => $type,
                        'description' => $method['description'],
                        'required' => $method['isRequired']
                    ];
                    if ($args !== null) {
                        $fields[$fieldName]['args'] = $args;
                    }
                    if ($resolveField !== null) {
                        $fields[$fieldName]['resolveField'] = $resolveField;
                    }
                }
            }
            if (empty($fields)) {
                $this->dataInterfaces[$key] = false;
            } else {
                $wrapper = $inputType? InputObjectType::class : ObjectType::class;
                $this->dataInterfaces[$key] = new $wrapper([
                    'name' => str_replace("\\", "_", trim($interface, '\\')) . ($inputType ? "_Input" : ""),
                    'description' => 'TBD',
                    'fields' => $fields,
                    'resolveField' => function($value, $args, $context, ResolveInfo $info) {
                        if ($info->fieldName == 'custom_attributes') {
                            if (isset($args['filter']) && count($args['filter']) > 0) {
                                $result = [];
                                foreach ($args['filter'] as $attribute_code) {
                                    foreach ($value['custom_attributes'] as $attribute) {
                                        if ($attribute['attribute_code'] == $attribute_code) {
                                            $result[] = $attribute;
                                        }
                                    }
                                }
                                return $result;
                            }
                        }
                        return $value[$info->fieldName];
                    }
                ]);
            }
        }

        return $this->dataInterfaces[$key];
    }

    /**
     * @return ObjectType
     */
    public function getTypes()
    {
        /*
         * [
            'name' => 'Query',
            'fields' => [
                'Magento\Store\Api\StoreRepositoryInterface' => [
                    'type' => [
                        'name' => 'Magento\Store\Api\StoreRepositoryInterface',
                        'description' => 'TBD',
                        'fields' => [
                            'getList' => Types::id(),
                        ];
                     },
                    'description' => 'TBD',
                ]
            ]
         */

        $this->config = [
            'name' => 'Query',
            'fields' => [],
            'resolveField' => function($val, $args, $context, ResolveInfo $info) {
                return $this->config['fields'][$info->fieldName]['resolveField']
                    ->call($this, $val, $args, $context, $info);
            }
        ];
        $webApiConfig = $this->webapiConfig->getServices();
        foreach ($webApiConfig['routes'] as $route => $methods) {
            if (!isset($methods['GET'])) {
                continue;
            }
            $service = $methods['GET']['service'];

            $methodsTypes = $this->methodMaps->getMethodsMap($service['class']);
            $type = $methodsTypes[$service['method']];

            $params = $this->methodMaps->getMethodParams($service['class'], $service['method']);
            $args = [];
            foreach ($params as $param) {
                $args[$param['name']] = [
                    'type' => $this->getDataType($param['type'], true)
                ];
            }

            $fieldType = $this->getDataType($type['type']);
            $class = str_replace("\\", "", $type['type']);
            $class = str_replace("[]", "s", $class);
            $class = str_replace("ApiData", "", $class);
            $class = str_replace("Interface", "", $class);
            if (isset($this->config['fields'][$class])) {
                $class .= $service['method'];
            }

            $this->config['fields'][$class] = [
                'name' => $class,
                'type' => $fieldType,
                'description' => $type['description'],
                'args' => $args,
                'service' => $service['class'],
                'method' => $service['method'],
                'resolveField' => function($value, $inputData, $context, ResolveInfo $info) use ($service) {
                    $inputData = $this->serviceInputProcessor->process(
                        $service['class'],
                        $service['method'],
                        $inputData
                    );
                    $serviceObject = ObjectManager::getInstance()->get($service['class']);
                    $outputData = call_user_func_array([$serviceObject, $service['method']], $inputData);
                    $outputData = $this->serviceOutputProcessor->process(
                        $outputData,
                        $service['class'],
                        $service['method']
                    );
                    return $outputData;
                }
            ];
        }
        return new ObjectType($this->config);
    }
}