import chalk from 'chalk';
import Ora from 'ora';
import _ from 'lodash';
import { join } from 'path';
import { existsSync, mkdirsSync, writeFileSync, readFileSync } from 'fs-extra';
import clear from 'clear';
import co from 'co';
import inquirer from 'inquirer';
import Mustache from 'mustache';
import { project, browserSupport, directory, saga, confirm, componentBaseInfo, createType } from './utils/questions';
import getConfig from './utils/config';
import Create from './utils/create';

function getBoilerplateContent(filename, obj) {
  return Mustache.render(readFileSync(join('../boilerplates/react', filename), 'utf-8'), obj);
}

function* create({ cwd, defaultConfigDir }) {
  clear();

  let config = getConfig(defaultConfigDir);
  if (existsSync(join(cwd, '.reactconfig'))) {
    config = getConfig(cwd);
  }
  const type = (yield inquirer.prompt(createType)).type;
  if (type === 'redux') {
    console.log('功能待完善');
  } else {
    let component = yield inquirer.prompt(componentBaseInfo);
    component.browserSupport = yield inquirer.prompt(browserSupport(config.browserSupport));
    Create(config, component);
  }
}

export default ({ cwd, defaultConfigDir }) => {
  return co(create({ cwd, defaultConfigDir }));
};
