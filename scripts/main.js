(function () {
  var async = require('async');
  var fs = require('fs');

  var api = require('../src/api');

  var ids = [];
  var seasons = [];
  var data = {};

  setup().then(function () {
    async.eachSeries(ids, function (id, nextId) {
      console.log('Team: ' + id);
      data[id] = {};
      async.eachSeries(seasons, function (s, nextSeason) {
        console.log('\tSeason: ' + s);
        data[id][s] = {};

        var gameLogParams = {
          TeamID: id,
          SeasonYear: s
        };
        var gameLogHeaders = [
          'TEAM_ID',
          'TEAM_ABBREVIATION',
          'GAME_DATE',
          'MATCHUP',
          'WL'
        ];

        api.getGameLogs(gameLogParams, gameLogHeaders)
          .then(function (gameLogs) {
            console.log('\t\tGot ' + gameLogs.length + ' game logs!');
            data[id][s].games = gameLogs;

            var teamStatParams = {
              TeamID: id,
              Season: s
            };

            var teamStatHeaders = [
              'PACE',
              'NET_RATING'
            ];

            api.getTeamStats(teamStatParams, teamStatHeaders)
              .then(function (stats) {
                console.log(
                  '\t\tGot pace (' + stats[0].pace +
                  ') and net rating (' + stats[0].netRating + ')!');

                data[id][s].pace = stats[0].pace;
                data[id][s].netRating = stats[0].netRating;

                return nextSeason();
              })
              .catch(nextSeason);
          })
          .catch(nextSeason);
      }, function (asyncSeasonErr) {
        return nextId(asyncSeasonErr);
      });
    }, function (asyncIdErr) {
      if (asyncIdErr) {
        console.error(asyncIdErr);
      }

      console.log(data[ids[0]][seasons[0]]);

      fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function(err) {
        if(err) {
          console.error('Error occurred when writing data to file!');
          return console.error(err);
        }

        console.log('data.json was saved!');
      });
    });
  }).catch(console.error);

  function setup() {
    return new Promise(function(resolve, reject) {
      console.log('Start setup');
      api.getTeamStats(null, ['TEAM_ID'])
        .then(function (statsObj) {
          ids = statsObj.map(function (s) { return s.teamId; });
          console.log('Got Team Ids');
          console.log(ids);

          seasons = buildSeasonsArray();
          console.log('Got Seasons');
          console.log(seasons);

          return resolve();
        })
        .catch(reject);
    });

    function buildSeasonsArray() {
      var ret = [];

      var currentYear = new Date(Date.now()).getFullYear();
      for (var i = 0; i < 20; i++) {
        var key = (currentYear - 1).toString() + '-' + currentYear.toString().substring(2);
        ret.push(key);
        currentYear--;
      }

      return ret;
    }
  }

  function cleanGameLogs(gameLogs, headersToKeep) {
    // TODO
  }
}());
