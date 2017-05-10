import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import chokidar from 'chokidar';
import { getWatchSagas, getActions } from './utils/saga';

function watch(program, { cwd }) {
  const sagaPath = path.join(cwd, 'src', 'sagas');

  const sagas = [];

  const listenPath = `${sagaPath}/**/*.js`;
  chokidar.watch(listenPath,
    { ignored: 'index.js' })
    .on('all', (event, filepath) => {
      if (event === 'unlink') {
        // sagas

      } else {
        fs.readFile(filepath, 'utf-8', function (err, data) {
          if (err) {
            console.log("error");
          } else {
            sagas.push({
              [path.basename(filepath)]: getWatchSagas(data)
            });
            console.log(sagas);
          }
        });
      }
    })
    .on('ready', () => console.log('Initial scan complete. Ready for changes'))
    .on('error', error => console.log(`Watcher error: ${error}`));
}

export default watch;
