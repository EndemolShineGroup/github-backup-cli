import Adapter from './Adapter';

describe('Git\\Adapter', () => {
  let adapter: Adapter;
  let execMock: any;
  let spawnMock: any;

  beforeEach(() => {
    execMock = jest.fn(() => {
      return Promise.resolve({
        stdout: '',
      });
    });
    spawnMock = jest.fn();
    adapter = new Adapter(execMock, spawnMock);
  });

  describe('#setcwd', () => {
    it('calls setcwd() correctly', () => {
      const path = '/tmp';
      adapter.cwd = path;
      expect(adapter.cwd).toEqual(path);
    });
  });

  describe('#setConfig', () => {
    it('calls setConfig() correctly', async () => {
      const key = 'user.name';
      const value = 'John Doe';
      await adapter.setConfig(key, value);
      expect(execMock).toHaveBeenCalledWith(`git config ${key} "${value}"`, {
        cwd: process.cwd(),
      });
    });
  });

  describe('#clone', () => {
    it('calls clone() correctly', async () => {
      const repoUrl = 'https://github.com/EndemolShineGroup/github-backup-cli';
      await adapter.clone(repoUrl);
      expect(execMock).toHaveBeenCalledWith(
        `git clone --mirror ${repoUrl}`,
        undefined,
      );
    });
  });

  describe('#push', () => {
    it('calls push() correctly', async () => {
      const repoUrl = 'https://github.com/EndemolShineGroup/github-backup-cli';
      await adapter.push(repoUrl);
      expect(execMock).toHaveBeenCalledWith(`git push --mirror ${repoUrl}`, {
        cwd: process.cwd(),
      });
    });
  });
});
