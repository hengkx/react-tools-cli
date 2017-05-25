import { join } from 'path';
import uuid from 'uuid';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import which from 'which';
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

function runCmd(cmd, args, fn) {
  args = args || [];
  var runner = require('child_process').spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}

export default (projectPath, appData, config) => {
  try {
    const id = uuid.v1();
    const dataPath = join(appData, 'react-tools-cli', 'react');
    if (!fs.existsSync(dataPath)) fs.mkdirsSync(dataPath);

    const basePath = join(__dirname, '../../boilerplates/pc/react');
    // copy bolierplate to project path

    const dirConfig = config.directory || {};

    let webpack = {
      projectPath: "__dirname",
      sourceDir: dirConfig.source,
      distDir: dirConfig.dist,
      port: config.devPort
    };

    if (config.configSeparation) {
      // console.log(which.sync('npm'));
      // console.log(__dirname); //E:\react-tools-cli\lib\utils

      if (fs.readdirSync(dataPath).length === 0) {
        fs.copySync(join(basePath, 'config'), dataPath);

        if (config.nodeModulesPath) {
          fs.copySync(config.nodeModulesPath, join(dataPath, 'node_modules'));
        } else {
          // console.log(dataPath);
          // spawn('cmd.exe', [`/k cd ${dataPath} && npm install`], { stdio: 'inherit' });
          // spawn(which.sync('npm'), ['install'], { stdio: 'inherit' });
          const npm = 'npm';//findNpm();
          // change work dir
          process.chdir(dataPath);
          runCmd(which.sync(npm), ['install'], function () {
            // runCmd(which.sync(npm), ['install', 'dva', '--save'], function () {
            //   console.log(npm + ' install end');
            //   // done();
            // });
          });
        }
      }
      let packageJson = JSON.parse(fs.readFileSync(join(dataPath, 'package.json'), 'utf-8'))
      packageJson.scripts[`start${id}`] = packageJson.scripts.start.replace('{id}', id);
      packageJson.scripts[`build${id}`] = packageJson.scripts.build.replace('{id}', id);
      fs.writeFileSync(join(dataPath, 'package.json'), JSON.stringify(packageJson, null, 2));

      webpack.projectPath = projectPath;
      config.id = id;
      fs.writeFileSync(join(dataPath, `${id}.json`), JSON.stringify(webpack, null, 2));
      config.webpack = webpack;
      fs.copySync(join(basePath, 'project'), projectPath);
      // fs.copySync(basePath, projectPath, {
      //   filter: (path) => {
      //     return path.indexOf('node_modules') > -1
      //   }
      // });
    } else {
      config.webpack = webpack;
      fs.copySync(join(basePath, 'project'), projectPath);
      fs.copySync(join(basePath, 'config'), projectPath);
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
