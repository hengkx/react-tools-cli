import path from 'path';
import fs from 'fs-extra';
import createSagaFile, { getActionAndReducer, createSagaStr } from './tpls';
import chalk from 'chalk';
import _ from 'lodash';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`);
}

function error(message) {
  console.error(chalk.red(message));
}

function getConfig(cwd) {
  const configPath = path.join(cwd, '.reactconfig');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    return {};
  }
}

function getWatchSagas(str) {
  const result = [];
  const pattern = /(\/\/(.*)[\r\n|\n|\r]+)?export function\* (\w+)\(\)?/g;
  let res;
  while ((res = pattern.exec(str)) != null) {
    result.push({ name: res[3], comment: res[2] });
  }
  return result;
}

function getActions(str) {
  const pattern = /createActions\(([A-Z,_ \r\n]+)\);/
  let res = pattern.exec(str)[1].replace(/\s+/g, '').split(',');
  const result = [];
  res.forEach(item => {
    if (item.indexOf('_RESULT') === -1) {
      result.push(item);
    }
  });
  return result;
}

function generate(program, { cwd }) {
  const config = getConfig(cwd);
  const progress = program.progress !== false;

  const extraImport = program.extraImport || config.extraImport || '';
  const method = program.method || config.method || 'get';

  const [filename, actionName, url] = program.args;
  // console.log(filename, actionName, url);
  if (!filename) {
    return error(`ERROR: uncaught filename ${filename}`);
  }

  const sagaPath = path.join(cwd, 'src', 'sagas');
  if (!fs.existsSync(sagaPath)) fs.mkdirsSync(sagaPath);
  const filePath = path.join(sagaPath, `${filename}.js`);
  let fileContent = '';
  const action = { name: actionName, url: `${config.urlPrefix}${url}`, method };
  if (fs.existsSync(filePath)) {
    const srcFileContent = fs.readFileSync(filePath, 'utf-8');



    const srcActions = getActions(srcFileContent);

    if (_.indexOf(srcActions, actionName.toUpperCase()) !== -1) {
      return error(`ERROR: action name repeat! ${actionName}`);
    }
    const actions = [];
    srcActions.forEach(item => actions.push({ name: item }));
    actions.push(action);
    // getActionAndReducer
    let temp = srcFileContent.split('// beging not modify');
    fileContent = `${temp[0]}${getActionAndReducer(...actions)}${temp[1].split('// ending not modify')[1]}`;
    fileContent = `${fileContent}\n\n${createSagaStr(progress, action)}`;
  } else {
    fileContent = createSagaFile({
      actions: [action],
      filename: filePath,
      progress,
      extraImport
    });
  }
  fs.writeFileSync(filePath, fileContent);
  const watchSagas = getWatchSagas(fileContent);
  let watchSagaStr = 'import {';
  watchSagas.forEach((item) => watchSagaStr = `${watchSagaStr} ${item.name},`);
  watchSagaStr = `${watchSagaStr.substr(0, watchSagaStr.length - 1)} } from ${filename};`;
  console.log(chalk.green.bold(watchSagaStr));
}



export default generate;
