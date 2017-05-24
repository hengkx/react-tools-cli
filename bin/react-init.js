#!/usr/bin/env node

const program = require('commander');

require('../lib/config')({
  cwd: process.cwd(),
  configDir: process.env.USERPROFILE
});
