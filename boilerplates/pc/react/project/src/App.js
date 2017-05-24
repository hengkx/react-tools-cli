import React, { Component } from 'react';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import routes from './routes';
import configureStore from './store/configureStore';

const store = configureStore();
// 定义应用的 history
const history = syncHistoryWithStore(browserHistory, store);

export default class extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router key={Math.random()} history={history} routes={routes} />
      </Provider>
    );
  }
}
