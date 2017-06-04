#!/usr/bin/env node

const program = require('commander');

require('../lib/create')({
  cwd: process.cwd(),
  defaultConfigDir: process.env.USERPROFILE
});
