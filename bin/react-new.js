#!/usr/bin/env node

require('../lib/new')({
  cwd: process.cwd(),
  defaultConfigDir: process.env.USERPROFILE
});
