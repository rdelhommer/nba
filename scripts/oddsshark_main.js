(function () {
  var async = require('async');
  var fs = require('fs');

  var nbaApi = require('../src/apis/nba.api');
  var oddssharkApi = require('../src/apis/oddsshark.api');

  var outputFileIndex = process.argv.indexOf('-o') + 1;
  var outputFolder = null;
  if (outputFileIndex !== 0) {
    outputFolder = process.argv[outputFileIndex];
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
  var seasonGameDates = {};
  var data = [];
  var numRequests = 0;

  var keysToSave = [
    'event_date',
    'away_name',
    'away_city',
    'away_nick_name',
    'away_abbreviation',
    'home_name',
    'home_city',
    'home_nick_name',
    'home_abbreviation',
    'home_spread',
    'away_spread',
    'total'
  ];

  setup().then(function () {
    console.log('Start Data Collection');
    async.eachSeries(seasons, function (s, nextSeason) {
      console.log('\tSeason: ' + s);
      async.eachSeries(seasonGameDates[s], function (d, nextDate) {
        console.log('\t\tDate: ' + d);
        oddssharkApi.getNbaScores(d, keysToSave).then(function (games) {
          console.log('\t\t\tFound ' + games.length + ' games');
          numRequests++;
          data = data.concat(games);

          return nextDate();
        }).catch(nextDate);
      }, function (dateErr) {
        if (dateErr) return nextSeason(dateErr);
        if (!outputFolder) return nextSeason(dateErr);

        var outputFile = outputFolder + '/oddsshark_nba_' + s + '.json';
        fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
          if(err) {
            console.error('Error occurred when writing data to file!');
            return console.error(err);
          }

          console.log(outputFile + ' was saved!');
          data = [];
          return nextSeason(dateErr);
        });

      });
    }, function (seasonErr) {
      if (seasonErr) console.error(seasonErr);
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

        nbaApi.getGameLogs(regularSeasonParams, [ 'GAME_DATE' ])
          .then(function (gameLogs) {
            numRequests++;
            seasonGameDates[s] = [];
            console.log('\tGot regular season game dates for ' + s);
            gameLogs.forEach(function (log) {
              var parsedDate = log.gameDate.substring(0, log.gameDate.indexOf('T'));
              if (seasonGameDates[s].indexOf(parsedDate) !== -1) return;
              seasonGameDates[s].push(parsedDate);
            });

            var playoffParams = {
              Season: s,
              SeasonType: 'Playoffs'
            };

            nbaApi.getGameLogs(playoffParams, [ 'GAME_DATE' ])
              .then(function (gameLogs) {
                numRequests++;
                console.log('\tGot playoff game dates for ' + s);
                gameLogs.forEach(function (log) {
                  var parsedDate = log.gameDate.substring(0, log.gameDate.indexOf('T'));
                  if (seasonGameDates[s].indexOf(parsedDate) !== -1) return;
                  seasonGameDates[s].push(parsedDate);
                });

                seasonGameDates[s].sort();
                console.log('\t' + seasonGameDates[s].length + ' dates for ' + s);

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
