import { ExecOptions, SpawnOptions } from 'child_process';

export default interface AdapterInterface {
  exec(input: string, options?: ExecOptions): void;
  spawn(input: string, options?: SpawnOptions): void;
}
