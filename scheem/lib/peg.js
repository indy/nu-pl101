/*!
 * scheem peg definition
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/

if(typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.peg = (function() {

  var pegDef;

  if (typeof module !== 'undefined') {
    // in node.js read the pegjs definition
    var fs = require('fs');
    pegDef = fs.readFileSync('peg/scheem.pegjs', 'utf-8');
  } else {
    // on the browser use js/built/precompiledPeg.js
  }

  return {
    pegDef: pegDef
  };

})();

// If we are used as Node module, export pegDef
if (typeof module !== 'undefined') {
    module.exports.pegDef = Scheem.peg.pegDef;
}
