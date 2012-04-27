
var assert = require('assert');
pegs = require('../lib/pegs');


var musParser = pegs.buildParser('peg/mus.pegjs');

function parse(txt, form, expected) {
  it(txt, function() {
    assert.deepEqual(musParser(form), expected );
  });
}

describe('Notes', function(){

  parse('a note', 
        "a2", 
        { tag: 'note', pitch: 'a2' });

  parse("a note with duration", 
        "a2:300", 
        { tag: 'note', pitch: 'a2', dur: 300 });

});

describe('Sequence of notes', function(){

  parse("a seq of one note with list scoped duration", 
        "{a2}:300", 
        {tag: 'seq', 
         children: [{ tag: 'note', pitch: 'a2', dur: 300 }]});


  parse("a seq of one note with note scoped duration", 
        "{a2:301}",
        {tag: 'seq', 
         children: [{ tag: 'note', pitch: 'a2', dur: 301 }]});


  parse("a seq of notes with list scoped duration", 
        "{a4 b3}:300",
        {tag: 'seq', 
         children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                    { tag: 'note', pitch: 'b3', dur: 300 }]});


  parse("a seq of notes with note scoped durations", 
        "{c1:100 d2:200}",
        {tag: 'seq',
         children: [{ tag: 'note', pitch: 'c1', dur: 100 },
                    { tag: 'note', pitch: 'd2', dur: 200 }]});

});

describe('Playing notes in harmony', function(){

  parse("a par of one note with list scoped duration", 
        "h{a2}:300",
        {tag: 'par', 
         children: [{ tag: 'note', pitch: 'a2', dur: 300 }]});


  parse("a par of one note with note scoped duration", 
        "h{a2:301}",
        {tag: 'par', 
         children: [{ tag: 'note', pitch: 'a2', dur: 301 }]});


  parse("a par of notes with list scoped duration", 
        "h{a4 b3}:300",
        {tag: 'par', 
         children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                    { tag: 'note', pitch: 'b3', dur: 300 }]});


  parse("a par of notes with note scoped durations", 
        "h{c1:100 d2:200}",
        {tag: 'par',
         children: [{ tag: 'note', pitch: 'c1', dur: 100 },
                    { tag: 'note', pitch: 'd2', dur: 200 }]});

});

describe('rests', function(){

  parse("a rest", 
        "rest:300",
        { tag: 'rest', dur: 300 });


  parse("a seq of notes+rests with list scoped duration", 
        "{a4 rest b3 rest}:300",
        {tag: 'seq', 
         children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                    { tag: 'rest', dur: 300 },
                    { tag: 'note', pitch: 'b3', dur: 300 },
                    { tag: 'rest', dur: 300 }]});
});


describe('nested expressions', function(){

  parse("a seq of notes with list scoped duration", 
        "{a4 b3 {c4 d3}:300}:300",
        { tag: 'seq', 
          children: [{ tag: 'note', pitch: 'a4', dur: 300 },
                     { tag: 'note', pitch: 'b3', dur: 300 },
                     {tag: 'seq', 
                      children: [{ tag: 'note', pitch: 'c4', dur: 300 },
                                 { tag: 'note', pitch: 'd3', dur: 300 }]}]});

});

