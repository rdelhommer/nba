(function () {
  exports.headerToCamelCase = headerToCamelCase;

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
