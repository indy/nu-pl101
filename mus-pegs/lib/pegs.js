
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
var data = fs.readFileSync('peg/mus.pegjs', 'utf-8');

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
    console.log("Failed: " + desc);
    console.log(e);
    throw e;
  }

  passed += 1;
}

function finish() {
  if(tried === passed) {
    console.log("all " + tried + " tests passed");
  }
}

//// Notes
pTest("A note",
      "a2", { tag: 'note', pitch: 'a2' });

pTest("A note with duration",
      "a2:300", { tag: 'note', pitch: 'a2', dur: 300 });

//// Sequences of notes
pTest("A seq of one note with list scoped duration",
      "{a2}:300", {tag: 'seq', 
                   children: [{ tag: 'note', pitch: 'a2', dur: 300 }]});

pTest("A seq of one note with note scoped duration",
      "{a2:301}", {tag: 'seq', 
                   children: [{ tag: 'note', pitch: 'a2', dur: 301 }]});

pTest("A seq of notes with list scoped duration",
      "{a4 b3}:300", {tag: 'seq', 
                      children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                                 { tag: 'note', pitch: 'b3', dur: 300 }]});

pTest("A seq of notes with note scoped durations",
      "{c1:100 d2:200}", {tag: 'seq',
                          children: [{ tag: 'note', pitch: 'c1', dur: 100 },
                                     { tag: 'note', pitch: 'd2', dur: 200 }]});

//// Playing notes in harmony

pTest("A par of one note with list scoped duration",
      "h{a2}:300", {tag: 'par', 
                   children: [{ tag: 'note', pitch: 'a2', dur: 300 }]});

pTest("A par of one note with note scoped duration",
      "h{a2:301}", {tag: 'par', 
                   children: [{ tag: 'note', pitch: 'a2', dur: 301 }]});

pTest("A par of notes with list scoped duration",
      "h{a4 b3}:300", {tag: 'par', 
                      children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                                 { tag: 'note', pitch: 'b3', dur: 300 }]});

pTest("A par of notes with note scoped durations",
      "h{c1:100 d2:200}", {tag: 'par',
                          children: [{ tag: 'note', pitch: 'c1', dur: 100 },
                                     { tag: 'note', pitch: 'd2', dur: 200 }]});

finish();
