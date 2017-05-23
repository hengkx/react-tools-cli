import {
  getActionAndReducer, createSagaStr, getSpaces, getActionName,
  getCreateActionStr, getHandleActionStr, getRequestStr, capitalizeFirstLetter
} from '../src/tpls'

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('test')).toBe('Test');
  expect(capitalizeFirstLetter('Test')).toBe('Test');
  expect(capitalizeFirstLetter('1test')).toBe('1test');
  expect(capitalizeFirstLetter('1Rest')).toBe('1Rest');
});

test('getSpaces', () => {
  expect(getSpaces()).toBe('  ');
  expect(getSpaces(1)).toBe('  ');
  expect(getSpaces(2)).toBe('    ');
});

test('getActionName', () => {
  expect(getActionName()).toBeUndefined();
  expect(getActionName({ name: 'test' })).toBe('TEST');
  expect(getActionName({ name: 'tEst1' })).toBe('TEST1');
});

test('getRequestStr', () => {
  expect(getRequestStr).toThrowError('param is not undefined.');
  expect(() => { getRequestStr({ name: 'test' }) }).toThrowError('request url is not undefined.');
  expect(getRequestStr({ url: 'test' })).toBe('const res = yield call(axios.get, test);');
  expect(getRequestStr({ url: 'test', params: true })).toBe('const res = yield call(axios.get, test, { params: data.payload });');
  expect(getRequestStr({ url: 'test', method: 'post' })).toBe('const res = yield call(axios.post, test);');
  expect(getRequestStr({ url: 'test', method: 'post', params: true })).toBe('const res = yield call(axios.post, test, data.payload);');
});

test('getHandleActionStr', () => {
  expect(getHandleActionStr({ name: 'test' })).toBe(`export default handleActions({
  TEST: (state) => ({
    ...state,
    isfetching: true
  }),
  TEST_RESULT: (state, action) => ({
    ...state,
    isfetching: false,
    testResult: action.payload
  })
}, {});`);
});

test('getCreateActionStr', () => {
  expect(getCreateActionStr({ name: 'test' })).toBe(`const {
  test, testResult
} = createActions('TEST', 'TEST_RESULT');

export { test };`);
  expect(() => { getCreateActionStr({ name: 'test' }, { name: 'test' }) }).toThrow(/Expected action name not repeat/);

  expect(getCreateActionStr({ name: 'test' }, { name: 'demo' })).toBe(`const {
  test, testResult,
  demo, demoResult
} = createActions('TEST', 'TEST_RESULT',
    'DEMO', 'DEMO_RESULT');

export { test, demo };`);
});
