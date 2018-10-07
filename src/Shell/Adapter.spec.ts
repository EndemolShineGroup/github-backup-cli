import Adapter from './Adapter';
import AdapterInterface from './AdapterInterface';

describe('Shell\\Adapter', () => {
  let adapter: AdapterInterface;
  let execMock: any;
  let spawnMock: any;

  beforeEach(() => {
    execMock = jest.fn();
    spawnMock = jest.fn();
    adapter = new Adapter(execMock, spawnMock);
  });

  describe('#exec', () => {
    it('calls exec() correctly', () => {
      adapter.exec('ls -la');
      expect(execMock).toHaveBeenCalledWith('ls -la', undefined);
    });
  });

  describe('#spawn', () => {
    it('calls spawn() correctly', () => {
      adapter.spawn('ls -la');
      expect(spawnMock).toHaveBeenCalledWith('ls', ['-la'], undefined);
    });
  });
});
