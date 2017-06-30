import { createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// beging not modify
const {
  getStudent, getStudentResult
} = createActions('GET_STUDENT', 'GET_STUDENT_RESULT');

export { getStudent };

export default {
  GET_STUDENT: (state) => ({
    ...state,
    isfetching: true
  }),
  GET_STUDENT_RESULT: (state, action) => ({
    ...state,
    isfetching: false,
    getStudentResult: action.payload
  })
};
// ending not modify

function* getStudentSaga(data) {
  try {
    yield put(beginTask());

    const res = yield call(axios.get, Api.test, data.payload);

    yield put(getStudentResult(res));
  } catch (error) {
    yield put(getStudentResult(error));
  } finally {
    yield put(endTask());
  }
}

export function* watchGetStudentSaga() {
  yield takeEvery(getStudent, getStudentSaga);
}
