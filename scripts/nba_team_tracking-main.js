(function () {
  var async = require('async');
  var fs = require('fs');

  var nbaApi = require('../src/apis/nba.api');
  var nbaApiCfg = require('../src/apis/configs/nba.api.config');

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

  var ids = [];
  var seasons = [];
  var data = {};
  var numRequestsSent = 0;

  setup().then(function () {
    async.eachSeries(seasons, function (s, nextSeason) {
      console.log('Season: ' + s);
      data = {};

      async.eachSeries(Object.keys(nbaApiCfg.paramEnums.PtMeasureType), function (measureType, nextMeasureType) {
        console.log('Measure Type: ' + measureType);
        var measureTypeKey = measureType.charAt(0).toLowerCase() + measureType.substring(1);
        data[measureTypeKey] = {};

        async.eachSeries(Object.keys(nbaApiCfg.paramEnums.SeasonType), function (seasonType, nextSeasonType) {
          var seasonTypeKey = seasonType.charAt(0).toLowerCase() + seasonType.replace(' ','').substring(1);
          data[measureTypeKey][seasonTypeKey] = {};

          var trackingParams = {
            PtMeasureType: measureType,
            Season: s,
            SeasonType: seasonType,
            PerMode: nbaApiCfg.paramEnums.PerMode.PerGame,
            PlayerOrTeam: nbaApiCfg.paramEnums.PlayerOrTeam.Team
          };

          nbaApi.getTracking(trackingParams)
            .then(function (responseData) {
              numRequestsSent++;
              if (!responseData) {
                console.log('No ' + seasonType + ' tracking data for ' + MeasureType);
                return nextSeasonType();
              }

              console.log('Got ' + seasonType + ' tracking data for ' + responseData.length + ' teams!');

              data[measureTypeKey][seasonTypeKey] = responseData;

              return nextSeasonType();
            })
            .catch(nextSeasonType);
        }, function (seasonTypeErr) {
          return nextMeasureType(seasonTypeErr);
        });
      }, function (measureTypeErr) {
        if (measureTypeErr) return nextSeason(measureTypeErr);
        if (!outputFolder) return nextSeason();

        var outputFile = outputFolder + '/nba_team_tracking_' + s + '.json';
        fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
          if(err) {
            console.error('Error occurred when writing data to file!');
            return console.error(err);
          }

          console.log(outputFile + ' was saved!');

          return nextSeason();
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
      console.log('Got Seasons');
      console.log(seasons);

      return resolve();
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
