import Adapter from './Adapter';
import AdapterInterface from './AdapterInterface';

describe('Git\\Adapter', () => {
  let adapter: AdapterInterface;
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

  describe('#setConfig', () => {
    it('calls setConfig() correctly', () => {
      const key = 'user.name';
      const value = 'John Doe';
      adapter.setConfig(key, value);
      expect(execMock).toHaveBeenCalledWith(
        `git config ${key} "${value}"`,
        undefined,
      );
    });
  });

  describe('#clone', () => {
    it('calls clone() correctly', () => {
      const repoUrl = 'https://github.com/EndemolShineGroup/github-backup-cli';
      adapter.clone(repoUrl);
      expect(execMock).toHaveBeenCalledWith(
        `git clone --mirror ${repoUrl}`,
        undefined,
      );
    });
  });

  describe('#push', () => {
    it('calls push() correctly', () => {
      const repoUrl = 'https://github.com/EndemolShineGroup/github-backup-cli';
      adapter.push(repoUrl);
      expect(execMock).toHaveBeenCalledWith(
        `git push --mirror ${repoUrl}`,
        undefined,
      );
    });
  });
});
