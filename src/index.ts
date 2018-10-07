#!/usr/bin/env node

/**
 * Module dependencies.
 */

import path from 'path';

import Octokit from '@octokit/rest';
import program from 'commander';
import { exec, spawn } from 'promisify-child-process';

import GitAdapter from './Git/Adapter';
import GitHubOrigin, { Repo } from './Origins/GitHub';
import ShellAdapter from './Shell/Adapter';

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

if (!program.token) {
  throw new Error('No GitHub token provided');
}

if (!program.region) {
  throw new Error('No AWS region specified');
}

const isOrganization: boolean = !!program.organization;

const gitAdapter = new GitAdapter(exec, spawn);
const shellAdapter = new ShellAdapter(exec, spawn);
const octokit = new Octokit();
octokit.authenticate({
  token: program.token,
  type: 'token',
});

const gitHubOrigin = new GitHubOrigin(octokit, {
  isOrganization,
  userOrOrgName: isOrganization ? program.organization : program.user,
});

const runRepoTasks = async (repo: Repo) => {
  await gitAdapter.clone(repo.httpsUrl);

  const clonedPath = path.join(process.cwd(), `${repo.name}.git`);
  const { stdout: lsOutput } = await shellAdapter.exec(`ls`, {
    cwd: clonedPath,
  });
  // tslint:disable-next-line:no-console
  console.log(lsOutput);
};

gitHubOrigin.list().then((repos) => {
  const firstRepo = repos[0];
  return runRepoTasks(firstRepo);
});
