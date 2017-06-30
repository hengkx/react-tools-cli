import { createStore, applyMiddleware, compose } from 'redux';
// http://redux.js.org/

import createSagaMiddleware from 'redux-saga';
// https://redux-saga.js.org/

import createHistory from 'history/createBrowserHistory';

import { routerMiddleware } from 'react-router-redux';
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux

import { nprogressMiddleware } from 'redux-nprogress';
// https://github.com/jaredt67/redux-nprogress

import rootReducer from '../redux/reducers';

const history = createHistory();

const configureStore = (initialState) => {

    // 创建 Saga 中间件
    const sagaMiddleware = createSagaMiddleware();

    // 创建路由中间件
    const routingMiddleware = routerMiddleware(history);

    // 开启 Redux DevTools
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    // 创建 Store
    const store = createStore(
        rootReducer,    // 导入根 reducer
        // undefined,      // 初始化状态（initialState）
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                routingMiddleware,
                nprogressMiddleware(),
            )
        ), // 应用中间件
    );

    return {
        ...store,
        runSaga: sagaMiddleware.run
    }
}

export default configureStore
