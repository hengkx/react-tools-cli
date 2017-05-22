import path from 'path';
import fs from 'fs-extra';
import prompt from 'prompt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import clear from 'clear';
import colors from 'colors';

function init(program, { cwd }) {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('React Tools', { horizontalLayout: 'full' })
    )
  );
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
  inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Which request would you like to method?',
      choices: ['get', 'post', 'put', 'delete'],
      default: 'post'
    },
    {
      type: 'checkbox',
      message: 'Select Lifecycle',
      name: 'lifecycle',
      choices: [
        new inquirer.Separator('Mounting'),
        {
          name: 'constructor'
        },
        {
          name: 'componentWillMount'
        },
        {
          name: 'render',
          disabled: true
        },
        {
          name: 'componentDidMount'
        },
        new inquirer.Separator('Updating'),
        {
          name: 'componentWillReceiveProps'
        },
        {
          name: 'shouldComponentUpdate'
        },
        {
          name: 'componentWillUpdate'
        },
        {
          name: 'render',
          disabled: true
        },
        {
          name: 'componentDidUpdate'
        },
        new inquirer.Separator('Unmounting'),
        {
          name: 'componentWillUnmount'
        }
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one topping.';
        }
        return true;
      }
    }
  ]).then(function (answers) {
    console.log(JSON.stringify(answers, null, '  '));
  });
}

export default init;
