import React, { Component } from 'react';
import ApolloFactory from '../../ApolloFactory'
import gql from 'graphql-tag';
import MagentoProductList from '../MagentoProductList';

class App extends Component {
    constructor(props) {
        super(props);
        this.queries = [];
        this.callbacks = [];
    }

    registerGQL(gqlSnippet) {
        this.queries.push(gqlSnippet.query)
        this.callbacks.push(gqlSnippet.callback)
    }

  render() {
    return (
      <div className="App">
        <MagentoProductList categoryId={2} registerGQL={this.registerGQL.bind(this)} />
        <MagentoProductList categoryId={30} registerGQL={this.registerGQL.bind(this)} />
      </div>
    );
  }

  componentDidMount() {
    const queriesConcat =  '{ ' + this.queries.join(',') + ' }';
    const query = {
      query:  gql(queriesConcat)
    }
    
    
    const client = ApolloFactory();
    const promise = client.query(query);
  
    const callbackPromises = [];
    this.callbacks.map(callback => {
      callbackPromises.push(callback(promise))
    })
    this.callbacks = []
    this.queries = []
  
    Promise.all(
      callbackPromises
    ).then(results => {
      var toLoad = false;
      results.map(result => {
        if (result !== true) {
          this.registerGQL(result)
          toLoad = true;
        }
      })
      if (toLoad) {
        this.componentDidMount()
      }
    }).catch(console.log)
  }
}

export default App;