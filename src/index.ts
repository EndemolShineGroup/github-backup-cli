#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';

import { getOrganizationRepos, getUserRepos } from './lib/github';

const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-t, --token <token>', 'A GitHub personal access token')
  .option(
    '-u, --user <user>',
    'The GitHub user userOrOrgName. Skip if using organization userOrOrgName',
  )
  .option(
    '-o, --organization <organization>',
    'The GitHub organization userOrOrgName. Skip if using user userOrOrgName',
  )
  .option('-p, --profile <profile>', 'The AWS profile to use')
  .option('-r, --region <region>', 'The AWS region to use')
  .parse(process.argv);

if (program.user && program.organization) {
  throw new Error('Please specify GitHub user or organization, not both');
}

if (!program.region) {
  throw new Error('No AWS region specified');
}

const name = program.user ? program.user : program.organization;

const getRepositories = program.user ? getUserRepos : getOrganizationRepos;

getRepositories(name, program.token).then((repoList) => {
  // repoList.forEach((repo: any) => {
  //   console.log(repo.full_name);
  // })
});
