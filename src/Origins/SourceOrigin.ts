import { Repo } from './GitHub';

export default interface SourceOrigin {
  list(): Promise<Repo[]>;
}
