import GitAdapterInterface from '../Git/AdapterInterface';
import HttpAdapterInterface from '../Http/AdapterInterface';
import SourceOrigin from './SourceOrigin';

export interface GitHubOptions {
  userOrOrgName: string;
  isOrganization: boolean;
  token: string;
}

export default class GitHub implements SourceOrigin {

  gitAdapter: GitAdapterInterface;
  httpAdapter: HttpAdapterInterface;

  host: string = 'https://github.com';

  isOrganization: boolean;
  userOrOrgName: string;
  token: string;

  constructor(gitAdapter: GitAdapterInterface, httpAdapter: HttpAdapterInterface, options: GitHubOptions) {
    this.gitAdapter = gitAdapter;
    this.httpAdapter = httpAdapter;
    this.isOrganization = options.isOrganization;
    this.userOrOrgName = options.userOrOrgName;
    this.token = options.token;
  }

  list(): Promise<string> {
    const apiHost = this.host.replace('https://', 'https://api.');

    const endpoint = this.isOrganization
      ? 'orgs'
      : 'users';

    return this.httpAdapter.fetch(`${apiHost}/${endpoint}/${this.userOrOrgName}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    });
  }

  clone(repoName: string) {
    return this.gitAdapter.clone(`${this.host}/${this.userOrOrgName}/${repoName}`);
  }
}
