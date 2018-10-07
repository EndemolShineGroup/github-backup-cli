import { ExecOptions, SpawnOptions } from 'child_process';

import AdapterInterface from './AdapterInterface';

export default class Adapter implements AdapterInterface {
  execFunc: Function;
  spawnFunc: Function;

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
    return this.execFunc(input, options);
  }

  async spawn(input: string, options?: SpawnOptions) {
    const { command, args } = Adapter.parseInput(input);

    return this.spawnFunc(command, args, options);
  }
}
