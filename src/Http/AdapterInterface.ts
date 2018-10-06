export default interface AdapterInterface {
  fetch<T extends any>(url: string, options?: any): Promise<T>;
}
