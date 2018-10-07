import CodeCommitSDK from 'aws-sdk/clients/codecommit';

import CodeCommit from './CodeCommit';

const createAwsResponse = (data: any) => {
  return {
    promise: () => {
      return Promise.resolve(data);
    },
  };
};

const createAwsError = (name: string) => {
  return {
    promise: () => {
      const error = new Error('An error occurred');
      error.name = name;
      throw error;
    },
  };
};

describe('CodeCommit', () => {
  let codeCommitSDKMock: CodeCommitSDK;
  let origin: CodeCommit;
  let region: string = 'us-east-1';

  beforeEach(() => {
    codeCommitSDKMock = ({
      createRepository: jest.fn(() => {
        return createAwsResponse({
          repositoryMetadata: {
            cloneUrlHttp: 'https://github-backup-cli',
            cloneUrlSsh: 'ssh://github-backup-cli',
            repositoryName: 'github-backup-cli',
          },
        });
      }),
      getRepository: jest.fn(() => {
        return createAwsResponse({
          repositoryMetadata: {
            cloneUrlHttp: 'https://github-backup-cli',
            cloneUrlSsh: 'ssh://github-backup-cli',
            repositoryName: 'github-backup-cli',
          },
        });
      }),
    } as unknown) as CodeCommitSDK;
    origin = new CodeCommit(region, codeCommitSDKMock);
  });

  describe('#create', () => {
    it('calls the CodeCommit SDK correctly', async () => {
      const repoName = 'github-backup-cli';
      await origin.create(repoName);

      expect(codeCommitSDKMock.createRepository).toHaveBeenCalledWith({
        repositoryName: repoName,
      });
    });
  });

  describe('#get', () => {
    it('calls the CodeCommit SDK correctly', async () => {
      const repoName = 'github-backup-cli';
      await origin.get(repoName);

      expect(codeCommitSDKMock.getRepository).toHaveBeenCalledWith({
        repositoryName: repoName,
      });
    });
  });

  it('throws if no repository was found ', async () => {
    const repoName = 'github-backup-cli';

    codeCommitSDKMock.getRepository = jest.fn(() => {
      return createAwsError('RepositoryDoesNotExistException');
    });
    origin = new CodeCommit('us-east-1', codeCommitSDKMock);

    try {
      await origin.get(repoName);
    } catch (error) {
      expect(error.name).toEqual('RepositoryDoesNotExistException');
    }
  });
});
