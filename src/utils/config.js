import { join } from 'path';
import { existsSync, readFileSync, removeSync } from 'fs';

const defaultConfig = {
  name: 'react-tools-cli',
  description: '',
  version: '1.0.0',
  remark: '',
  configSeparation: true,
  nodeModulesPath: '',
  devPort: 5000,
  browserSupport: { chrome: '', firefox: '', safari: '', opera: '', edge: '', ie: '' },
  directory:
  {
    source: 'src',
    component: 'components',
    style: 'less',
    image: 'images',
    staticData: 'json',
    test: 'test',
    document: 'doc',
    container: 'containers',
    redux: 'redux',
    reduxStore: 'store',
    config: 'configs',
    util: 'utils',
    dist: 'app'
  },
  saga: {
    urlPrefix: '',
    urlSuffix: '',
    method: 'get',
    extraImport: ''
  }
}

function getConfig(configDir) {
  const configPath = join(configDir, '.reactconfig');
  if (existsSync(configPath)) {
    try {
      return { ...defaultConfig, ...JSON.parse(readFileSync(configPath, 'utf-8')) };
    } catch (error) {
      removeSync(configPath);
      return defaultConfig;
    }
  } else {
    return defaultConfig;
  }
}

export default getConfig;
