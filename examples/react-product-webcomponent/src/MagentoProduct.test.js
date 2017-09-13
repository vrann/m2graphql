import React from 'react';
import ReactDOM from 'react-dom';
import App from './MagentoProduct';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MagentoProduct />, div);
});