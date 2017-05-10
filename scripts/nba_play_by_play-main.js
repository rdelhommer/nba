(function () {
  var async = require('async');
  var fs = require('fs');

  var nbaApi = require('../src/apis/nba.api');

  var outputFolderIndex = process.argv.indexOf('-o') + 1;
  var outputFolder = null;
  if (outputFolderIndex !== 0) {
    outputFolder = process.argv[outputFolderIndex];
    if (!fs.existsSync(outputFolder)){
      fs.mkdirSync(outputFolder);
    }
    console.log('Output Folder: ' + outputFolder);
  }

  var numSeasonsIndex = process.argv.indexOf('-s') + 1;
  var numSeasons = 20;
  if (numSeasonsIndex !== 0) {
    numSeasons = process.argv[numSeasonsIndex];
    console.log('Number of Seasons to Collect: ' + numSeasons);
  }

  var startYearIndex = process.argv.indexOf('-y') + 1;
  var startYear = new Date(Date.now()).getFullYear();
  if (startYearIndex !== 0) {
    startYear = process.argv[startYearIndex];
    console.log('Start year: ' + startYear);
  }

  var seasons = [];
  var seasonGameIds = {};
  var data = {};
  var numRequestsSent = 0;

  setup().then(function () {
    async.eachSeries(seasons, function (s, nextSeason) {
      console.log('Season: ' + s);

      async.eachSeries(seasonGameIds[s], function (id, nextId) {
        console.log('\tGame ID: ' + id);

        var playByPlayParams = {
          GameID: id
        };

        nbaApi.getPlayByPlay(playByPlayParams)
          .then(function (pbp) {
            numRequestsSent++;
            if (!pbp) {
              console.log('\t\t\tNo play by play data for game ' + id);
              return nextId();
            }

            console.log('\t\t\tGot ' + pbp.length + ' plays!');

            data[id] = pbp;

            return nextId();
          })
          .catch(nextId);
      }, function (idErr) {
        if (idErr) return nextSeason(idErr);
        if (!outputFolder) return nextSeason(idErr);

        var outputFile = outputFolder + '/nba_play_by_play_' + s + '.json';
        fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
          if(err) {
            console.error('Error occurred when writing data to file!');
            return console.error(err);
          }

          console.log(outputFile + ' was saved!');
          data = {};

          return nextSeason(idErr);
        });
      });
    }, function (seasonErr) {
      console.log('Number of requests sent: ' + numRequestsSent);
      if (seasonErr) {
        console.error(seasonErr);
      }
    });
  }).catch(console.error);

  function setup() {
    return new Promise(function(resolve, reject) {
      console.log('Start setup');
      seasons = buildSeasonsArray();

      async.eachSeries(seasons, function (s, nextSeason) {
        var regularSeasonParams = {
          Season: s,
          SeasonType: 'Regular Season'
        };

        nbaApi.getGameLogs(regularSeasonParams, [ 'GAME_ID' ])
          .then(function (gameLogs) {
            numRequestsSent++;
            var tempIds = [];
            seasonGameIds[s] = [];

            console.log('\tGot regular season game ids for ' + s);
            var ids = gameLogs.map(function (l) { return l.gameId; });
            tempIds = tempIds.concat(ids);

            var playoffParams = {
              Season: s,
              SeasonType: 'Playoffs'
            };

            nbaApi.getGameLogs(playoffParams, [ 'GAME_ID' ])
              .then(function (gameLogs) {
                numRequestsSent++;
                console.log('\tGot playoff game ids for ' + s);
                var ids = gameLogs.map(function (l) { return l.gameId; });
                tempIds = tempIds.concat(ids);

                tempIds.forEach(function (id) {
                  if (seasonGameIds[s].indexOf(id) !== -1) return;
                  seasonGameIds[s].push(id);
                });

                console.log('\t' + seasonGameIds[s].length + ' games for ' + s);

                return nextSeason();
              })
              .catch(reject);
          })
          .catch(reject);
      }, function (asyncErr) {
        if (asyncErr) return reject();

        return resolve();
      });
    });

    function buildSeasonsArray() {
      var ret = [];

      for (var i = 0; i < numSeasons; i++) {
        var key = (startYear - 1).toString() + '-' + startYear.toString().substring(2);
        ret.push(key);
        startYear--;
      }

      return ret;
    }
  }
}());
