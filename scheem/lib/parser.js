
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
} else {
  Scheem.parser.precompiledPeg = true;
}

Scheem.parser.buildParser = function(pegData) {
  if(Scheem.parser.precompiledPeg === true) {
    return ScheemPeg.parse;
  } else {
    return PEG.buildParser(pegData).parse;
  }
}

if (typeof module !== 'undefined') {
  module.exports.version = '0.0.1';
  module.exports.buildParser = Scheem.parser.buildParser;
}



