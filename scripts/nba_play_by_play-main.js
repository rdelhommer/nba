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
  var teamIds = [];
  var numRequestsSent = 0;
  var gamesPerPart = 400;

  setup().then(function () {
    async.eachSeries(seasons, function (s, nextSeason) {
      console.log('Season: ' + s);
      data = {};
      var filePart = 1;
      var numIdsFinished = 0;

      async.eachSeries(seasonGameIds[s], function (id, nextId) {
        console.log('Game ID: ' + id + ' - ' + (numIdsFinished / seasonGameIds[s].length * 100).toFixed(2) + '%');

        var playByPlayParams = {
          GameID: id
        };

        nbaApi.getPlayByPlay(playByPlayParams)
          .then(function (pbp) {
            numRequestsSent++;
            if (!pbp) {
              console.log('No play by play data for game ' + id);
              return nextId();
            }

            console.log('Got ' + pbp.length + ' plays!');

            data[id] = pbp;
            numIdsFinished++;

            if (!outputFolder || numIdsFinished%gamesPerPart !== 0) return nextId();

            var outputFile = outputFolder + '/nba_pbp_' + s + '.pt' + filePart + '.json';
            console.log('Saving to ' + outputFile);
            fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
              if(err) {
                console.error('Error occurred when writing data to file!');
                return console.error(err);
              }

              console.log(outputFile + ' was saved!');
              data = {};
              filePart++;

              return nextId();
            });
          })
          .catch(nextId);
      }, function (idErr) {
        if (idErr) return nextSeason(idErr);
        if (!outputFolder) return nextSeason(idErr);

        var outputFile = outputFolder + '/nba_pbp_' + s + '.pt' + filePart + '.json';
        console.log('Saving to ' + outputFile);
        try {
          fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
            if(err) {
              console.error('Error occurred when writing data to file!');
              return console.error(err);
            }

            console.log(outputFile + ' was saved!');

            return nextSeason(idErr);
          });
        } catch (e) {
          console.log('save error');
          console.error(e);
        }
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

            console.log('Got regular season game ids for ' + s);
            var ids = gameLogs.map(function (l) { return l.gameId; });
            tempIds = tempIds.concat(ids);

            var playoffParams = {
              Season: s,
              SeasonType: 'Playoffs'
            };

            nbaApi.getGameLogs(playoffParams, [ 'GAME_ID' ])
              .then(function (gameLogs) {
                numRequestsSent++;
                console.log('Got playoff game ids for ' + s);
                var ids = gameLogs.map(function (l) { return l.gameId; });
                tempIds = tempIds.concat(ids);

                tempIds.forEach(function (id) {
                  if (seasonGameIds[s].indexOf(id) !== -1) return;
                  seasonGameIds[s].push(id);
                });

                console.log('' + seasonGameIds[s].length + ' games for ' + s);

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
