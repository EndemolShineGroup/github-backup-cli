import { ExecOptions, SpawnOptions } from 'child_process';
import { exec, spawn } from 'promisify-child-process';

import AdapterInterface from './AdapterInterface';

export default class Adapter implements AdapterInterface {
  protected parseInput(input: string) {
    const args = input.split(' ');
    const command = args.shift() as string;

    return {
      args,
      command,
    };
  }

  protected handleError = (data: any) => {
    // tslint:disable-next-line:no-console
    console.error(data);
  };

  async exec(input: string, options?: ExecOptions) {
    const child = exec(input, options);
    child.stderr.on('data', this.handleError);
    return child;
  }

  async spawn(input: string, options?: SpawnOptions) {
    const { command, args } = this.parseInput(input);

    const child = spawn(command, args, options);
    child.stderr.on('data', this.handleError);
    return child;
  }
}
