(function () {
  var request = require('request');

  var requestUtil = require('../utils/request.util');
  var apiCfg = require('./configs/oddsshark.api.config');

  exports.getNbaScores = getNbaScores;

  function getNbaScores(date) {
    return sendRequestGetResponse(apiCfg.requests.nbaScores, date);
  }

  function sendRequestGetResponse(urlCfg, date) {
    return new Promise(function(resolve, reject) {
      return setTimeout(function () {
        var isoDateStr = new Date(date).toISOString();
        var url = urlCfg.url + '/' + isoDateStr.substring(0, isoDateStr.indexOf('T'));
        requestUtil.sendRequest(
          url,
          apiCfg.general.headers,
          apiCfg.general.timeout)
          .then(function (response) {
            return resolve(response);
          })
          .catch(reject);
      }, apiCfg.general.delay);
    });
  }
}());
