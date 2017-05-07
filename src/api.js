(function () {
  var REQUEST_DELAY = 5000;

  var request = require('request');

  var urlUtil = require('./url-util');
  var responseUtil = require('./response-util');

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
        var headers = {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, sdch',
          'Accept-Language': 'en-US,en;q=0.8',
          'Connection': 'keep-alive',
          'DNT': 1,
          'Host': 'stats.nba.com',
          'Referer': 'http://stats.nba.com/scores/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
          'x-nba-stats-origin': 'stats',
          'x-nba-stats-token': true,
          // 'Cache-Control': 'no-cache',
          // 'Origin': 'http://stats.nba.com',
        };

        // console.log('Send request to: ' + url);
        setTimeout(function () {
          request({
            url: url,
            headers: headers,
            timeout: 5000
          }, function (error, response, body) {
            if (error) return reject(error);

            return resolve(JSON.parse(body));
          });
        }, REQUEST_DELAY);
      });
    }
  }
}());
