export default interface AdapterInterface {
  setConfig(key: string, value: string): void;
  clone(url: string): void;
  push(url: string): void;
}
