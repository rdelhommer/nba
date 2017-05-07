(function () {
  exports.cleanResponse = cleanResponse;
  exports.headerToCamelCase = headerToCamelCase;

  function cleanResponse(response, headersToKeep) {
    if (!headersToKeep) {
      headersToKeep = response.resultSets[0].headers;
    }

    var ret = [];

    response.resultSets[0].rowSet.forEach(function (team) {
      var teamStats = {};
      headersToKeep.forEach(function (h) {
        var headerIndex = response.resultSets[0].headers.indexOf(h);
        teamStats[headerToCamelCase(h)] = team[headerIndex];
      });

      ret.push(teamStats);
    });

    return ret;
  }

  function headerToCamelCase(rawHeader) {
    var ret = rawHeader.toLowerCase();

    var underScoreIndex = ret.indexOf('_');
    while (underScoreIndex !== -1) {
      ret = ret.substring(0, underScoreIndex) +
        ret.charAt(underScoreIndex + 1).toUpperCase() +
        ret.substring(underScoreIndex + 2);

      underScoreIndex = ret.indexOf('_');
    }

    return ret;
  }
}());
