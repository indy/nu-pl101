
/*!
 * scheem parser
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/



if(typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.parser = {};

if (typeof module !== 'undefined') {
  var PEG = require('pegjs');
}

Scheem.parser.buildParser = function(pegData) {
  return PEG.buildParser(pegData).parse;
}

if (typeof module !== 'undefined') {
  module.exports.version = '0.0.1';
  module.exports.buildParser = Scheem.parser.buildParser;
}



