#!/usr/bin/env node

import path from 'path';

import yargs from 'yargs';

const commandsPath = path.join(__dirname, 'Commands');

// tslint:disable-next-line:no-unused-expression
yargs
  .commandDir(commandsPath)
  .demandCommand()
  .help().argv;
