import { join } from 'path';
import fs from 'fs-extra';
import { getRenamePaths } from './index';

function renamePaths(projectPath, dirConfig) {
  const sourcePath = join(projectPath, 'src');
  const componentPath = join(sourcePath, 'components');
  const defaultComponent = 'Index';
  const srcPaths = [
    { src: sourcePath, dest: join(projectPath, dirConfig.source) },
    { src: join(sourcePath, 'components'), dest: join(sourcePath, dirConfig.component) },
    { src: join(componentPath, defaultComponent, 'js'), dest: join(componentPath, defaultComponent, dirConfig.script) },
    { src: join(componentPath, defaultComponent, 'less'), dest: join(componentPath, defaultComponent, dirConfig.style) },
    { src: join(componentPath, defaultComponent, 'images'), dest: join(componentPath, defaultComponent, dirConfig.image) },
    { src: join(componentPath, defaultComponent, 'json'), dest: join(componentPath, defaultComponent, dirConfig.staticData) },
    { src: join(sourcePath, 'containers'), dest: join(sourcePath, dirConfig.container) },
    { src: join(sourcePath, 'redux'), dest: join(sourcePath, dirConfig.redux) },
    { src: join(sourcePath, 'store'), dest: join(sourcePath, dirConfig.reduxStore) },
    { src: join(sourcePath, 'config'), dest: join(sourcePath, dirConfig.config) },
    { src: join(sourcePath, 'utils'), dest: join(sourcePath, dirConfig.util) },
    { src: join(projectPath, 'app'), dest: join(projectPath, dirConfig.dist) }
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

export default (projectPath, config) => {
  try {
    const basePath = join(__dirname, '../../boilerplates/pc/react');
    // copy bolierplate to project path
    fs.copySync(basePath, projectPath);

    const dirConfig = config.directory || {};
    if (!config.configSeparation) {
      config.webpack = {
        projectPath: "__dirname",
        sourceDir: dirConfig.source,
        distDir: dirConfig.dist,
        port: config.devPort
      };
    }

    fs.writeFileSync(join(projectPath, '.reactconfig'), JSON.stringify(config, null, 2));

    const projectSourcePath = join(projectPath, dirConfig.source);

    const componentPath = join(projectSourcePath, dirConfig.component);
    const defaultComponentPath = join(componentPath, 'Index');

    renamePaths(projectPath, dirConfig);

    let content = '';

    // change source
    content = fs.readFileSync(join(projectSourcePath, 'App.js'), 'utf-8');
    fs.writeFileSync(join(projectSourcePath, 'App.js'), content.replace(/\.\/store/g, `./${dirConfig.reduxStore}`));

    content = fs.readFileSync(join(projectSourcePath, 'routes.js'), 'utf-8');
    fs.writeFileSync(join(projectSourcePath, 'routes.js'), content.replace(/components/g, dirConfig.component).replace('js', dirConfig.script));

    content = fs.readFileSync(join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), 'utf-8');
    fs.writeFileSync(join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), content.replace(/\.\.\/redux/g, `../${dirConfig.redux}`));

    content = fs.readFileSync(join(defaultComponentPath, dirConfig.script, 'Index.js'), 'utf-8');
    fs.writeFileSync(join(defaultComponentPath, dirConfig.script, 'Index.js'), content.replace(/\.\.\/less/g, `../${dirConfig.style}`));

    if (config.nodeModulesPath && !config.configSeparation) {
      fs.copySync(config.nodeModulesPath, join(projectPath, 'node_modules'));
    }
  } catch (error) {
    fs.removeSync(projectPath);
    throw error;
  }
}
