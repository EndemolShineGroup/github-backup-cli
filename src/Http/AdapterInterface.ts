export default interface AdapterInterface {
  fetch(url: string, opts?: any): Promise<any>;
}
