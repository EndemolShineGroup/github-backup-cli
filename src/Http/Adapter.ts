import 'isomorphic-fetch';

import AdapterInterface from './AdapterInterface';

export default class Adapter implements AdapterInterface {
  fetchFunction: typeof fetch;

  constructor(fetchFunction: typeof fetch) {
    this.fetchFunction = fetchFunction;
  }

  static async checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    const json = await response.json();
    let error = new Error(json.message);
    (error as any)['response'] = json;
    throw error;
  }

  async fetch<T extends any>(url: string, options?: RequestInit): Promise<T> {
    const response = await this.fetchFunction(url, options).then(
      Adapter.checkStatus,
    );
    return await response.json();
  }
}
