export type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

export interface Repo {
  fullName: string;
  name: string;
  httpsUrl: string;
  sshUrl: string;
}
