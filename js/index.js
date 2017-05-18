import React, { Component } from 'react';
import {Provider} from 'react-redux';
import sharedStore from './configStore';
import sharedRouter from './routes';

const router = sharedRouter();
this.store = sharedStore;

class IndexComponent extends Component {
  render() {
    return (
      <Provider store={sharedStore}>
        {
          router
        }
      </Provider>
    );
  }
}

export default IndexComponent;
