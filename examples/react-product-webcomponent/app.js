'use strict';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import angular from 'angular';

var app = angular.module('testApollo', []);

app.controller('ApolloController', ['$scope', function ($scope) {

    const logErrors = {
        applyAfterware({ response }, next) {
            if (!response.ok) {
                response.clone().text().then(bodyText => {
                    console.error(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
                next();
            });
            } else {
                response.clone().json().then(({ errors }) => {
                    if (errors) {
                        console.error('GraphQL Errors:', errors.map(e => e.message));
                    }
                    next();
            });
            }
        },
    };

    const networkInterface = createNetworkInterface({
        uri: 'http://deployment.vm/m2graphql-base/graphql',
    });
    networkInterface.useAfter([logErrors]);

    console.log('apollo');
    const client = new ApolloClient({
        connectToDevTools: true,
        networkInterface: networkInterface,
    });

    var result = client.query({query: gql`
    { MagentoCatalogProduct(sku: "CannondaleCaad1032014"){
      id, name, price, media_gallery_entries {
        file
      }, custom_attributes {
        attribute_code,
        value
      }
    }}
  `}).then(result => {
            console.log(result.data);
}).catch(result => {
        console.log(result)
})


}])


