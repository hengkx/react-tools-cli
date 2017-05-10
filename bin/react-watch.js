#!/usr/bin/env node

const program = require('commander');

program
  .parse(process.argv);

require('../lib/watch')(program, {
  cwd: process.cwd()
});
