(function () {
  var request = require('request');

  var apiConfig = require('./configs/api.config');
  var urlUtil = require('./utils/url.util');
  var responseUtil = require('./utils/response.util');

  exports.getTeamStats = getTeamStats;
  exports.getGameLogs = getGameLogs;

  function getTeamStats(params, headersToKeep) {
    return sendRequestGetResponse(urlUtil.leagueDashTeamStats, params, headersToKeep);
  }

  function getGameLogs(params, headersToKeep) {
    return sendRequestGetResponse(urlUtil.teamGameLogs, params, headersToKeep);
  }

  function sendRequestGetResponse(urlObj, params, headersToKeep) {
    return new Promise(function(resolve, reject) {
      var url = urlUtil.buildUrl(urlObj, params);
      sendRequest(url)
        .then(function (response) {
          if (response.resultSets[0].rowSet.length === 0) return resolve(null);

          var ret = responseUtil.cleanResponse(response, headersToKeep);
          return resolve(ret);
        })
        .catch(reject);
    });

    function sendRequest(url) {
      return new Promise(function(resolve, reject) {
        setTimeout(function () {
          request({
            url: url,
            headers: apiConfig.request.headers,
            timeout: apiConfig.request.timeout
          }, function (error, response, body) {
            if (error) return reject(error);

            return resolve(JSON.parse(body));
          });
        }, apiConfig.request.delay);
      });
    }
  }
}());
