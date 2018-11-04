import path from 'path';

import debug from 'debug';
import { exec, spawn } from 'promisify-child-process';
import rimraf from 'rimraf';
import { Arguments, Argv } from 'yargs';

import CodeCommitOrigin from '../Origins/CodeCommit';
import GitAdapter from '../Shell/Git/Adapter';
import { Repo } from '../types';

const log = debug('github-backup-cli:backup');

export const command = `backup <repoSlug>`;

export const describe = 'backup repositories';

export const builder = (yargs: Argv) => {
  yargs.option('region', {
    demandOption: true,
    desc: 'The AWS region to backup the repository to',
    type: 'string',
  });
};

// @TODO Replace with better implementation from `serverless-test-utils`
const WORKING_DIR = path.join(
  '/',
  'tmp',
  `github-backup-cli-${new Date().toISOString()}`,
);

export const handler = async (argv: Arguments) => {
  const { region, repoSlug } = argv;
  const [, repoName] = repoSlug.split('/');
  log(`Backing up ${repoSlug}...`);

  const localRepoPath = path.join(WORKING_DIR, `${repoName}.git`);
  const gitAdapter = new GitAdapter(exec, spawn, localRepoPath);
  const codeCommitOrigin = new CodeCommitOrigin(region);

  // Check if repo exists on CodeCommit, if not, create it
  let codeCommitRepo!: Repo;
  try {
    codeCommitRepo = await codeCommitOrigin.get(repoName);
  } catch (error) {
    if (error.name === 'RepositoryDoesNotExistException') {
      codeCommitRepo = await codeCommitOrigin.create(repoName);
      return;
    }

    throw error;
  }

  if (!codeCommitRepo) {
    throw new Error(
      'There was an issue creating/retrieving the CodeCommit repo',
    );
  }

  // Clone repo from GitHub to local filesystem
  await gitAdapter.clone(
    `https://github.com/${repoSlug}`,
    path.join(WORKING_DIR, `${repoName}.git`),
  );

  // Set CodeCommit credential helper on repo-local configuration
  await gitAdapter.setConfig(
    'credential.helper',
    '!aws codecommit credential-helper $@',
  );
  await gitAdapter.setConfig('credential.UseHttpPath', 'true');

  // Push repo to CodeCommit
  await gitAdapter.push(codeCommitRepo.httpsUrl);

  // Remove cloned repo (cleanup)
  rimraf.sync(localRepoPath);
};
