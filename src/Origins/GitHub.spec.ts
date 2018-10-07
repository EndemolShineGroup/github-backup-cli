import Octokit from '@octokit/rest';

import GitHub from './GitHub';

const ORG_NAME = '@endemolshinegroup';

describe('GitHub', () => {
  let octokit: Octokit;
  let origin: GitHub;

  beforeEach(() => {
    octokit = {
      getNextPage: jest.fn(),
      hasNextPage: jest.fn(() => {
        return false;
      }),
      // @ts-ignore,
      repos: {
        getAll: jest.fn(() => {
          return {
            data: [],
          };
        }),
      },
    };
    origin = new GitHub(octokit, {
      isOrganization: true,
      userOrOrgName: ORG_NAME,
    });
  });

  describe('#list', () => {
    it('calls Octokit correctly', async () => {
      // const repoName = 'github-backup-cli';
      await origin.list();

      expect(octokit.repos.getAll).toHaveBeenCalledWith({ per_page: 100 });
    });
  });
});
