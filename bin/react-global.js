#!/usr/bin/env node

const program = require('commander');

program
  .parse(process.argv);

require('../lib/global')(program, {
  cwd: process.cwd()
});
