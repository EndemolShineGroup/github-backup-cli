import { Repo } from '../types';

export default interface SourceOrigin {
  list(): Promise<Repo[]>;
}
