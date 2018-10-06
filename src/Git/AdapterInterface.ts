export default interface AdapterInterface {
  setConfig(key: string, value: string, global: boolean): void;
  clone(url: string): void;
  push(url: string): void;
}
