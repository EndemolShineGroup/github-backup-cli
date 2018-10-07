import Octokit from '@octokit/rest';
import debug from 'debug';

import { Repo } from '../types';
import SourceOrigin from './SourceOrigin';

const log = debug('github-backup-cli:github');

export interface GitHubOptions {
  userOrOrgName: string;
  isOrganization: boolean;
}

export default class GitHub implements SourceOrigin {
  protected githubApi: Octokit;
  protected isOrganization: boolean;
  protected userOrOrgName: string;

  constructor(githubApi: Octokit, options: GitHubOptions) {
    this.githubApi = githubApi;
    this.isOrganization = options.isOrganization;
    this.userOrOrgName = options.userOrOrgName;
  }

  async list(): Promise<Repo[]> {
    const paginate = async (method: Function) => {
      let response = await method({ per_page: 100 });
      let { data } = response;
      while (this.githubApi.hasNextPage(response)) {
        response = await this.githubApi.getNextPage(response);
        data = data.concat(response.data);
      }
      return data;
    };

    log('Retrieving repositories from GitHub...');
    const listReposResponse = await paginate(this.githubApi.repos.getAll);
    log(`${listReposResponse.length} repositories found`);

    return listReposResponse.map(
      (item: any): Repo => {
        return {
          fullName: item.full_name,
          httpsUrl: item.clone_url.replace('.git', ''),
          name: item.name,
          sshUrl: item.ssh_url,
        };
      },
    );
  }
}
