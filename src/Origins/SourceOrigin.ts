export default interface SourceOrigin {
  list(): Promise<string>;
  clone(repoName: string): void;
}
