import chalk from 'chalk';
import Ora from 'ora';
import _ from 'lodash';
import { join } from 'path';
import { existsSync, mkdirsSync, writeFileSync, readFileSync } from 'fs-extra';
import clear from 'clear';
import co from 'co';
import inquirer from 'inquirer';
import Mustache from 'mustache';
import { project, browserSupport, directory, saga, confirm, componentBaseInfo, createType } from './utils/questions';
import getConfig from './utils/config';

function* create({ cwd, defaultConfigDir }) {
  clear();
  // console.log(require('./tpls/component/index.mustache'));
  // console.log(Mustache.render(readFileSync('../tpls/component/index.mustache', 'utf-8'), { name: 'a' }));


  let config = getConfig(defaultConfigDir);
  if (existsSync(join(cwd, '.reactconfig'))) {
    config = getConfig(cwd);
  }
  const type = (yield inquirer.prompt(createType)).type;
  if (type === 'redux') {
    console.log('功能待完善');
  } else {
    let component = yield inquirer.prompt(componentBaseInfo);
    component.browserSupport = yield inquirer.prompt(browserSupport(config.browserSupport));
    component.name = _.upperFirst(_.camelCase(component.name));
    const componentPath = join(config.directory.source, config.directory.component, component.name);
    mkdirsSync(componentPath);

    writeFileSync(join(componentPath, 'index.js'),
      Mustache.render(readFileSync('../boilerplates/component/index.mustache', 'utf-8'),
        { name: component.name }));

    const lifecycle = {};
    const module = {};
    const muduleName = _.camelCase(component.name);
    _.forEach(component.lifecycle, (item) => lifecycle[item] = true);
    _.forEach(component.module, (item) => module[item] = muduleName);

    writeFileSync(join(componentPath, `${component.name}.js`),
      Mustache.render(readFileSync('../boilerplates/component/component.mustache', 'utf-8'),
        {
          ...component,
          lifecycle,
          module
        }));
    if (module.style) {
      const stylePath = join(componentPath, config.directory.style);
      mkdirsSync(stylePath);
      writeFileSync(join(stylePath, `${muduleName}.less`), '');
    }
  }
}

export default ({ cwd, defaultConfigDir }) => {
  return co(create({ cwd, defaultConfigDir }));
};
