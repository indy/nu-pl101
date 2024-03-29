
var Scheem;

if (typeof module !== 'undefined') {
  var chai = require('chai');
  var assert = chai.assert;
  var parser = require('../lib/parser');
} else {
  // In browser assume already loaded by <script> tags
  var assert = chai.assert;
  var parser = Scheem.parser;
}

var scheemParser = parser.buildParser();

var parse = (function () {
  return function (txt, form, expected) {
    test(txt, function () {
      var res = scheemParser(form);
      assert.deepEqual(res, expected);
    });
  };

}());


suite('Basic parsing', function () {

  parse("Basic parsing test",
        "(a b c)", [["a", "b", "c"]]);

});

suite('Multiple expressions', function () {

  parse("test 1",
        "(a b c)(a b c)", [["a", "b", "c"], ["a", "b", "c"]]);

  parse("test 2",
        "(a b c)  (a b c)", [["a", "b", "c"], ["a", "b", "c"]]);

  parse("test 3",
        "(a b c)\n(a b c)", [["a", "b", "c"], ["a", "b", "c"]]);

  parse("test 4",
        "(a b c)\n(a b c)\n(a b c)\n", 
        [["a", "b", "c"], ["a", "b", "c"], ["a", "b", "c"]]);

});

suite('Whitespace', function () {

  parse("Allow any number of spaces between atoms",
        "(a   b   c)", [["a", "b", "c"]]);
  parse("Allow spaces around parentheses",
        " ( a   b   c ) ", [["a", "b", "c"]]);
  parse("Allow newlines and tabs as well. Make Scheem less ugly.",
        "\n(\na  b \n  c ) ", [["a", "b", "c"]]);
});


suite('Quotes', function () {
  parse("expand quote syntax",
        "'(a b c)", [["quote", ["a", "b", "c"]]]);
  parse("expand quote syntax within a form",
        "(a b c '(d))", [["a", "b", "c", ["quote", ["d"]]]]);
});


suite('strings', function () {
  parse("parse a string",
        "\"hello\"", [["_string", "hello"]]);

  parse("parse a string",
        "\"hello this is a string\"", [["_string", "hello this is a string"]]);
});


suite('Comments', function () {
  parse("Lines that start with ;; should be ignored by the parser",
        "(a b ;; this is a comment \nc)", [["a", "b", "c"]]);
});


suite('Numbers are numbers', function () {
  parse('single digits are numbers',
        "5", [5]);

  parse('negative numbers',
        "-8", [-8]);

  parse('multiple digits are numbers',
        "25", [25]);

  parse('numbers appear in lists',
        "(1 2 3 4 5)", [[1, 2, 3, 4, 5]]);

  parse("variables can end in numbers",
        "(a1 b22 c333)", [["a1", "b22", "c333"]]);

});

