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
    // on the browser use this makeshift, escaped and hacked up 
    // version of the pegjs definition
    var parser = Scheem.parser;
    function makepegdef() {
      var peg = ["start =",
                 "    expr",
                 "expr =",
                 "    ignore a:atom ignore { return a; }",
                 "  / ignore \"(\" e:expr* \")\" ignore { return e; }",
                 "  / \"'\" e:expr { return [\"quote\", e]; }",
                 "ignore =",
                 "    blank* comment*",
                 "blank =",
                 "    \" \"",
                 "  / \"\\n\"",
                 "  / \"\\t\"",
                 "comment = ",
                 "    \";;\" [^\\n]* \"\\n\" blank*",
                 "validchar = ",
                 "    [><a-zA-Z0-9_?!+\-=@#$%^&*/.]",
                 "number =",
                 "    [0-9]",
                 "atom =",
                 "    n:number+ { return parseInt(n.join(\"\"), 10); }",
                 "  / w:validchar+ { return w.join(\"\"); }"];
      return peg.join("\n");
    };
    pegDef = makepegdef();
  }

  return {
    pegDef: pegDef
  };

})();

// If we are used as Node module, export pegDef
if (typeof module !== 'undefined') {
    module.exports.pegDef = Scheem.peg.pegDef;
}
