import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    // HashRouter as Router,
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import Main from './components/Main';
import PageServerError from './components/PageServerError';
import PageNotFound from './components/PageNotFound';


// 定义应用的 Store
import configureStore from './store/configureStore';
import rootSaga from './redux/sagas';

const store = configureStore();
store.runSaga(rootSaga);

const history = createHistory();


export default class App extends Component {
    render () {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route exact path="/pageServerError" component={PageServerError} />
                        <Route component={PageNotFound} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
