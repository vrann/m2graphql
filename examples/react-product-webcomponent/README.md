## React Sample APP

This is React Sampel App demonstrating capabilities of the GraphQL in combination with the React frontend frameowrk

## App structure

1. `src/index.js` contains the entry point to application which invokes React rendering logic requesting to render App component:

```
ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('maincontent')
);
```

2. `src/components/App.js` contains the Front controller of the application. in the render method it registers all the components which should be rendered on the page. Currently it registers two `<MagentoProductList />` components. We need two of them to demonstrate, how the data loading combines multiple requests from the different parts of the page in one single request.

`registerGQL={this.registerGQL.bind(this)}` this function is passed to the children components of the App component in order to pass the hook to register GraphQL request, which need to be invoked in order to retrieve data needed for the children component. In this way children manages WHAT data need to be loaded, but App manages WHEN the data is loaded. Besides, component registers callback which will be invoked when the response from the GraphQL received.

`componentDidMount` callback of the React is invoked when all the children components of the current component were instantiated and rendered. We use this callback to collect GraphQL query snippets from all the children components of the application. It is done im multiple phases: first, it runs all initial queries of the components to the GraphQL. After response is received from the GraphQL server, it passes the data to the component callback and listens for the responses from it. If response id TRUE, it does nothing. If the response is another query, it adds quesry to the list of queries to run and repeats the same step again. It continues until all components requires no more data to load.

3. `src/component/MagentoProductList` this is the component which renders the list of product of certain category. It rgisters the query to retrieve the product links: information about relations of the product and category. When it processes the response, it registers another query to request the product details for all the products which belongs to the category. When data is loaded, it renders the grid and passes the produt information to the `src/component/MagentoProductItem`




