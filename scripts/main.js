(function () {
  var async = require('async');
  var fs = require('fs');

  var api = require('../src/api');

  var ids = [];
  var seasons = [];
  var data = {};

  setup()
    .then(function () {
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

          api.getGameLogs(gameLogParams)
            .then(function (gameLogs) {
              console.log('\t\tGot game logs!');
              data[id][s].games = gameLogs;

              var paceParams = {
                TeamID: id,
                Season: s
              };

              api.getTeamStat('PACE', paceParams)
                .then(function (pace) {
                  console.log('\t\tGot pace! ' + pace);
                  data[id][s].pace = pace;

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

        fs.writeFile("data.json", JSON.stringify(data, null, '\t'), function(err) {
          if(err) {
            console.error('Error occurred when writing data to file!');
            return console.error(err);
          }

          console.log("data.json was saved!");
        });
      });
    })
    .catch(console.error);

  function setup() {
    return new Promise(function(resolve, reject) {
      console.log('Start setup');
      api.getTeamStat('TEAM_ID')
        .then(function (teamIds) {
          console.log('Got Team Ids');
          console.log(teamIds);
          ids = teamIds;
          seasons = buildSeasonsArray();

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

      console.log('Got Seasons');
      console.log(ret);

      return ret;
    }
  }
}());
