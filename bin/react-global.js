#!/usr/bin/env node

const program = require('commander');

program
  .parse(process.argv);

require('../lib/config')(program, {
  configDir: process.env.USERPROFILE,
});
