const path = require('path');
const fs = require('fs');
const camelCase = require('./camelCase');
const SPACE = '  ';

function getSpaces(count = 1) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += SPACE;
  }
  return result;
}

function getActionName(action) {
  return action.name.toUpperCase();
}
// action
function getCreateActionStr(...actions) {
  const exportActionMethods = [];
  const actionMethods = [];
  const actionNames = [];
  actions.forEach(value => {
    const action = getActionName(value);
    const result = `${action}_RESULT`;
    actionNames.push(`${action}, ${result}`);
    actionMethods.push(`${camelCase(action)}, ${camelCase(result)}`);
    exportActionMethods.push(camelCase(action));
  });
  const res = `const {
${getSpaces()}${actionMethods.join(`,\n${getSpaces()}`)}
} = createActions(${actionNames.join(`,\n${getSpaces(2)}`)});

export { ${exportActionMethods.join(', ')} };`;
  return res;
}


// reducers
function getHandleActionStr(...actions) {
  let str = `export default handleActions({\n`;
  const handles = [];
  actions.forEach(value => {
    const action = getActionName(value);
    const result = `${action}_RESULT`;
    handles.push(`${getSpaces()}${action}: (state, action) => ({
${getSpaces(2)}...state,
${getSpaces(2)}isfetching: true
${getSpaces()}}),
${getSpaces()}${result}: (state, action) => ({
${getSpaces(2)}...state,
${getSpaces(2)}isfetching: true,
${getSpaces(2)}${camelCase(result)}: action.payload
${getSpaces()}})`);
  });
  str = `${str}${handles.join(',\n')}\n}, {});`;
  return str;
}
function getRequestStr(action) {
  const method = action.method.toUpperCase();
  if (method === 'GET') {
    return `const res = yield call(getJSON, ${action.url});`;
  } else {
    return `const res = yield call(getJSON, ${action.url}, {
${getSpaces(3)}method: '${method}',
${getSpaces(3)}body: JSON.stringify(data.payload)
${getSpaces(2)}});`;
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// saga
function createSagaStr(progress, ...actions) {
  let result = '';
  actions.forEach(action => {
    const actionName = getActionName(action);
    const actionResultName = actionName + '_RESULT';
    const sagaName = `${camelCase(actionName)}Saga`;
    result +=
      `function* ${sagaName}(data) {
${getSpaces()}try {
${progress ? `${getSpaces(2)}yield put(beginTask());\n` : ''}\n${getSpaces(2)}${getRequestStr(action)}\n${progress ? `\n${getSpaces(2)}yield put(${camelCase(actionResultName)}(res));` : ''}
${getSpaces()}} catch (error) {
${getSpaces(2)}yield put(${camelCase(actionResultName)}(error));
${getSpaces()}} ${progress ? `finally {\n${getSpaces(2)}yield put(endTask());\n${getSpaces()}}` : ''}
}

export function* watch${capitalizeFirstLetter(sagaName)}() {
${getSpaces()}yield takeEvery(${camelCase(actionName)}, ${sagaName});
}`;
  });
  return result;
}

function getActionAndReducer(...actions) {
  return `// beging not modify
${getCreateActionStr(...actions)}

${getHandleActionStr(...actions)}
// ending not modify`;
}


function createSagaFile(opts) {
  const { filename, extraImport, progress, actions } = opts;

  const result = `
import { createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
${progress ? 'import { beginTask, endTask } from \'redux-nprogress\';' : ''}
${extraImport}

${getActionAndReducer(...actions)}

${createSagaStr(progress, ...actions)} `;
  return result.substr(1);
}
export { getActionAndReducer, createSagaStr };
export default createSagaFile;
