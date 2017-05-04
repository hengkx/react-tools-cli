import { createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import { beginTask, endTask } from 'redux- nprogress';

// beging not modify 
const {
    action, actionResult
} = createActions(ACTION, ACTION_RESULT);

export { action };

export default handleActions({
    ACTION: (state, action) => ({
        ...state,
        isfetching: true
    }),
    ACTION_RESULT: (state, action) => ({
        ...state,
        isfetching: true,
        actionResult: action.payload
    })
}, {});
// ending not modify