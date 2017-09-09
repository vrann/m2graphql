<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\Developer\Console\Command;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
/**
 * Class XmlCatalogGenerateCommand Generates dictionary of URNs for the IDE
 *
 * @SuppressWarnings(PMD.CouplingBetweenObjects)
 */
class ApiCatalogGenerateCommand extends Command
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
     * @var \Magento\Framework\App\Utility\Files
     */
    private $filesUtility;
    /**
     * ApiCatalogGenerateCommand constructor.
     * @param \Magento\Framework\App\Utility\Files $filesUtility
     * @param \Magento\Framework\Reflection\MethodsMap $methodMaps
     * @param \Magento\Framework\Reflection\FieldNamer $fieldNamer
     * @param array $formats
     */
    public function __construct(
        \Magento\Framework\App\Utility\Files $filesUtility,
        \Magento\Framework\Reflection\MethodsMap $methodMaps,
        \Magento\Framework\Reflection\FieldNamer $fieldNamer,
        array $formats = []
    ) {
        $this->filesUtility = $filesUtility;
        $this->methodMaps = $methodMaps;
        $this->fieldNamer = $fieldNamer;
        parent::__construct();
    }
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this->setName('dev:api-catalog:generate')
            ->setDescription('Generates the catalog of Service and Data Interfaces')
            ->setDefinition([]);
        parent::configure();
    }
    /**
     * Get an array of URNs
     *
     * @param OutputInterface $output
     * @return array
     */
    private function getApiCatalog(OutputInterface $output)
    {
        $serviceInterfaces = $this->filesUtility->getApiInterfaces();
        $result = [
            'service_interfaces' => [],
            'data_entities' => []
        ];
        foreach ($serviceInterfaces as $moduleName => $interfaces) {
            foreach ($interfaces as $interface) {
                try {
                    foreach ($this->methodMaps->getMethodsMap($interface) as $name => $method) {
                        $params = $this->methodMaps->getMethodParams($interface, $name);
                        $args = [];
                        foreach ($params as $param) {
                            $args[] = [
                                'name' => $param['name'],
                                'type' => $param['type'],
                                'description' => 'TBD'
                            ];
                        }
                        $methods[] = [
                            'name' => $name,
                            'type' => $method['type'],
                            'description' => $method['description'],
                            'args' => $args
                        ];
                    }
                    $result['service_interfaces'][] = [
                        'module' => $moduleName,
                        'name' => $interface,
                        'description' => 'TBD',
                        'methods' => $methods
                    ];
                } catch (\Exception $e) {
                }
            }
        }
        $dataInterfaces = $this->filesUtility->getApiDataInterfaces();
        foreach ($dataInterfaces as $module => $interfaces) {
            foreach ($interfaces as $interface) {
                $fields = [];
                foreach ($this->methodMaps->getMethodsMap($interface) as $methodName => $method) {
                    $fieldName = $this->fieldNamer->getFieldNameForMethodName($methodName);
                    $fields[] = [
                        'name' => is_null($fieldName) ? $methodName : $fieldName,
                        'type' => $method['type'],
                        'description' => $method['description'],
                        'required' => $method['isRequired']
                    ];
                }
                $result['data_entities'][] = [
                    'name' => $interface,
                    'module' => $module,
                    'description' => 'TBD',
                    'fields' => $fields
                ];
            }
        }
        return $result;
    }
    /**
     * {@inheritdoc}
     * @throws \InvalidArgumentException
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $apiCatalog = $this->getApiCatalog($output);
        $output->writeln(json_encode($apiCatalog, JSON_PRETTY_PRINT));
    }
}
