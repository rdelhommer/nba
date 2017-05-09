(function () {
  var urlUtil = require('../utils/url.util');
  var requestUtil = require('../utils/request.util');
  var responseUtil = require('../utils/response.util');
  var apiCfg = require('./configs/nba.api.config');

  exports.getTeamStats = getTeamStats;
  exports.getGameLogs = getGameLogs;

  function getTeamStats(params, headersToKeep) {
    return sendRequestGetResponse(
      apiCfg.requests.leagueDashTeamStats, params, headersToKeep);
  }

  function getGameLogs(params, headersToKeep) {
    return sendRequestGetResponse(
      apiCfg.requests.teamGameLogs, params, headersToKeep);
  }

  function sendRequestGetResponse(urlCfg, params, headersToKeep) {
    return new Promise(function(resolve, reject) {
      return setTimeout(function () {
        var url = urlUtil.buildUrl(urlCfg, params);
        requestUtil.sendRequest(
          url,
          apiCfg.general.headers,
          apiCfg.general.timeout)
          .then(function (response) {
            if (response.resultSets[0].rowSet.length === 0) return resolve(null);

            var ret = responseUtil.cleanResponse(response, headersToKeep);
            return resolve(ret);
          })
          .catch(reject);
      }, apiCfg.general.delay);
    });
  }
}());
