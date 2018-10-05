#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';

const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-t, --token <token>', 'A GitHub personal access token')
  .option('-u, --user <user>', 'The GitHub user name. Skip if using organization name')
  .option('-o, --organization <organization>', 'The GitHub organization name. Skip if using user name')
  .option('-p, --profile <profile>', 'The AWS profile to use')
  .option('-r, --region <region>', 'The AWS region to use')
  .parse(process.argv);

if (program.user && program.organization) {
  throw new Error('Please specify GitHub user or organization, not both');
}

if (!program.region) {
  throw new Error('No AWS region specified');
}
