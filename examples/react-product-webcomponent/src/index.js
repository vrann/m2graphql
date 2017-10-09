import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ApolloFactory from './ApolloFactory'
import gql from 'graphql-tag';


var queries = [];
var callbacks = [];

function registerGQL(gqlSnippet) {
  queries.push(gqlSnippet.query)
  callbacks.push(gqlSnippet.callback)
}

function mounted() {
  const queriesConcat =  '{ ' + queries.join(',') + ' }';
  const query = {
    query:  gql(queriesConcat)
  }
  
  const client = ApolloFactory();
  const promise = client.query(query);

  const callbackPromises = [];
  callbacks.map(callback => {
    callbackPromises.push(callback(promise))
  })
  callbacks = []
  queries = []

  Promise.all(
    callbackPromises
  ).then(results => {
    var toLoad = false;
    results.map(result => {
      if (result !== true) {
        registerGQL(result)
        toLoad = true;
      }
    })
    if (toLoad) {
      mounted()
    }
  }).catch(console.log)
}

ReactDOM.render(
  <div>
    <App registerGQL={registerGQL} mounted={mounted} />
  </div>,
  document.getElementById('maincontent')
);
