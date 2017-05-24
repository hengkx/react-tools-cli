#!/usr/bin/env node

const program = require('commander');

program
  .parse(process.argv);

require('../lib/config')(program, {
  cwd: process.cwd(),
  configDir: process.env.USERPROFILE
});
