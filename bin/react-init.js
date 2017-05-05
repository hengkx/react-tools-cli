#!/usr/bin/env node

const program = require('commander');

program
  .parse(process.argv);

require('../lib/init')(program, {
  cwd: process.cwd(),
});
