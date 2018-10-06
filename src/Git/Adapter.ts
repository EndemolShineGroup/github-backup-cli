import { spawn } from 'promisify-child-process';

import AdapterInterface from './AdapterInterface';

export default class Adapter implements AdapterInterface {
  // async getConfig() {
  //
  // }

  async setConfig(key: string, value: string, global: boolean = false) {
    const childProcess = spawn('git', [
      'config',
      global ? '--global' : '',
      key,
      value,
    ]);

    childProcess.stderr.on('data', (data) => {
      console.error(data);
    });

    await childProcess;
  }

  async clone(sourceRepository: string) {
    const childProcess = spawn('git', ['clone', '--mirror', sourceRepository]);

    childProcess.stderr.on('data', (data) => {
      console.error(data);
    });

    await childProcess;
  }

  async push(destinationRepository: string) {
    const childProcess = spawn('git', [
      'push',
      '--mirror',
      destinationRepository,
    ]);

    childProcess.stderr.on('data', (data) => {
      console.error(data);
    });

    await childProcess;
  }
}
