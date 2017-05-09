(function () {
  exports.buildUrl = buildUrl;

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
