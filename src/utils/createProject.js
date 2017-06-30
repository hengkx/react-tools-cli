import { join, resolve, dirname } from 'path';
import uuid from 'uuid';
import fs from 'fs-extra';
import which from 'which';
import { getRenamePaths } from './index';

function renamePaths(projectPath, dirConfig) {
  const sourcePath = join(projectPath, 'src');
  const componentPath = join(sourcePath, 'components');
  const defaultComponent = 'Index';
  const srcPaths = [
    { src: sourcePath, dest: join(projectPath, dirConfig.source) },
    { src: join(sourcePath, 'components'), dest: join(sourcePath, dirConfig.component) },
    // { src: join(componentPath, defaultComponent, 'js'), dest: join(componentPath, defaultComponent, dirConfig.script) },
    { src: join(componentPath, defaultComponent, 'less'), dest: join(componentPath, defaultComponent, dirConfig.style) },
    { src: join(componentPath, defaultComponent, 'images'), dest: join(componentPath, defaultComponent, dirConfig.image) },
    { src: join(componentPath, defaultComponent, 'json'), dest: join(componentPath, defaultComponent, dirConfig.staticData) },
    { src: join(sourcePath, 'containers'), dest: join(sourcePath, dirConfig.container) },
    { src: join(sourcePath, 'redux'), dest: join(sourcePath, dirConfig.redux) },
    { src: join(sourcePath, 'store'), dest: join(sourcePath, dirConfig.reduxStore) },
    { src: join(sourcePath, 'configs'), dest: join(sourcePath, dirConfig.config) },
    { src: join(sourcePath, 'utils'), dest: join(sourcePath, dirConfig.util) },
    // { src: join(projectPath, 'app'), dest: join(projectPath, dirConfig.dist) }
  ];
  let result = [];
  srcPaths.forEach((item) => {
    if (item.src !== item.dest) result.push(item);
  });

  result.sort((a, b) => (b.src.length - a.src.length))
    .forEach((item) => {
      if (fs.existsSync(item.src)) {
        fs.renameSync(item.src, item.dest);
      }
    });
}

export default (projectPath, appData, config, isVd = false) => {
  try {
    const id = uuid.v1();
    const dataPath = join(appData, 'react-tools-cli', 'react');
    if (!fs.existsSync(dataPath)) fs.mkdirsSync(dataPath);
    const basePath = join(__dirname, '../../boilerplates/project/react');
    let dirConfig = config.directory || {};

    if (config.configSeparation) {
      // if (fs.readdirSync(dataPath).length === 0) {
      //   fs.copySync(join(basePath, 'config'), dataPath);
      //   if (!fs.existsSync(join(dataPath, 'node_modules'))) {
      //     const npm = 'npm';
      //     process.chdir(dataPath);
      //     runCmd(which.sync(npm), ['install'], function () {
      //     });
      //   }
      // }
      // fs.copySync(join(basePath, 'src'), projectPath);
    } else {
      fs.copySync(join(basePath, 'src'), projectPath);
      // fs.copySync(join(basePath, 'config'), projectPath);
    }
    if (isVd) {
      dirConfig = config.directory.development;
      dirConfig.source = dirConfig.envName;
      fs.writeFileSync(join(projectPath, '.vd', 'project.json'), JSON.stringify(config, null, 2));
    } else {
      fs.writeFileSync(join(projectPath, '.reactconfig'), JSON.stringify(config, null, 2));
    }

    const projectSourcePath = join(projectPath, dirConfig.source);

    // const componentPath = join(projectSourcePath, dirConfig.component);
    // const defaultComponentPath = join(componentPath, 'Index');

    // renamePaths(projectPath, dirConfig);

    // let content = '';

    // // change source
    // content = fs.readFileSync(join(projectSourcePath, 'App.js'), 'utf-8');
    // fs.writeFileSync(join(projectSourcePath, 'App.js'), content.replace(/\.\/store/g, `./${dirConfig.reduxStore}`));

    // content = fs.readFileSync(join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), 'utf-8');
    // fs.writeFileSync(join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), content.replace(/\.\.\/redux/g, `../${dirConfig.redux}`));

    // if (config.nodeModulesPath && !config.configSeparation) {
    //   fs.copySync(config.nodeModulesPath, join(projectPath, 'node_modules'));
    // }
  } catch (error) {
    fs.removeSync(projectPath);
    throw error;
  }
}
