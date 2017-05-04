const path = require('path');
const fs = require('fs');
const camelCase = require('./camelCase');
const SPACE = '    ';
// const TWO_SPACE = '        ';
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
  const result = `const {
    ${actionMethods.join(',\n    ')}
} = createActions(${actionNames.join(`,\n${getSpaces(2)}`)});

export { ${exportActionMethods.join(', ')} };`;
  return result;
}

function getHandleActionStr(...actions) {
  let str = `export default handleActions({\n`;
  const handles = [];
  actions.forEach(value => {
    const action = getActionName(value);
    const result = `${action}_RESULT`;
    handles.push(`${getSpaces()}${action}: (state, action) => ({
        ...state,
        isfetching: true
    }),
    ${result}: (state, action) => ({
        ...state,
        isfetching: true,
        ${camelCase(result)}: action.payload
    })`);
  });
  str = `${str}${handles.join(',\n')}\n}, {});`;
  return str;
}
function getRequestStr(action) {

}
function createSagaStr(progress, ...actions) {
  const result = '';
  actions.forEach(value => {
    const actionName = getActionName(value);
    result += `function* ${actionName}Saga(data) {
    try {
        ${progress ? 'yield put(beginTask());\n' : ''}`;
  });
}

function createSagaFile(opts) {
  const { filename, progress, actions } = opts;

  const result = `
import { createActions, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
${progress ? 'import { beginTask, endTask } from \'redux- nprogress\';' : ''}

// beging not modify
${getCreateActionStr(...actions)}

${getHandleActionStr(...actions)}
// ending not modify`;

  fs.writeFileSync(filename, result.substr(1));
}

createSagaFile({ actions: [{ name: 'action' }], filename: 'a.js', progress: true });
