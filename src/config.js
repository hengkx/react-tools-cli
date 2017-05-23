import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import clear from 'clear';
import colors from 'colors';

function getConfig(configDir) {
  const configPath = path.join(configDir, '.reactconfig');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    return {};
  }
}

export default (program, { configDir, currentConfigDir, isCreateProject }) => {
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
  const configDirectory = config.directory || {};
  const sagaDirectory = config.saga || {};
  const directoryQuestion = [
    {
      name: 'source',
      message: 'What\'s your source directory',
      default: configDirectory.source || 'src'
    },
    {
      name: 'component',
      message: 'What\'s your component directory',
      default: configDirectory.component || 'components'
    },
    {
      name: 'script',
      message: 'What\'s your component script directory',
      default: configDirectory.script || 'js'
    },
    {
      name: 'style',
      message: 'What\'s your component style directory',
      default: configDirectory.style || 'less'
    },
    {
      name: 'image',
      message: 'What\'s your component image directory',
      default: configDirectory.image || 'images'
    },
    {
      name: 'staticData',
      message: 'What\'s your component static data directory',
      default: configDirectory.staticData || 'json'
    },
    {
      name: 'container',
      message: 'What\'s your container directory',
      default: configDirectory.container || 'containers'
    },
    {
      name: 'redux',
      message: 'What\'s your redux directory',
      default: configDirectory.redux || 'redux'
    },
    {
      name: 'reduxStore',
      message: 'What\'s your redux store directory',
      default: configDirectory.reduxStore || 'store'
    },
    {
      name: 'config',
      message: 'What\'s your config directory',
      default: configDirectory.config || 'configs'
    },
    {
      name: 'util',
      message: 'What\'s your utils directory',
      default: configDirectory.util || 'utils'
    },
    {
      name: 'dist',
      message: 'What\'s your dist directory',
      default: configDirectory.dist || 'app'
    }
  ];
  const sagaQuestion = [
    {
      name: 'urlPrefix',
      message: 'What\'s your request url prefix',
      default: sagaDirectory.urlPrefix || ''
    },
    {
      name: 'urlSuffix',
      message: 'What\'s your request url suffix',
      default: sagaDirectory.urlSuffix || ''
    },
    {
      type: 'list',
      name: 'method',
      message: 'Which request would you like to default method?',
      choices: ['get', 'post', 'put', 'delete'],
      default: sagaDirectory.method || 'get'
    },
    {
      name: 'extraImport',
      message: 'What\'s your saga extra import file',
      default: sagaDirectory.extraImport || ''
    }
  ];
  let configResult = {};
  return inquirer.prompt(directoryQuestion).then((answers) => {
    configResult.directory = answers;
    return inquirer.prompt(sagaQuestion).then((sagaAnswers) => {
      configResult.saga = sagaAnswers;
      console.log(JSON.stringify(configResult, null, '  '));

      return inquirer.prompt([{
        type: 'input',
        name: 'nodeModulesPath',
        message: 'What\'s your node modules default path?',
        default: config.nodeModulesPath || ''
      }]).then((rootAnswer) => {
        configResult.nodeModulesPath = rootAnswer.nodeModulesPath;
        return inquirer.prompt([{
          type: 'confirm',
          name: 'isOk',
          message: 'Is this ok?',
          default: true
        }]).then((resultAnswers) => {
          if (resultAnswers.isOk) {
            if (isCreateProject) {
              return configResult;
            } else {
              fs.writeFileSync(configFileName, JSON.stringify(configResult, null, 2));
            }
          } else {
            console.log('Aborted.');
          }
        });
      });
    });
  });
}
