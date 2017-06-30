import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';

const rootReducer = combineReducers({
    routing: routerReducer,
    nprogress,
});

export default rootReducer;
