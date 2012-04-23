
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
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
