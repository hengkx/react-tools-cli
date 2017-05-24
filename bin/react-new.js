#!/usr/bin/env node

const program = require('commander');
console.log(require('../lib/new'));

require('../lib/new')(program, {
  cwd: process.cwd(),
  defaultConfigDir: process.env.USERPROFILE
});
