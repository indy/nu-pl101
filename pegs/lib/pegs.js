
/*!
 * pegs
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
 */

/**
 * Library version.
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
// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );


//// Whitespace 

// - Allow any number of spaces between atoms, 
assert.deepEqual( parse("(a   b   c)"), ["a", "b", "c"] );

// and allow spaces around parentheses. 
assert.deepEqual( parse(" ( a   b   c ) "), ["a", "b", "c"] );

// Then allow newlines and tabs as well. Make Scheem less ugly.
assert.deepEqual( parse("\n(\na  b \n  c ) "), ["a", "b", "c"] );

//// Quotes

// Scheme has a special syntax 'x that is short for (quote x). 
// So '(1 2 3) is short for (quote (1 2 3)). 
// Add this feature into the parser.
assert.deepEqual( parse("'(a b c)"), ["quote", ["a", "b", "c"]] );
assert.deepEqual( parse("(a b c '(d))"), ["a", "b", "c", ["quote", ["d"]]] );


//// Comments

//  Lines that start with ;; are comments and should be ignored by the parser.
