import React, { Component } from 'react';

import MagentoProductList from '../MagentoProductList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MagentoProductList registerGQL={this.props.registerGQL} />
        <MagentoProductList registerGQL={this.props.registerGQL} />
      </div>
    );
  }

  componentDidMount() {
      this.props.mounted();
  }
}

export default App;