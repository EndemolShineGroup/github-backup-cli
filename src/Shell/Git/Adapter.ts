import debug from 'debug';

import ShellAdapter from '../Adapter';
import AdapterInterface from './AdapterInterface';

const log = debug('github-backup-cli:git');

export default class Adapter extends ShellAdapter implements AdapterInterface {
  // async getConfig() {
  //
  // }

  protected currentDirectory: string;

  get cwd(): string {
    return this.currentDirectory;
  }

  set cwd(cwd: string) {
    log(`Changing directory to ${cwd}...`);
    this.currentDirectory = cwd;
  }

  constructor(exec: Function, spawn: Function, cwd: string = process.cwd()) {
    super(exec, spawn);
    this.currentDirectory = cwd;
  }

  async clone(sourceRepository: string, path?: string) {
    const command = ['git', 'clone', '--mirror', sourceRepository, path]
      .filter((arg) => arg)
      .join(' ');
    // log(`Cloning repo ${sourceRepository}...`);

    const childProcess = this.exec(command);

    const { stderr, stdout } = await childProcess;
    if (stderr) {
      log(stderr);
    }
    log(stdout);
  }

  async setConfig(key: string, value: string) {
    const command = ['git', 'config', key, `'${value}'`].join(' ');
    // log(`Setting local Git config ${key} as ${value}...`);

    const childProcess = this.exec(command, { cwd: this.cwd });

    const { stderr, stdout } = await childProcess;
    if (stderr) {
      log(stderr);
    }
    log(stdout);
  }

  async push(destinationRepository: string) {
    const command = ['git', 'push', '--mirror', destinationRepository].join(
      ' ',
    );
    // log(`Pushing repo ${destinationRepository}...`);

    const childProcess = this.exec(command, { cwd: this.cwd });

    const { stderr, stdout } = await childProcess;
    if (stderr) {
      log(stderr);
    }
    log(stdout);
  }
}
