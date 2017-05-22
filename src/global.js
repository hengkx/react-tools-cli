import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import colors from 'colors';

function init(program, { cwd }) {
  prompt.message = '';
  // prompt.message = colors.rainbow("Question!");
  // prompt.delimiter = colors.green("><");
  prompt.start();
  const descriptionColor = colors.magenta;
  const schema = {
    properties: {
      directory: {
        properties: {
          source: {
            required: true,
            default: 'src',
            description: descriptionColor('source directory'),
          },
          component: {
            required: true,
            default: 'components',
            description: descriptionColor('component directory'),
          },
          script: {
            required: true,
            default: 'js',
            description: descriptionColor('component script directory'),
          },
          style: {
            required: true,
            default: 'less',
            description: descriptionColor('component style directory'),
          },
          image: {
            required: true,
            default: 'images',
            description: descriptionColor('component image directory'),
          },
          staticData: {
            required: true,
            default: 'json',
            description: descriptionColor('component static data directory'),
          },
        }
      },
      saga: {
        properties: {
          urlPrefix: {
            description: descriptionColor('url prefix'),
          },
          method: {
            required: true,
            default: 'get',
            description: descriptionColor('method'),
          },
          extraImport: {
            description: descriptionColor('extra import'),
          }
        }
      }
    }
  };

  prompt.get(schema
    // [
    //   {
    //     name: 'urlPrefix',
    //     description: colors.magenta('url prefix'),
    //     type: 'string'
    //   },
    //   {
    //     name: 'method',
    //     description: colors.magenta('method'),
    //     type: 'string',
    //     default: 'get'
    //   },
    //   {
    //     name: 'extraImport',
    //     description: colors.magenta('extra import'),
    //     type: 'string',
    //     default: ''
    //   }
    // ]
    , function (err, result) {
      fs.writeFileSync(path.join(cwd, '.reactconfig'), JSON.stringify(result, null, 2));
    });
}

export default init;
