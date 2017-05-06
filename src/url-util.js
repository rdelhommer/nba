(function () {
  exports.buildUrl = buildUrl;

  exports.leagueDashTeamStats = {
    url: 'http://stats.nba.com/stats/leaguedashteamstats',
    defaultParams: {
      'MeasureType': 'Advanced',
      'PerMode': 'PerGame',
      'PlusMinus': 'N',
      'PaceAdjust': 'N',
      'Rank': 'N',
      'LeagueID': '00',
      'Season': '2016-17',
      'SeasonType': 'Regular Season',
      'PORound': 0,
      'Outcome': null,
      'Location': null,
      'Month': 0,
      'SeasonSegment': null,
      'DateFrom': null,
      'DateTo': null,
      'OpponentTeamID': 0,
      'VsConference': null,
      'VsDivision': null,
      'TeamID': 0,
      'Conference': null,
      'Division': null,
      'GameSegment': null,
      'Period': 0,
      'ShotClockRange': null,
      'LastNGames': 0,
      'GameScope': null,
      'PlayerExperience': null,
      'PlayerPosition': null,
      'StarterBench': null
    }
  };

  exports.teamGameLogs = {
    url: 'http://stats.nba.com/stats/teamgamelogs',
    defaultParams: {
      'MeasureType':'Base',
      'PerMode':'Totals',
      'LeagueID':'00',
      'SeasonYear':'2016-17',
      'SeasonType':'Regular Season',
      'PORound':0,
      'TeamID':null,
      'PlayerID':null,
      'Outcome':null,
      'Location':null,
      'Month':0,
      'SeasonSegment':null,
      'DateFrom':null,
      'DateTo':null,
      'OppTeamID':0,
      'VsConference':null,
      'VsDivision':null,
      'GameSegment':null,
      'Period':0,
      'ShotClockRange':null,
      'LastNGames':0
    }
  };

  function buildUrl(urlObj, overrideParams) {
    var mergedParams = overrideDefaultParams(urlObj.defaultParams, overrideParams);
    var fullUrl = urlObj.url + '?';
    for (var key in mergedParams) {
      if (!mergedParams.hasOwnProperty(key)) continue;

      var value = mergedParams[key];
      if (value === null) {
        value = '';
      }

      fullUrl += key + '=' + encodeURIComponent(value) + '&';
    }

    return fullUrl;

    function overrideDefaultParams(defaultParams, overrideParams) {
      if (!overrideParams) return defaultParams;

      var ret = {};
      for (var key in defaultParams) {
        if (!defaultParams.hasOwnProperty(key)) continue;

        ret[key] = overrideParams[key] || defaultParams[key];
      }

      return ret;
    }
  }
}());
