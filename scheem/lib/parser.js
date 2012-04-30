
/*!
 * scheem parser
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
 */

exports.version = '0.0.1';

var PEG = require('pegjs');
var fs = require('fs');

exports.buildParser = function(pegFile) {
  var data = fs.readFileSync(pegFile, 'utf-8');
  return PEG.buildParser(data).parse;
}
