import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import colors from 'colors';

function init(program, { cwd }) {
  prompt.message = '';
  prompt.start();
  prompt.get([
    {
      name: 'urlPrefix',
      description: colors.magenta('url prefix'),
      type: 'string'
    },
    // {
    //   name: 'progress',
    //   description: colors.magenta('progress'),
    //   type: 'boolean',
    //   default: true
    // },
    {
      name: 'method',
      description: colors.magenta('method'),
      type: 'string',
      default: 'get'
    },
    {
      name: 'extraImport',
      description: colors.magenta('extra import'),
      type: 'string',
      default: ''
    },
    // {
    //   name: 'surname',
    //   description: 'Your surname',
    //   type: 'string',
    //   required: true,
    //   message: 'Please dont use the demo credentials',
    //   conform: function (surname) {
    //     var name = prompt.history('name').value;
    //     return (name !== 'John' || surname !== 'Smith');
    //   }
    // }
  ], function (err, result) {
    fs.writeFileSync(path.join(cwd, '.reactconfig'), JSON.stringify(result, null, 2));
  });
}

export default init;
