import AdapterInterface from '../Git/AdapterInterface';
import DestinationOrigin from './DestinationOrigin';

export default class CodeCommit implements DestinationOrigin {
  adapter: AdapterInterface;
  host: string;

  constructor(adapter: AdapterInterface, region: string) {
    this.adapter = adapter;
    this.host = `https://git-codecommit.${region}.amazonaws.com/v1/repos`;
  }

  push(repoName: string): void {
    return this.adapter.push(`${this.host}/${repoName}`);
  }
}
