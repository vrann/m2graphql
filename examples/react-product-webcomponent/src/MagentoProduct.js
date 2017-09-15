import React, { Component } from 'react';
import './MagentoProduct.css';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

class MagentoProduct extends React.Component {
    constructor(props) {
        super(props);

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


        var result = client.query({
            query: gql`
        { MagentoCatalogProduct(sku: "CannondaleCaad1032014"){
          id, name, price, media_gallery_entries {
            file
          }, custom_attributes {
            attribute_code,
          }
        },
        MagentoStoreStoreConfigs(storeCodes: "default") {
            base_currency_code, base_url
        }
    }
      `}).then(result => {
                console.log(result.data);
                this.setState(result.data);
                var state = { data: result.data }
                state.imgUrl = result.data.MagentoStoreStoreConfigs[0].base_url + '/pub/media/catalog/product' +
                    result.data.MagentoCatalogProduct.media_gallery_entries[0].file
                this.setState(state)
                console.log(state);
            }).catch(result => {
                console.log(result)
            })

        this.state = {
            imgUrl: "placeholder.jpg",
            data: {
                MagentoCatalogProduct: {
                    name: "Loading", price: 0, media_gallery_entries: {
                        file: "test.jpg"
                    }
                },
                MagentoStoreStoreConfigs: [{ base_currency_code: "USD", "base_url": "none" }]
            }
        }
    }

    render() {
        return (
            <div className="mage-product">
                <div className="mage-product-image">
                    <img src={this.state.imgUrl} className="App-logo" alt="logo" />
                    <h2>{this.state.data.MagentoCatalogProduct.name}</h2>
                </div>
                <div className="mage-product-description">
                    <div className="mage-product-price">
                        {this.state.data.MagentoCatalogProduct.price} {this.state.data.MagentoStoreStoreConfigs[0].base_currency_code}
                    </div>
                </div>
            </div>
        );
    }
}

export default MagentoProduct
