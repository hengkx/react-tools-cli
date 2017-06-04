import path from 'path';
import fs from 'fs-extra';
import createSagaFile, { getActionAndReducer, createSagaStr } from './tpls';
import chalk from 'chalk';
import _ from 'lodash';
import inquirer from 'inquirer';
import { getWatchSagas, getActions } from './utils/saga';
import getConfig from './utils/config';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`);
}

function generate(program, { cwd }) {
  const config = getConfig(cwd);
  const sagaConfig = config.saga || {};
  const progress = program.progress !== false;
  const params = program.params !== false;
  const extraImport = program.extraImport || sagaConfig.extraImport || '';
  const method = program.method || sagaConfig.method || 'get';

  const [filename, actionName] = program.args;
  let url = program.args.url;

  try {
    if (!filename) throw new Error(`ERROR: uncaught filename ${filename}`);
    if (!url) {
      url = _.upperFirst(_.camelCase(filename));
    }
    const sagaPath = path.join(cwd, 'src', 'redux');
    if (!fs.existsSync(sagaPath)) fs.mkdirsSync(sagaPath);
    const filePath = path.join(sagaPath, `${filename}.js`);
    let fileContent = '';
    const action = { name: actionName, url: `${sagaConfig.urlPrefix}${url}`, params, method };

    if (!/^[A-Za-z_]+$/.test(actionName)) throw new Error(`action name must be letters or underscore.`);

    if (fs.existsSync(filePath)) {

      const srcFileContent = fs.readFileSync(filePath, 'utf-8');

      const srcActions = getActions(srcFileContent);

      if (_.indexOf(srcActions, actionName.toUpperCase()) !== -1) {
        throw new Error(`ERROR: action name repeat!`);
      }
      const actions = [];
      srcActions.forEach(item => actions.push({ name: item, params }));
      actions.push(action);
      // getActionAndReducer
      let temp = srcFileContent.split('// beging not modify');
      fileContent = `${temp[0]}${getActionAndReducer(...actions)}${temp[1].split('// ending not modify')[1]}`;
      fileContent = `${fileContent}\n\n${createSagaStr(progress, action)}\n`;

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
    watchSagaStr = `${watchSagaStr.substr(0, watchSagaStr.length - 1)} } from './${filename}';`;
    console.log(chalk.green.bold(watchSagaStr));
  } catch (error) {
    console.log(chalk.red.bold(error.message));
  }
}

export default generate;
