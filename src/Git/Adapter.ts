import ShellAdapter from '../Shell/Adapter';
import AdapterInterface from './AdapterInterface';

export default class Adapter extends ShellAdapter implements AdapterInterface {
  // async getConfig() {
  //
  // }

  currentDirectory: string;

  get cwd(): string {
    return this.currentDirectory;
  }

  set cwd(cwd: string) {
    this.currentDirectory = cwd;
  }

  constructor(exec: Function, spawn: Function, cwd: string = process.cwd()) {
    super(exec, spawn);
    this.currentDirectory = cwd;
  }

  async clone(sourceRepository: string) {
    const command = ['git', 'clone', '--mirror', sourceRepository].join(' ');

    const childProcess = this.exec(command);

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }

  async setConfig(key: string, value: string) {
    const command = ['git', 'config', key, `"${value}"`].join(' ');

    const childProcess = this.exec(command, { cwd: this.cwd });

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }

  async push(destinationRepository: string) {
    const command = ['git', 'push', '--mirror', destinationRepository].join(
      ' ',
    );
    const childProcess = this.exec(command, { cwd: this.cwd });

    const { stdout } = await childProcess;
    // tslint:disable-next-line:no-console
    console.log(stdout);
  }
}
