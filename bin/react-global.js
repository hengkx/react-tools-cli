#!/usr/bin/env node

require('../lib/config')({
  defaultConfigDir: process.env.USERPROFILE,
});
