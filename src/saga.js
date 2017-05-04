import { basename, dirname, join } from 'path';
import { statSync, readFileSync } from 'fs';

function saga(program, { cwd }) {
  console.log(program.css);
  console.log(program.base);
  console.log(program.a);
  console.log(program.args);
  const [type, name] = program.args;
  console.log(type, name);
  console.log(cwd);

  const listenPath = `${cwd}/src/sagas/**/*.js`;
  chokidar.watch(listenPath,
    { ignored: 'index.js', interval: 100, })
    .on('all', (event, path) => {
      fs.readFile(path, 'utf-8', function (err, data) {
        if (err) {
          console.log("error");
        } else {
          const pattern = /(\/\/(.*)[\r\n|\n|\r]+)?export function\* (\w+)\(\)?/g;
          let res;
          while ((res = pattern.exec(data)) != null) {
            //          注释     saga名称
            console.log(res[2], res[3]);
          }
        }
      });
    })
    .on('ready', () => log('Initial scan complete. Ready for changes'))
    .on('error', error => log(`Watcher error: ${error}`));
}

export default saga;
