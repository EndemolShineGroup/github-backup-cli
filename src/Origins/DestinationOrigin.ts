import { Repo } from '../types';

export default interface DestinationOrigin {
  create(repoName: string): Promise<Repo>;
  get(repoName: string): Promise<Repo>;
}
