'use strict';

var _require = require('../build/Release/findGitRepos.node'),
    findGitRepos = _require.findGitRepos;

var normalizeStartingPath = function normalizeStartingPath(_path) {
  var pathWithNormalizedSlashes = process.platform === 'win32' ? _path.replace(/\\/g, '/') : _path;

  return pathWithNormalizedSlashes.replace(/\/+$/, '');
};

var normalizeRepositoryPath = function normalizeRepositoryPath(_path) {
  return _path.replace(/\//g, '\\');
};

var normalizePathCallback = function normalizePathCallback(callback) {
  return process.platform === 'win32' ? function (paths) {
    return callback(paths.map(normalizeRepositoryPath));
  } : callback;
};

module.exports = function (startingPath, progressCallback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    if (!startingPath && startingPath !== '') {
      reject(new Error('Must provide starting path as first argument.'));
      return;
    }

    var _options$throttleTime = options.throttleTimeoutMS,
        throttleTimeoutMS = _options$throttleTime === undefined ? 0 : _options$throttleTime;


    if (!progressCallback) {
      reject(new Error('Must provide progress callback as second argument.'));
      return;
    }

    try {
      findGitRepos(normalizeStartingPath(startingPath), throttleTimeoutMS, normalizePathCallback(progressCallback), normalizePathCallback(resolve));
    } catch (error) {
      reject(error);
    }
  });
};