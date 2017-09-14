# Magento 2 GraphQL API [![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](https://www.surveymonkey.com/r/27NGBTB)

Magento 2 GraphQL APi is fully-featured GraphQL server on top of the Magento 2 Service Contracts. It allows to easily consume Magento APIs through the GraphQL clients, such as [Apollo](http://dev.apollodata.com/) and write new GraphQL-ready APIs to expose custom Magento 2 data to the GraphQL clients. The primary use-case for such APIs is javascript clients which implements re-usable UI building blocks (Web Components) and use Magento in a headless way.

To get started with the go to Magento 2 Graph<i>i</i>QL demo page [**Magento 2 Graph<i>i</i>QL Playground**](http://m2graphql.com/graphiql/).

Magento 2 GraphQL server endpoint can be used by any GraphQL client. It is:

1. Exposes Magento 2 APIs and works on top of it
2. Installed as an extension on Magento 2 and does not require core customizations
3. Uses webonyx library which provides all features of the GraphQL language
4. Allows traffic optimization for the client applications transfering just the data needed in particular use-case
5. Supports Magento 2 API authentication model and exposes just the data client authorized to see
6. Supports flexible deprecation model informing clients on usage of deprecated fields

## Installation 

1. Add repository to the composer.json
```
"repositories": [
      {
        "type": "vcs",
        "url": "https://github.com/vrann/m2graphql"
      }
    ],
```

2. Download and package

```
composer require vrann/m2graphql
bin/magento module:enable Magento_GraphQL
```

## Usage

The easiest way to try GraphQL API is to install Graph<i>i</i>QL user interface either as [app]() or [extension]() to the browser. The [Chrome extension]() also installs developer tools in the Chrome console.

However, production application which uses GraphQL can be written on any language [which has clients](), and this in this document all examples will be using javascript and the Apollo client.

### Get Started

Following is an excerpt of Apollo documentation

```js
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://m2instance.dev/graphql',
  }),
});
```

Replace `https://m2instance.dev` with the base path of the Magento instance here package is installed.

To execute a query with your client you may now call the `client.query` method like this:

```js
client.query({
  query: gql`
    query TodoApp {
      todos {
        id
        text
        completed
      }
    }
  `,
})
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Magento APIs

If you familiar with the Magento Service layer, you should already be familiar with the concept of authorization, Service Interfaces, Data Interfaces, REST routing. Otherwise, please read following materials:
1. [devdocs](API)
2. [Authorization]()
3. [Extension Attributes]()

M2GraphQL extension works on top of the Magento Webapi framework and re-uses same insfrastructure

### Mapping of Service Contracts to GraphQL Schema

GraphQL schema design conventions has certain assumptions which does not directly correspond to the Service contracts. For example fields of the Query root object are expected to be the Objects, whic can use filters to pass the parameters to data retrieval layer. While root object of the Service contract is operation, which can accept the date. In order to make a transition of the Service Contracts to GraphQL paradigm, following rules were used:

1. All GET requests are exposed as a fields on the Query object
2. For particular GET request, the type of the corresponding field constructed by taking the name of the result object of the related service contract method
3. The arguments to the field are taken from the parameters of the method of the corresponding service contract method

Example:
webapi.xml
```xml
 <route url="/V1/products/:sku" method="GET">
        <service class="Magento\Catalog\Api\ProductRepositoryInterface" method="get"/>
        <resources>
            <resource ref="Magento_Catalog::products" />
        </resources>
    </route>
```

RepositoryInterface
```php
/**
     * Get info about product by product SKU
     *
     * @param string $sku
     * @param bool $editMode
     * @param int|null $storeId
     * @param bool $forceReload
     * @return \Magento\Catalog\Api\Data\ProductInterface
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function get($sku, $editMode = false, $storeId = null, $forceReload = false);
```

GraphQL schema
```
MagentoCatalogProduct(
    sku: String
    editMode: Boolean
    storeId: Int
    forceReload: Boolean
): Magento_Catalog_Api_Data_ProductInterface
```

4. Input and output parameters are constructed from the input object replacing \\ with _
5. Input parameters has _Input suffix

example of the SearchCriteria:
```
MagentoCmsBlockSearchResults(searchCriteria: Magento_Framework_Api_SearchCriteriaInterface_Input): Magento_Cms_Api_Data_BlockSearchResultsInterface
```

### Authorization

### Requesting Object

```
MagentoStoreStores{id, name, code}
```

### Requesting Objects With Parameters

```
MagentoCatalogProduct(sku: "CannondaleCaad1032014"){
    id, name, price, media_gallery_entries {
      file
    }, custom_attributes {
      attribute_code,
      value
    }
  }
```

### SerachCriteria Request example

```
MagentoCmsBlockSearchResults(searchCriteria: {
    sort_orders: {
    	field: "block_id",
      direction: "ASC"
    }
    filter_groups: {
      filters: {
        field: "block_id",
        value: "1",
        condition_type: "eq"
      }
    }
  }){
    items{id, title, content}
  }
```
