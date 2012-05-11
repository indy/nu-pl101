
/*!
 * scheem parser
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/

var Scheem;
var ScheemPeg;

if (typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.parser = {};

if (typeof module !== 'undefined') {
  var fs = require('fs');
  var PEG = require('pegjs');
} else {
  Scheem.parser.precompiledPeg = true;
}

Scheem.parser.buildParser = function () {
  if (Scheem.parser.precompiledPeg === true) {
    return ScheemPeg.parse;
  } else {
    var pegDef = fs.readFileSync('peg/scheem.pegjs', 'utf-8');
    return PEG.buildParser(pegDef).parse;
  }
};

if (typeof module !== 'undefined') {
  module.exports.version = '0.0.1';
  module.exports.buildParser = Scheem.parser.buildParser;
}



