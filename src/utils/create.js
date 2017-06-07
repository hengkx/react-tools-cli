import _ from 'lodash';
import { join } from 'path';
import { existsSync, mkdirsSync, writeFileSync, readFileSync } from 'fs-extra';
import Mustache from 'mustache';
import getConfig from './config';
import camelCase from './camelCase';

function getBoilerplateContent(filename, obj) {
  return Mustache.render(readFileSync(join(__dirname, '../../boilerplates/react', filename), 'utf-8'), obj);
}


function processSaga(opts) {
  const actionTypes = [];
  const actionNames = [];
  const actionNameExports = [];
  const exportSagas = [];
  const reducers = [];
  opts.sagas.forEach(item => {
    item.type = item.type.toUpperCase();
    item.name = camelCase(item.type);
    item.filename = item.name;
    item.watchName = `watch${_.upperFirst(camelCase(item.type))}Saga`;
    item.export = `${item.name}, ${item.watchName}`;
    exportSagas.push(item.export);
    actionTypes.push(`'${item.type}', '${item.type}_RESULT'`);
    actionNames.push(`${item.name}, ${item.name}Result`);
    actionNameExports.push(item.name);
    reducers.push(getBoilerplateContent('redux/reducer.mustache', item).trim());
  });

  opts.exportSagas = exportSagas.join(',\n  ');
  opts.actionTypes = actionTypes.join(',\n    ');
  opts.actionNames = actionNames.join(',\n  ');
  opts.actionNameExports = actionNameExports.join(', ');
  opts.exportReducers = actionNameExports.join(',\n  ...');
  opts.reducers = reducers.join(',');
}

// ops
// type 0:component,1:component & redux,3:redux
function create(config, opts = { type: 0 }) {
  if (opts.type === 0 || opts.type === 1) {
    const name = _.upperFirst(_.camelCase(opts.name));
    const camelCaseName = _.camelCase(name);
    opts.camelCaseName = camelCaseName;
    const componentPath = join(config.directory.source, config.directory.component, name);
    mkdirsSync(componentPath);
    const vdConfigPath = join('.vd', 'components');
    mkdirsSync(vdConfigPath);

    writeFileSync(join(componentPath, 'index.js'),
      getBoilerplateContent('component/index.mustache',
        { name: name })
    );

    const lifecycle = {};
    const module = {};
    _.forEach(opts.lifecycle, (item) => lifecycle[item] = true);
    _.forEach(opts.module, (item) => module[item] = camelCaseName);

    if (opts.type === 1) {
      processSaga(opts);
      const reduxPath = join(config.directory.source, config.directory.redux, camelCaseName);
      mkdirsSync(reduxPath);
      writeFileSync(join(reduxPath, 'index.js'),
        getBoilerplateContent('redux/index.mustache',
          opts)
      );

      opts.sagas.forEach(item => {
        writeFileSync(join(reduxPath, `${item.filename}.js`),
          getBoilerplateContent('redux/singleSaga.mustache',
            item)
        );
      });
      const containerPath = join(config.directory.source, config.directory.container);
      mkdirsSync(containerPath);
      writeFileSync(join(containerPath, `${name}.js`),
        getBoilerplateContent('container/container.mustache',
          opts)
      );
    }

    writeFileSync(join(componentPath, `${name}.js`),
      getBoilerplateContent('component/component.mustache', {
        ...opts,
        lifecycle,
        module
      })
    );

    if (module.style) {
      const stylePath = join(componentPath, config.directory.style);
      mkdirsSync(stylePath);
      writeFileSync(join(stylePath, `${camelCaseName}.less`), '');
    }
    writeFileSync(join(vdConfigPath, `${camelCaseName}.json`), JSON.stringify(opts, null, 2));
  } else if (opts.type === 2) {
    const reduxPath = join(config.directory.source, config.directory.redux);
    const camelCaseName = _.camelCase(opts.name);
    mkdirsSync(reduxPath);
    processSaga(opts);
    writeFileSync(join(reduxPath, `${camelCaseName}.js`),
      getBoilerplateContent('redux/saga.mustache', {
        ...opts
      })
    );
  }
}

export default create;
