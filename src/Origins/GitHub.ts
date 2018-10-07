import Octokit from '@octokit/rest';

import SourceOrigin from './SourceOrigin';

export interface GitHubOptions {
  userOrOrgName: string;
  isOrganization: boolean;
}

export interface Repo {
  fullName: string;
  name: string;
  httpsUrl: string;
  sshUrl: string;
}

export default class GitHub implements SourceOrigin {
  githubApi: Octokit;
  host: string = 'https://github.com';
  isOrganization: boolean;
  userOrOrgName: string;

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

    const listReposResponse = await paginate(this.githubApi.repos.getAll);

    return listReposResponse.map(
      (item: any): Repo => {
        return {
          name: item.name,
          fullName: item.full_name,
          httpsUrl: item.clone_url.replace('.git', ''),
          sshUrl: item.ssh_url,
        };
      },
    );
  }
}
