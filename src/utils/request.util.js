(function () {
  var request = require('request');

  exports.sendRequest = sendRequest;

  function sendRequest(url, headers, timeout) {
    return new Promise(function(resolve, reject) {
      request({
        url: url,
        headers: headers,
        timeout: timeout
      }, function (error, response, body) {
        if (error) return reject(error);

        return resolve(JSON.parse(body));
      });
    });
  }
}());
