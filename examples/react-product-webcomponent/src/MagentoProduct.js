import React, { Component } from 'react';
import styles from './MagentoProduct.css';
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
        

        var result = client.query({query: gql`
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
        var state = {data: result.data}
        state.imgUrl = result.data.MagentoStoreStoreConfigs[0].base_url + '/pub/media/catalog/product' + 
            result.data.MagentoCatalogProduct.media_gallery_entries[0].file
        this.setState(state)
        //this.state = result.data;
        console.log(state);
      }).catch(result => {
        console.log(result)
      })

      this.state = {
          imgUrl: "placeholder.jpg",
          data: {MagentoCatalogProduct: {name: "Loading", price: 0, media_gallery_entries: {
              file: "test.jpg"
          }},
          MagentoStoreStoreConfigs: [{base_currency_code: "USD", "base_url": "none"}]
        }}
    }
    
    render() {
        return (
            <div className="products wrapper grid products-grid">
            <ol className="products list items product-items">    
        <li className="item product product-item">                
            <div className="product-item-info" data-container="product-grid">
                <a href="http://deployment.vm/m2graphql-base/index.php/cannondale-caad10-3-2014.html" className="product photo product-item-photo" tabIndex="-1">
                    <span className="product-image-container">
                        <span className="product-image-wrapper">
                            <img className="product-image-photo" src="http://deployment.vm/m2graphql-base/pub/media/catalog/product/cache/f073062f50e48eb0f0998593e568d857/c/a/cannondale.jpeg" width="240" height="300" alt="Cannondale Caad10 3 2014" />
                        </span>
                    </span>
                </a>
                <div className="product details product-item-details">
                    <strong className="product name product-item-name">
                        <a className="product-item-link" href="http://deployment.vm/m2graphql-base/index.php/cannondale-caad10-3-2014.html">
                            Cannondale Caad10 3 2014                            
                        </a>
                    </strong>
                    <div className="price-box price-final_price" data-role="priceBox" data-product-id="1">
                        <span className="price-container price-final_price tax weee">
                            <span id="product-price-1" data-price-amount="1800" data-price-type="finalPrice" className="price-wrapper ">
                                <span className="price">$1,800.00</span>    
                            </span>
                        </span>
                    </div>                        
                    <div className="product-item-inner">
                        <div className="product actions product-item-actions">
                            <div className="actions-primary">
                                <form data-role="tocart-form" action="http://deployment.vm/m2graphql-base/index.php/checkout/cart/add/uenc/aHR0cDovL2RlcGxveW1lbnQudm0vbTJncmFwaHFsLWJhc2UvaW5kZXgucGhwL2Jpa2VzLmh0bWw%2C/product/1/" method="post">
                                    <input type="hidden" name="product" value="1" />
                                    <input type="hidden" name="uenc" value="aHR0cDovL2RlcGxveW1lbnQudm0vbTJncmFwaHFsLWJhc2UvaW5kZXgucGhwL2NoZWNrb3V0L2NhcnQvYWRkL3VlbmMvYUhSMGNEb3ZMMlJsY0d4dmVXMWxiblF1ZG0wdmJUSm5jbUZ3YUhGc0xXSmhjMlV2YVc1a1pYZ3VjR2h3TDJKcGEyVnpMbWgwYld3JTJDL3Byb2R1Y3QvMS8," />
                                    <input name="form_key" type="hidden" value="8SIdk8eqcw3bptVH" />                                            
                                    <button type="submit" title="Add to Cart" className="action tocart primary">
                                        <span>Add to Cart</span>
                                    </button>
                                </form>
                            </div>
                            <div data-role="add-to-links" className="actions-secondary">
                                <a href="#" className="action towishlist" title="Add to Wish List" aria-label="Add to Wish List" data-post="{&quot;action&quot;:&quot;http:\/\/deployment.vm\/m2graphql-base\/index.php\/wishlist\/index\/add\/&quot;,&quot;data&quot;:{&quot;product&quot;:&quot;1&quot;,&quot;uenc&quot;:&quot;aHR0cDovL2RlcGxveW1lbnQudm0vbTJncmFwaHFsLWJhc2UvaW5kZXgucGhwL2Jpa2VzLmh0bWw,&quot;}}" data-action="add-to-wishlist" role="button">
                                    <span>Add to Wish List</span>
                                </a>
                                <a href="#" className="action tocompare" title="Add to Compare" aria-label="Add to Compare" data-post="{&quot;action&quot;:&quot;http:\/\/deployment.vm\/m2graphql-base\/index.php\/catalog\/product_compare\/add\/&quot;,&quot;data&quot;:{&quot;product&quot;:&quot;1&quot;,&quot;uenc&quot;:&quot;aHR0cDovL2RlcGxveW1lbnQudm0vbTJncmFwaHFsLWJhc2UvaW5kZXgucGhwL2Jpa2VzLmh0bWw,&quot;}}" role="button">
                                    <span>Add to Compare</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        </ol>
        </div>
            
        // <div classNameName="mage-product">
        //     <div classNameName="mage-product-image">
        //         <img src={this.state.imgUrl} classNameName="App-logo" alt="logo" />
        //         <h2>{this.state.data.MagentoCatalogProduct.name}</h2>
        //     </div>
        //     <p classNameName="mage-product-description">
        //         <div classNameName="mage-product-price">
        //         {this.state.data.MagentoCatalogProduct.price} {this.state.data.MagentoStoreStoreConfigs[0].base_currency_code}
        //         </div>
        //     </p>
        // </div>
        );
    }
}

export default MagentoProduct;
