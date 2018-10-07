import { ExecOptions, SpawnOptions } from 'child_process';
import debug from 'debug';

import AdapterInterface from './AdapterInterface';

const log = debug('github-backup-cli:shell');

export default class Adapter implements AdapterInterface {
  protected execFunc: Function;
  protected spawnFunc: Function;

  constructor(execFunc: Function, spawnFunc: Function) {
    this.execFunc = execFunc;
    this.spawnFunc = spawnFunc;
  }

  protected static parseInput(input: string) {
    const args = input.split(' ');
    const command = args.shift() as string;

    return {
      args,
      command,
    };
  }

  async exec(input: string, options?: ExecOptions) {
    log(`Running '${input}' with exec()...`);
    return this.execFunc(input, options);
  }

  async spawn(input: string, options?: SpawnOptions) {
    const { command, args } = Adapter.parseInput(input);

    log(`Running '${command} ${args.join(' ')}' with spawn()...`);

    return this.spawnFunc(command, args, options);
  }
}
