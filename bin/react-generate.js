#!/usr/bin/env node

const program = require('commander');

program
  .option('--no-p, --no-progress', 'Don\'t generate progress')
  .option('-m, --method [method]', 'Specify request method, default get')
  .option('-i, --extraImport [extraImport]', 'Specify extraImport')
  .option('--base [base]', 'Specify base path, default src')
  .option('--entry [entry]', 'Specify entry path, default ${base}/src')
  .parse(process.argv);

require('../lib/generate')(program, {
  cwd: process.cwd(),
});
