import pickBy from 'lodash/pickBy';
import { join } from 'path';
import { existsSync } from 'fs';

const directory = (directoryConfig = {}) => {
  return [
    {
      name: 'source',
      message: 'What\'s your source directory',
      default: directoryConfig.source || 'src'
    },
    {
      name: 'component',
      message: 'What\'s your component directory',
      default: directoryConfig.component || 'components'
    },
    {
      name: 'style',
      message: 'What\'s your component style directory',
      default: directoryConfig.style || 'less'
    },
    {
      name: 'image',
      message: 'What\'s your component image directory',
      default: directoryConfig.image || 'images'
    },
    {
      name: 'staticData',
      message: 'What\'s your component static data directory',
      default: directoryConfig.staticData || 'json'
    },
    {
      name: 'test',
      message: 'What\'s your component script directory',
      default: directoryConfig.test || 'test'
    },
    {
      name: 'document',
      message: 'What\'s your component document directory',
      default: directoryConfig.document || 'doc'
    },
    {
      name: 'container',
      message: 'What\'s your container directory',
      default: directoryConfig.container || 'containers'
    },
    {
      name: 'redux',
      message: 'What\'s your redux directory',
      default: directoryConfig.redux || 'redux'
    },
    {
      name: 'reduxStore',
      message: 'What\'s your redux store directory',
      default: directoryConfig.reduxStore || 'store'
    },
    {
      name: 'config',
      message: 'What\'s your config directory',
      default: directoryConfig.config || 'configs'
    },
    {
      name: 'util',
      message: 'What\'s your utils directory',
      default: directoryConfig.util || 'utils'
    },
    {
      name: 'dist',
      message: 'What\'s your dist directory',
      default: directoryConfig.dist || 'app'
    }
  ];
}

const saga = (sagaConfig = {}) => {
  return [
    pickBy({
      name: 'urlPrefix',
      message: 'What\'s your request url prefix',
      default: sagaConfig.urlPrefix || ''
    }),
    pickBy({
      name: 'urlSuffix',
      message: 'What\'s your request url suffix',
      default: sagaConfig.urlSuffix || ''
    }),
    {
      type: 'list',
      name: 'method',
      message: 'Which request would you like to default method?',
      choices: ['get', 'post', 'put', 'delete'],
      default: sagaConfig.method || 'get'
    },
    pickBy({
      name: 'extraImport',
      message: 'What\'s your saga extra import file',
      default: sagaConfig.extraImport || ''
    })
  ];
}

const project = (config = {}, { cwd, isCreateProject }) => {
  return [
    {
      name: 'name',
      message: 'What\'s your project name',
      default: config.name || 'react-tools-cli',
      validate: function (input) {
        if (input.match(/^[a-z0-9_-]+$/i)) {
          if (isCreateProject) {
            if (existsSync(join(cwd, input))) {
              return 'porject exists';
            }
          }
          return true;
        }
        return 'Please enter a valid project name. must be /^[a-z0-9_-]+$/i';
      }
    },
    pickBy({
      name: 'description',
      message: 'What\'s your project description',
      default: config.description || ''
    }),
    {
      name: 'version',
      message: 'What\'s your project version',
      default: config.version || '1.0.0'
    },
    pickBy({
      name: 'remark',
      message: 'What\'s your project remark',
      default: config.remark || ''
    }),
    {
      type: 'confirm',
      name: 'configSeparation',
      message: 'Is this config file separation?',
      default: config.configSeparation
    },
    pickBy({
      type: 'input',
      name: 'nodeModulesPath',
      message: 'What\'s your node modules default path?',
      default: config.nodeModulesPath || ''
    }),
    {
      type: 'input',
      name: 'devPort',
      message: 'What\'s your development port?',
      default: config.devPort || 5000,
      validate: function (value) {
        const valid = !isNaN(parseInt(value));
        return valid || 'Please enter a valid port number';
      },
      filter: Number
    }
  ];
};

const browserSupport = (config = {}) => {
  return [
    pickBy({
      name: 'chrome',
      message: 'What\'s your browser support chrome',
      default: config.chrome || ''
    }),
    pickBy({
      name: 'firefox',
      message: 'What\'s your browser support firefox',
      default: config.firefox || ''
    }),
    pickBy({
      name: 'safari',
      message: 'What\'s your browser support safari',
      default: config.safari || ''
    }),
    pickBy({
      name: 'opera',
      message: 'What\'s your browser support opera',
      default: config.opera || ''
    }),
    pickBy({
      name: 'edge',
      message: 'What\'s your browser support edge',
      default: config.edge || ''
    }),
    pickBy({
      name: 'ie',
      message: 'What\'s your browser support ie',
      default: config.ie || ''
    }),
  ];
};
const confirm = {
  type: 'confirm',
  name: 'isOk',
  message: 'Is this ok?',
  default: true
};

export { project, browserSupport, directory, saga, confirm };
