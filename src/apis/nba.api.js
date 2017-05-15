(function () {
  var async = require('async');

  var urlUtil = require('../utils/url.util');
  var requestUtil = require('../utils/request.util');
  var responseUtil = require('../utils/response.util');
  var apiCfg = require('./configs/nba.api.config');

  exports.getTeamStats = getTeamStats;
  exports.getGameLogs = getGameLogs;
  exports.getPlayByPlay = getPlayByPlay;

  function getTeamStats(params, headersToKeep) {
    return sendRequestGetResponse(
      apiCfg.requests.leagueDashTeamStats, params, headersToKeep);
  }

  function getGameLogs(params, headersToKeep) {
    return sendRequestGetResponse(
      apiCfg.requests.teamGameLogs, params, headersToKeep);
  }

  function getPlayByPlay(params, headersToKeep) {
    return sendRequestGetResponse(
      apiCfg.requests.playByPlay, params, headersToKeep);
  }

  function sendRequestGetResponse(urlCfg, params, headersToKeep, tryNumber) {
    return new Promise(function(resolve, reject) {
      if (urlCfg.userParams) {
        urlCfg.userParams.forEach(function (p) {
          if (params[p]) return;

          return reject(new Error('Param ' + p + ' must be provided by the user.'));
        });
      }

      var url = urlUtil.buildUrl(urlCfg, params);
      var responseData = null;
      var generatedErr = null;
      async.timesSeries(apiCfg.general.requestRetries, function (i, next) {
        if (responseData) return next();

        setTimeout(function () {
          console.log('Send request: Try ' + (i + 1));
          requestUtil.sendRequest(
            url,
            apiCfg.general.headers,
            apiCfg.general.timeout)
            .then(function (response) {
              if (response.resultSets[0].rowSet.length === 0) return resolve(null);

              var ret = responseUtil.cleanResponse(response, headersToKeep);
              responseData = ret;
              return next();
            })
            .catch(function (err) {
              console.error(err);
              generatedErr = err;
              return next();
            });
        }, apiCfg.general.delay);
      }, function (asyncErr) {
        if (responseData) return resolve(responseData);

        return reject(generatedErr);
      });

    });

    function sendRequest(url) {
      return function () {
        return new Promise(function(resolve, reject) {
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
        });
      };
    }
  }
}());
