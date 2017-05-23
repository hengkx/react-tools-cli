/* eslint global-require: 0, no-underscore-dangle: 0 */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { nprogressMiddleware } from 'redux-nprogress';
import rootSaga from '../redux/sagas';
import rootReducer from '../redux/reducers';

export default (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const routingMiddleware = routerMiddleware(browserHistory);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware,
        routingMiddleware,
        nprogressMiddleware(),
      )
    ),
  );
  let sagaTask = sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../redux/reducers', () => {
      store.replaceReducer(require('../redux/reducers'));
    });
    module.hot.accept('../redux/sagas', () => {
      const rootNewSagas = require('../redux/sagas');
      sagaTask.cancel();
      sagaTask.done
        .then(() => (sagaTask = sagaMiddleware.run(rootNewSagas)))
        .catch((error) => {
          console.log(error);
        });
    });
  }

  return store;
};
