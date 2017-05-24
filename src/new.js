import path from 'path';
import { join } from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import clear from 'clear';
// import colors from 'colors';
import invariant from 'invariant';
import Ora from 'ora';
import config from './config';
import { getRenamePaths } from './utils';

export default (program, { cwd, defaultConfigDir }) => {
  config(program, { cwd, defaultConfigDir, isCreateProject: true })
    .then((result) => {
      const spinner = new Ora({
        text: 'Please wait'
      });
      const projectPath = join(cwd, result.name);
      try {
        spinner.start();
        const basePath = path.join(__dirname, '../boilerplates/pc/react');
        // copy bolierplate to project path
        fs.copySync(basePath, projectPath);
        fs.writeFileSync(path.join(projectPath, '.reactconfig'), JSON.stringify(result, null, 2));

        const dirConfig = result.directory || {};
        const projectSourcePath = path.join(projectPath, dirConfig.source);
        // fs.renameSync(path.join(projectPath, 'src'), projectSourcePath);

        const componentPath = path.join(projectSourcePath, dirConfig.component);
        const defaultComponentPath = path.join(componentPath, 'Index');

        // fs.renameSync(path.join(projectSourcePath, 'components'), componentPath);
        // fs.renameSync(path.join(defaultComponentPath, 'js'), path.join(defaultComponentPath, dirConfig.script));
        // fs.renameSync(path.join(defaultComponentPath, 'less'), path.join(defaultComponentPath, dirConfig.style));

        // fs.renameSync(path.join(projectSourcePath, 'config'), path.join(projectSourcePath, dirConfig.config));
        // fs.renameSync(path.join(projectSourcePath, 'containers'), path.join(projectSourcePath, dirConfig.container));
        // fs.renameSync(path.join(projectSourcePath, 'redux'), path.join(projectSourcePath, dirConfig.redux));
        // fs.renameSync(path.join(projectSourcePath, 'store'), path.join(projectSourcePath, dirConfig.reduxStore));
        // fs.renameSync(path.join(projectSourcePath, 'utils'), path.join(projectSourcePath, dirConfig.util));

        // fs.renameSync(path.join(projectPath, 'app'), path.join(projectPath, dirConfig.dist));
        const renamePaths = getRenamePaths(projectPath, dirConfig);
        // console.log(renamePaths);
        renamePaths.forEach((item) => {
          if (fs.existsSync(item.src)) {
            fs.renameSync(item.src, item.dest);
          }
        });

        let content = '';

        // change webpack
        content = fs.readFileSync(path.join(projectPath, 'webpack.config.base.js'), 'utf-8');
        content = content.replace(/app/g, dirConfig.dist).replace(/src/g, dirConfig.source)
        //         if (result.nodeModulesPath) {
        //           content = `process.env['NODE_PATH'] = '${result.nodeModulesPath}';
        // require('module').Module._initPaths();\n\n${content}`
        //         }
        fs.writeFileSync(path.join(projectPath, 'webpack.config.base.js'), content);

        content = fs.readFileSync(path.join(projectPath, 'webpack.config.dev.js'), 'utf-8');
        fs.writeFileSync(path.join(projectPath, 'webpack.config.dev.js'), content.replace(/src/g, dirConfig.source));

        content = fs.readFileSync(path.join(projectPath, 'webpack.config.prod.js'), 'utf-8');
        fs.writeFileSync(path.join(projectPath, 'webpack.config.prod.js'), content.replace(/src/g, dirConfig.source));

        // change source
        content = fs.readFileSync(path.join(projectSourcePath, 'App.js'), 'utf-8');
        fs.writeFileSync(path.join(projectSourcePath, 'App.js'), content.replace(/\.\/store/g, `./${dirConfig.reduxStore}`));

        content = fs.readFileSync(path.join(projectSourcePath, 'routes.js'), 'utf-8');
        fs.writeFileSync(path.join(projectSourcePath, 'routes.js'), content.replace(/components/g, dirConfig.component).replace('js', dirConfig.script));

        content = fs.readFileSync(path.join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), 'utf-8');
        fs.writeFileSync(path.join(projectSourcePath, dirConfig.reduxStore, 'configureStore.js'), content.replace(/\.\.\/redux/g, `../${dirConfig.redux}`));

        content = fs.readFileSync(path.join(defaultComponentPath, dirConfig.script, 'Index.js'), 'utf-8');
        fs.writeFileSync(path.join(defaultComponentPath, dirConfig.script, 'Index.js'), content.replace(/\.\.\/less/g, `../${dirConfig.style}`));

        if (result.nodeModulesPath) {
          fs.copy(result.nodeModulesPath, path.join(projectPath, 'node_modules'))
            .then(() => spinner.succeed('create project succeed'))
            .catch(err => spinner.fail('create project failed'));
          // spinner.succeed('create project succeed');
        } else {
          spinner.succeed('create project succeed');
        }
        // spinner.succeed('create project succeed');
      } catch (error) {
        console.log(error);
        fs.removeSync(projectPath);
        spinner.fail('create project failed');
      }
    });


  // var ui = new inquirer.ui.BottomBar();

  // // pipe a Stream to the log zone
  // // outputStream.pipe(ui.log);

  // // Or simply write output
  // ui.log.write('something just happened.');
  // ui.log.write('Almost over, standby!');

  // During processing, update the bottom bar content to display a loader
  // or output a progress bar, etc
  // ui.updateBottomBar('new bottom bar content');

  // inquirer.prompt({
  //   type: 'list',
  //   name: 'chocolate',
  //   message: 'What\'s your favorite chocolate?',
  //   choices: ['Mars', 'Oh Henry', 'Hershey']
  // }).then(function () {
  //   inquirer.prompt({
  //     type: 'list',
  //     name: 'beverage',
  //     message: 'And your favorite beverage?',
  //     choices: ['Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull']
  //   });
  // });
  // inquirer.prompt([
  //   {
  //     type: 'list',
  //     name: 'method',
  //     message: 'Which request would you like to method?',
  //     choices: ['get', 'post', 'put', 'delete'],
  //     default: 'post'
  //   },
  //   {
  //     type: 'checkbox',
  //     message: 'Select Lifecycle',
  //     name: 'lifecycle',
  //     choices: [
  //       new inquirer.Separator('Mounting'),
  //       {
  //         name: 'constructor'
  //       },
  //       {
  //         name: 'componentWillMount'
  //       },
  //       {
  //         name: 'render',
  //         disabled: true
  //       },
  //       {
  //         name: 'componentDidMount'
  //       },
  //       new inquirer.Separator('Updating'),
  //       {
  //         name: 'componentWillReceiveProps'
  //       },
  //       {
  //         name: 'shouldComponentUpdate'
  //       },
  //       {
  //         name: 'componentWillUpdate'
  //       },
  //       {
  //         name: 'render',
  //         disabled: true
  //       },
  //       {
  //         name: 'componentDidUpdate'
  //       },
  //       new inquirer.Separator('Unmounting'),
  //       {
  //         name: 'componentWillUnmount'
  //       }
  //     ],
  //     validate: function (answer) {
  //       if (answer.length < 1) {
  //         return 'You must choose at least one topping.';
  //       }
  //       return true;
  //     }
  //   }
  // ]).then(function (answers) {
  //   console.log(JSON.stringify(answers, null, '  '));
  // });
}

