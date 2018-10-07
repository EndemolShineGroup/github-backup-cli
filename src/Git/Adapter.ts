import ShellAdapter from '../Shell/Adapter';
import AdapterInterface from './AdapterInterface';

export default class Adapter extends ShellAdapter implements AdapterInterface {
  // async getConfig() {
  //
  // }

  async setConfig(key: string, value: string) {
    const command = ['git', 'config', key, `"${value}"`].join(' ');

    const childProcess = this.exec(command);

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }

  async clone(sourceRepository: string) {
    const command = ['git', 'clone', '--mirror', sourceRepository].join(' ');

    const childProcess = this.exec(command);

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }

  async push(destinationRepository: string) {
    const command = ['git', 'push', '--mirror', destinationRepository].join(
      ' ',
    );
    const childProcess = this.exec(command);

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }
}
