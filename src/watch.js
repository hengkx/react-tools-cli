import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import chokidar from 'chokidar';
import omit from 'object.omit';
import chalk from 'chalk';
import _ from 'lodash';
import { getWatchSagas, getActions } from './utils/saga';

function handleSagaChange(saga, sagaIndexPath, reducerIndexPath) {
  if (saga) {
    let str = '';
    let reducerStr = `import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
`;
    const allKey = [];
    const allSaga = [];
    Object.keys(saga).forEach(key => {
      const content = saga[key];
      if (content) {
        const sagas = _.map(content, 'name');
        allSaga.push(...sagas);
        if (sagas.length > 0) {
          allKey.push(key);
          reducerStr += `import ${key} from '../sagas/${key}';\n`;
          str += `import { ${sagas.join(', ')} } from './${key}';\n`;
        }
      }
    });
    str += `\nexport default function* rootSaga() {
  yield [
    ${allSaga.join('(),\n    ')}()\n  ];
}
`;
    fs.writeFileSync(sagaIndexPath, str);
    reducerStr += `\nexport default combineReducers({
  routing: routerReducer,
  nprogress,
  ${allKey.join(',\n  ')}\n});
`;
    fs.writeFileSync(reducerIndexPath, reducerStr);
    console.log(chalk.green.bold('更新成功！'));
  }
}


function watch(program, { cwd }) {
  const sagaPath = path.join(cwd, 'src', 'sagas');
  if (!fs.existsSync(sagaPath)) fs.mkdirsSync(sagaPath);
  const sagaIndexPath = path.join(sagaPath, "index.js");
  const reducerPath = path.join(cwd, 'src', 'reducers');
  if (!fs.existsSync(reducerPath)) fs.mkdirsSync(reducerPath);
  const reducerIndexPath = path.join(reducerPath, 'index.js');
  let sagas = {};
  let isInitFinished = false;
  const listenPath = `${sagaPath}/**/*.js`;
  chokidar.watch(listenPath,
    { ignored: /index.js/ })
    .on('all', (event, filepath) => {
      const name = path.basename(filepath).replace(".js", "");
      if (event === 'unlink') {
        sagas = omit(sagas, name);
      } else {
        const data = fs.readFileSync(filepath, 'utf-8');
        sagas[name] = getWatchSagas(data);
      }
      if (isInitFinished) {
        handleSagaChange(sagas, sagaIndexPath, reducerIndexPath);
      }
    })
    .on('ready', () => {
      isInitFinished = true;
      handleSagaChange(sagas, sagaIndexPath, reducerIndexPath);
    })
    .on('error', error => console.log(`Watcher error: ${error}`));
}

export default watch;
