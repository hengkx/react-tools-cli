import { createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// beging not modify
const {
  pStudent, pStudentResult
} = createActions('P_STUDENT', 'P_STUDENT_RESULT');

export { pStudent };

export default {
  P_STUDENT: (state) => ({
    ...state,
    isfetching: true
  }),
  P_STUDENT_RESULT: (state, action) => ({
    ...state,
    isfetching: false,
    pStudentResult: action.payload
  })
};
// ending not modify

function* pStudentSaga(data) {
  try {
    yield put(beginTask());

    const res = yield call(axios.post, Api.test, data.payload);

    yield put(pStudentResult(res));
  } catch (error) {
    yield put(pStudentResult(error));
  } finally {
    yield put(endTask());
  }
}

export function* watchPStudentSaga() {
  yield takeEvery(pStudent, pStudentSaga);
}
