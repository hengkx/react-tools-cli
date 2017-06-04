import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import clear from 'clear';
import colors from 'colors';
import co from 'co';
import { project, browserSupport, directory, saga, confirm } from './utils/questions';
import getConfig from './utils/config';

function hint(content) {
  console.log(chalk.magenta(content));
}

function* config({ cwd, defaultConfigDir, isCreateProject }) {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('React Tools', { horizontalLayout: 'full' })
    )
  );

  let configFileName = path.join(defaultConfigDir, '.reactconfig');
  let config = getConfig(defaultConfigDir);
  if (cwd) {
    configFileName = path.join(cwd, '.reactconfig');
    if (fs.existsSync(configFileName)) {
      config = getConfig(cwd);
    }
  }
  // console.log(JSON.stringify(config, null, 2));
  hint('project config');
  config = {
    ...config,
    ... yield inquirer.prompt(project(config, { cwd, isCreateProject }))
  };
  hint('project browser support config');
  config.browserSupport = yield inquirer.prompt(browserSupport(config.browserSupport));
  hint('directory config');
  config.directory = yield inquirer.prompt(directory(config.directory));
  hint('saga config');
  config.saga = yield inquirer.prompt(saga(config.saga));
  hint('confirm config');
  const confirmResult = yield inquirer.prompt(confirm);

  if (confirmResult.isOk) {
    if (isCreateProject) {
      return config;
    } else {
      fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
    }
  } else {
    console.log(chalk.red('Aborted.'));
  }
}


export default ({ defaultConfigDir, cwd, isCreateProject }) => {
  return co(config({ defaultConfigDir, cwd, isCreateProject }));
};
