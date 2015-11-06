#!/usr/bin/env node

var hw = require('headway');
var argv = require('minimist')(process.argv.slice(2));

// start fokus
require('../src/fokus')(argv);

process.on('uncaughtException', function(err){
  hw.log("{red}" + 'Run fokus using sudo');
  process.exit(1);
});

