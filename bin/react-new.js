#!/usr/bin/env node

require('../lib/new')({
  cwd: process.cwd(),
  appData: process.env.APPDATA,
  defaultConfigDir: process.env.USERPROFILE
});
