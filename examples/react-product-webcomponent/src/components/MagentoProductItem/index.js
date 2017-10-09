import React, { Component } from 'react';

export default class MagentoProductItem extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.thumbnail = 'http://m2graphql.com/pub/static/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/small_image.jpg';
        this.url_key = "http://m2graphql.com/placeholder.html"
    }    

    render() {
        if (this.props.data.hasOwnProperty('custom_attributes')) {
            this.thumbnail = "http://m2graphql.com/pub/media/catalog/product/" + this.props.data.custom_attributes[0]['value'];
            this.url_key = "http://m2graphql.com/index.php/" + this.props.data.custom_attributes[1]['value'] + '.html'
        }
        return (
            <li className="product-item">
                <div className="product-item-info">
                    <a href={this.url_key} className="product-item-photo">
                        <span className="product-image-container" style={{width: "240px"}}>
                            <span className="product-image-wrapper" style={{paddingBottom: "125%"}}>
                                <img className="product-image-photo" src={this.thumbnail} width="240" height="300" alt="Selene Yoga Hoodie" />
                            </span>
                        </span>
                    </a>
                    <div className="product-item-details">
                        <strong className="product-item-name">
                            <a title="{this.props.data.name}" href={this.url_key} className="product-item-link">
                                {this.props.data.name}                                  
                            </a>
                        </strong>
                        <div className="price-box price-final_price" data-role="priceBox" data-product-id="1113">
                            <span className="price-container price-final_price tax weee">
                                <span id="old-price-1113-widget-product-grid" data-price-amount="{this.props.data.price}" data-price-type="finalPrice" className="price-wrapper ">
                                    <span className="price">${this.props.data.price}</span>    
                                </span>
                            </span>
                        </div>                                                                                        
                        <div className="product-item-actions">
                            <div className="actions-primary">
                                <button className="action tocart primary" data-post="{&quot;action&quot;:&quot;http:\/\/m2graphql.com\/index.php\/checkout\/cart\/add\/uenc\/aHR0cDovL20yZ3JhcGhxbC5jb20vaW5kZXgucGhwL3dvbWVuLmh0bWw%2C\/product\/1113\/&quot;,&quot;data&quot;:{&quot;product&quot;:&quot;1113&quot;,&quot;uenc&quot;:&quot;aHR0cDovL20yZ3JhcGhxbC5jb20vaW5kZXgucGhwL3dvbWVuLmh0bWw,&quot;}}" type="button" title="Add to Cart">
                                <span>Add to Cart</span>
                            </button>
                            </div>
                            <div className="actions-secondary" data-role="add-to-links">
                                <a href="#" data-post="{&quot;action&quot;:&quot;http:\/\/m2graphql.com\/index.php\/wishlist\/index\/add\/&quot;,&quot;data&quot;:{&quot;product&quot;:&quot;1113&quot;,&quot;uenc&quot;:&quot;aHR0cDovL20yZ3JhcGhxbC5jb20vaW5kZXgucGhwL3dvbWVuLmh0bWw,&quot;}}" className="action towishlist" data-action="add-to-wishlist" title="Add to Wish List">
                                    <span>Add to Wish List</span>
                                </a>
                                <a href="#" className="action tocompare" data-post="{&quot;action&quot;:&quot;http:\/\/m2graphql.com\/index.php\/catalog\/product_compare\/add\/&quot;,&quot;data&quot;:{&quot;product&quot;:&quot;1113&quot;,&quot;uenc&quot;:&quot;aHR0cDovL20yZ3JhcGhxbC5jb20vaW5kZXgucGhwL3dvbWVuLmh0bWw,&quot;}}" title="Add to Compare">
                                    <span>Add to Compare</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}