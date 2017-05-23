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
      name: 'script',
      message: 'What\'s your component script directory',
      default: directoryConfig.script || 'js'
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
    {
      name: 'urlPrefix',
      message: 'What\'s your request url prefix',
      default: sagaConfig.urlPrefix || ''
    },
    {
      name: 'urlSuffix',
      message: 'What\'s your request url suffix',
      default: sagaConfig.urlSuffix || ''
    },
    {
      type: 'list',
      name: 'method',
      message: 'Which request would you like to default method?',
      choices: ['get', 'post', 'put', 'delete'],
      default: sagaConfig.method || 'get'
    },
    {
      name: 'extraImport',
      message: 'What\'s your saga extra import file',
      default: sagaConfig.extraImport || ''
    }
  ];
}
const nodeModulesPath = (config) => {
  return {
    type: 'input',
    name: 'nodeModulesPath',
    message: 'What\'s your node modules default path?',
    default: config.nodeModulesPath || ''
  }
}

const confirm = {
  type: 'confirm',
  name: 'isOk',
  message: 'Is this ok?',
  default: true
};
export { directory, saga, nodeModulesPath, confirm };
