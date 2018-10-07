import CodeCommitSDK, { RepositoryMetadata } from 'aws-sdk/clients/codecommit';
import debug from 'debug';

import { Repo } from '../types';
import DestinationOrigin from './DestinationOrigin';

const log = debug('github-backup-cli:codecommit');

export default class CodeCommit implements DestinationOrigin {
  protected codeCommitSDK: CodeCommitSDK;

  constructor(region: string, codeCommitSDK?: CodeCommitSDK) {
    this.codeCommitSDK = codeCommitSDK || new CodeCommitSDK({ region });
  }

  async create(repoName: string): Promise<Repo> {
    log(`Creating repository ${repoName} on CodeCommit...`);
    const response = await this.codeCommitSDK
      .createRepository({
        repositoryName: repoName,
      })
      .promise();

    const repoData = response.repositoryMetadata as Required<
      RepositoryMetadata
    >;

    return Promise.resolve(this.filterRepoData(repoData));
  }

  async get(repoName: string): Promise<Repo> {
    log(`Retrieving repository ${repoName} from CodeCommit...`);
    const response = await this.codeCommitSDK
      .getRepository({
        repositoryName: repoName,
      })
      .promise();

    const repoData = response.repositoryMetadata as Required<
      RepositoryMetadata
    >;

    return Promise.resolve(this.filterRepoData(repoData));
  }

  protected filterRepoData(repoData: Required<RepositoryMetadata>): Repo {
    return {
      fullName: repoData.repositoryName,
      httpsUrl: repoData.cloneUrlHttp,
      name: repoData.repositoryName,
      sshUrl: repoData.cloneUrlSsh,
    };
  }
}
