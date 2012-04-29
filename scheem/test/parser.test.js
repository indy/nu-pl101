var assert = require('assert');
var parser = require('../lib/parser');

var parse = (function() {

  var scheemParser = parser.buildParser('peg/scheem.pegjs');

  return function(txt, form, expected) {
    it(txt, function() {
      var res = scheemParser(form);
      assert.deepEqual(res, expected );
    });
  }

})();


describe('Basic parsing', function(){

  parse("Basic parsing test",
        "(a b c)", ["a", "b", "c"]);

});

describe('Whitespace', function(){

  parse("Allow any number of spaces between atoms",
        "(a   b   c)", ["a", "b", "c"]);
  parse("Allow spaces around parentheses",
        " ( a   b   c ) ", ["a", "b", "c"]);
  parse("Allow newlines and tabs as well. Make Scheem less ugly.",
        "\n(\na  b \n  c ) ", ["a", "b", "c"]);
});


describe('Quotes', function() {
  parse("expand quote syntax",
        "'(a b c)", ["quote", ["a", "b", "c"]]);
  parse("expand quote syntax within a form",
        "(a b c '(d))", ["a", "b", "c", ["quote", ["d"]]]);
});

describe('Comments', function() {
  parse("Lines that start with ;; should be ignored by the parser",
        "(a b ;; this is a comment \nc)", ["a", "b", "c"]);
});
