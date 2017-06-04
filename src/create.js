import chalk from 'chalk';
import Ora from 'ora';
import { join } from 'path';
import { existsSync } from 'fs';
import clear from 'clear';
import co from 'co';
import inquirer from 'inquirer';
import { project, browserSupport, directory, saga, confirm, componentBaseInfo, createType } from './utils/questions';
import getConfig from './utils/config';

function* create({ cwd, defaultConfigDir }) {
  clear();

  let config = getConfig(defaultConfigDir);
  if (existsSync(join(cwd, '.reactconfig'))) {
    config = getConfig(cwd);
  }

  const type = (yield inquirer.prompt(createType)).type;
  console.log(type);

  let component = yield inquirer.prompt(componentBaseInfo);
  console.log(component);
  component.browserSupport = yield inquirer.prompt(browserSupport(config.browserSupport));
  console.log(config.browserSupport);
  console.log(config.directory);
}

export default ({ cwd, defaultConfigDir }) => {
  return co(create({ cwd, defaultConfigDir }));
};
