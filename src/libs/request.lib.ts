import * as request from 'request';

export class RequestWrapper {
  async sendRequest<TResponse>(url: string, headers: object, timeoutMs: number): Promise<TResponse> {
    return new Promise(function(resolve, reject) {
      request({
        url: url,
        headers: headers,
        timeout: timeoutMs
      }, function (error, response, body) {
        if (error) return reject(error);

        return resolve(JSON.parse(body));
      });
    });
  }
}
