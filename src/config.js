import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import clear from 'clear';
import colors from 'colors';
import co from 'co';
import { directory, saga, nodeModulesPath, confirm } from './utils/questions';

function getConfig(configDir) {
  const configPath = path.join(configDir, '.reactconfig');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (error) {
      fs.removeSync(configPath);
      return {};
    }
  } else {
    return {};
  }
}

function* config(program, { configDir, currentConfigDir, isCreateProject }) {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('React Tools', { horizontalLayout: 'full' })
    )
  );
  let configFileName = path.join(configDir, '.reactconfig');
  let config = getConfig(configDir);
  if (currentConfigDir) {
    configFileName = path.join(currentConfigDir, '.reactconfig');
    if (fs.existsSync(configFileName)) {
      config = getConfig(currentConfigDir);
    }
  }
  // console.log(JSON.stringify(config, null, 2));
  console.log(chalk.magenta('directory config'));
  config.directory = yield inquirer.prompt(directory(config.directory));
  console.log(chalk.magenta('saga config'));
  config.saga = yield inquirer.prompt(saga(config.saga));
  console.log(chalk.magenta('node modules config'));
  config = {
    ...config,
    ... yield inquirer.prompt(nodeModulesPath(config))
  };
  console.log(chalk.magenta('confirm'));
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


export default (program, { configDir, currentConfigDir, isCreateProject }) => {
  return co(config(program, { configDir, currentConfigDir, isCreateProject }));
};
