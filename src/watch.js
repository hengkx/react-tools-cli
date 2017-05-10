import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import chokidar from 'chokidar';
import omit from 'object.omit';
import _ from 'lodash';
import { getWatchSagas, getActions } from './utils/saga';

function watch(program, { cwd }) {
  const sagaPath = path.join(cwd, 'src', 'sagas');

  let sagas = {};

  const listenPath = `${sagaPath}/**/*.js`;
  chokidar.watch(listenPath,
    { ignored: 'index.js' })
    .on('all', (event, filepath) => {
      if (event === 'unlink') {
        sagas = omit(sagas, path.basename(filepath));
        console.log(sagas);
      } else {
        fs.readFile(filepath, 'utf-8', function (err, data) {
          if (err) {
            console.log("error");
          } else {
            sagas[path.basename(filepath)] = getWatchSagas(data);
            console.log(sagas);
          }
        });
      }
    })
    .on('ready', () => console.log('Initial scan complete. Ready for changes'))
    .on('error', error => console.log(`Watcher error: ${error}`));
}

export default watch;
