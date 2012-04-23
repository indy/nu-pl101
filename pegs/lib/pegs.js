
/*!
 * pegs
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
 */

exports.version = '0.0.1';

var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('peg/parse.pegjs', 'utf-8');
// Show the PEG grammar file
//console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

var tried = passed = 0;

function pTest(desc, form, expected) {
  try {
    tried += 1;
    assert.deepEqual(parse(form), expected );
  } catch(e) {
    console.log("Failed: " + desc)
    throw e;
  }

  passed += 1;
}

function finish() {
  if(tried === passed) {
    console.log("all " + tried + " tests passed");
  }
}

//// Perform a basic parsing test
pTest("Basic parsing test",
      "(a b c)", ["a", "b", "c"]);

//// Whitespace 
pTest("Allow any number of spaces between atoms",
      "(a   b   c)", ["a", "b", "c"]);
pTest("Allow spaces around parentheses",
      " ( a   b   c ) ", ["a", "b", "c"]);
pTest("Allow newlines and tabs as well. Make Scheem less ugly.",
     "\n(\na  b \n  c ) ", ["a", "b", "c"]);

//// Quotes
pTest("expand quote syntax",
      "'(a b c)", ["quote", ["a", "b", "c"]]);
pTest("expand quote syntax within a form",
      "(a b c '(d))", ["a", "b", "c", ["quote", ["d"]]]);

//// Comments
pTest("Lines that start with ;; should be ignored by the parser",
      "(a b ;; this is a comment \nc)", ["a", "b", "c"]);

finish();
