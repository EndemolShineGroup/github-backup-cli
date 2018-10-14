import Octokit from '@octokit/rest';
import debug from 'debug';
import { Arguments } from 'yargs';

import GitHubOrigin from '../Origins/GitHub';

const log = debug('github-backup-cli:list');

export const command = `list <account>`;

export const describe = 'list all repositories in account';

export const builder = {};

export const handler = async (argv: Arguments) => {
  const { account } = argv;

  const octokit = new Octokit();
  octokit.authenticate({
    token: process.env.GH_TOKEN!,
    type: 'token',
  });
  const gitHubOrigin = new GitHubOrigin(octokit, {
    userOrOrgName: account,
  });

  const repos = await gitHubOrigin.list();

  const repoSlugs = repos.map((repo) => {
    return repo.fullName;
  });

  process.stdout.write(repoSlugs.join('\n') + '\n');
};
