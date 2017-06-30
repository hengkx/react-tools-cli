import { handleActions } from 'redux-actions';
import getStudentReducers, { getStudent, watchGetStudentSaga } from './getStudent';
import pStudentReducers, { pStudent, watchPStudentSaga } from './pStudent';

export default handleActions({
  ...getStudent,
  ...pStudent
}, {});

export {
  getStudent, watchGetStudentSaga,
  pStudent, watchPStudentSaga
};
