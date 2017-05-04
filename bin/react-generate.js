#!/usr/bin/env node

const program = require('commander');

program
  .option('--no-css', 'Don\'t generate css for component and routeComponent')
  .option('--base [base]', 'Specify base path, default src')
  .option('--entry [entry]', 'Specify entry path, default ${base}/src')
  .parse(process.argv);

require('../lib/generate')(program, {
  cwd: process.cwd(),
});