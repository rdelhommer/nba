(function () {
  var request = require('request');

  var requestUtil = require('../utils/request.util');
  var responseUtil = require('../utils/response.util');
  var apiCfg = require('./configs/oddsshark.api.config');

  exports.getNbaScores = getNbaScores;

  function getNbaScores(date, responseKeysToSave) {
    return sendRequestGetResponse(apiCfg.requests.nbaScores, date, responseKeysToSave);
  }

  function sendRequestGetResponse(urlCfg, date, responseKeysToSave) {
    return new Promise(function(resolve, reject) {
      return setTimeout(function () {
        var isoDateStr = new Date(date).toISOString();
        var url = urlCfg.url + '/' + isoDateStr.substring(0, isoDateStr.indexOf('T'));
        requestUtil.sendRequest(
          url,
          apiCfg.general.headers,
          apiCfg.general.timeout)
          .then(function (response) {
            if (!responseKeysToSave) return resolve(response);

            var cleanedGames = [];
            response.forEach(function (game) {
              var cleanedGame = {};
              responseKeysToSave.forEach(function (key) {
                var prettyKey = responseUtil.headerToCamelCase(key);
                cleanedGame[prettyKey] = game[key];
              });
              cleanedGames.push(cleanedGame);
            });

            return resolve(cleanedGames);
          })
          .catch(reject);
      }, apiCfg.general.delay);
    });
  }
}());
