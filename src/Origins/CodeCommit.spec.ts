import AdapterInterface from '../Git/AdapterInterface';
import CodeCommit from './CodeCommit';

describe('CodeCommit', () => {
  let adapter: AdapterInterface;
  let origin: CodeCommit;
  let region: string = 'us-east-1';

  beforeEach(() => {
    adapter = {
      setConfig: jest.fn(),

      clone: jest.fn(),
      push: jest.fn(),
    };
    origin = new CodeCommit(adapter, region);
  });

  describe('#push', () => {
    it('calls the adapter correctly', () => {
      const repoName = 'github-backup-cli';
      origin.push(repoName);

      expect(adapter.push).toHaveBeenCalledWith(
        `https://git-codecommit.${region}.amazonaws.com/v1/repos/${repoName}`,
      );
    });
  });
});
