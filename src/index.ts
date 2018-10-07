#!/usr/bin/env node

/**
 * Module dependencies.
 */

import path from 'path';

import Octokit from '@octokit/rest';
import ProgressBar from 'cli-progress';
import Program from 'commander';
import debug from 'debug';
import { exec, spawn } from 'promisify-child-process';

import CodeCommitOrigin from './Origins/CodeCommit';
import GitHubOrigin from './Origins/GitHub';
import ShellAdapter from './Shell/Adapter';
import GitAdapter from './Shell/Git/Adapter';
import { Repo } from './types';

const pkg = require('../package.json');
const WORKING_DIR = path.join(
  '/',
  'tmp',
  `github-backup-cli-${new Date().toISOString()}`,
);

const log = debug('github-backup-cli:main');
const progressBar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);
const shellAdapter = new ShellAdapter(exec, spawn);

Program.version(pkg.version)
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

if (Program.user && Program.organization) {
  throw new Error('Please specify GitHub user or organization, not both');
}

if (!Program.token) {
  throw new Error('No GitHub token provided');
}

if (!Program.region) {
  throw new Error('No AWS region specified');
}

const isOrganization: boolean = !!Program.organization;

const runRepoTasks = async (repo: Repo) => {
  const localRepoPath = path.join(WORKING_DIR, `${repo.name}.git`);
  const gitAdapter = new GitAdapter(exec, spawn, localRepoPath);
  const codeCommitOrigin = new CodeCommitOrigin(Program.region);

  // Check if repo exists on CodeCommit, if not, create it
  let codeCommitRepo: Repo;
  try {
    codeCommitRepo = await codeCommitOrigin.get(repo.name);
  } catch (error) {
    if (error.name === 'RepositoryDoesNotExistException') {
      codeCommitRepo = await codeCommitOrigin.create(repo.name);
    }
  }

  // Clone repo from GitHub to local filesystem
  await gitAdapter.clone(
    repo.httpsUrl,
    path.join(WORKING_DIR, `${repo.name}.git`),
  );

  // Set CodeCommit credential helper on repo-local configuration
  await gitAdapter.setConfig(
    'credential.helper',
    '!aws codecommit credential-helper $@',
  );
  await gitAdapter.setConfig('credential.UseHttpPath', 'true');

  // Push repo to CodeCommit
  await gitAdapter.push(codeCommitRepo!.httpsUrl);

  // Remove cloned repo (cleanup)
};

// Main
Promise.resolve()
  .then(async () => {
    // Create folder in /tmp
    return shellAdapter.exec(`mkdir ${WORKING_DIR}`);
  })
  .then(() => {
    const octokit = new Octokit();
    octokit.authenticate({
      token: Program.token,
      type: 'token',
    });
    const gitHubOrigin = new GitHubOrigin(octokit, {
      isOrganization,
      userOrOrgName: isOrganization ? Program.organization : Program.user,
    });

    return gitHubOrigin.list();
  })
  .then(async (repos) => {
    progressBar.start(repos.length, 0);

    const failures: Repo[] = [];

    const runOnRepo = (repo: Repo) => {
      return runRepoTasks(repo)
        .then(() => {
          progressBar.update(1);
        })
        .catch((error) => {
          failures.push(repo);
        });
    };

    // const firstRepo = repos[0];
    // return runOnRepo(firstRepo)
    await Promise.all(repos.map(runOnRepo)).then(() => {
      progressBar.stop();

      // tslint:disable-next-line:no-console
      console.log(`Failed to backup ${failures.length} repositories`);
      // tslint:disable-next-line:no-console
      console.log(failures.map((repo) => ` - ${repo.name}`).join('\n'));
    });
  })
  .catch((error) => {
    log(error.message);
  });
