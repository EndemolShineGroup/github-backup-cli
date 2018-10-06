import GitAdapterInterface from '../Git/AdapterInterface';
import HttpAdapterInterface from '../Http/AdapterInterface';
import GitHub from './GitHub';

const ORG_NAME = '@endemolshinegroup';

describe('GitHub', () => {

  let gitAdapter: GitAdapterInterface;
  let httpAdapter: HttpAdapterInterface;
  let origin: GitHub;

  beforeEach(() => {
    gitAdapter = {
      setConfig: jest.fn(),

      clone: jest.fn(),
      push: jest.fn(),
    };
    httpAdapter = {
      fetch: jest.fn(),
    };
    origin = new GitHub(gitAdapter, httpAdapter, { userOrOrgName: ORG_NAME, isOrganization: true, token: '123' });
  });

  describe('#push', () => {
    it('calls the Git Adapter correctly', () => {
      const repoName = 'github-backup-cli';
      origin.clone(repoName);

      expect(gitAdapter.clone).toHaveBeenCalledWith(`https://github.com/${ORG_NAME}/${repoName}`);
    });
  });
});
