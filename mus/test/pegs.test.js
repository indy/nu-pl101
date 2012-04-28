
var assert = require('assert');
pegs = require('../lib/pegs');


var musParser = pegs.buildParser('peg/mus.pegjs');

function parse(txt, form, expected) {
  it("parse " + txt, function() {
    var res = musParser(form);
    assert.deepEqual(res, expected );
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
        { tag: 'note', pitch: 'a2', dur: 300 });
  
  parse("a seq of one note with note scoped duration", 
        "{a2:301}",
        { tag: 'note', pitch: 'a2', dur: 301 });
  
  parse("a seq of notes with list scoped duration", 
        "{a4 b3}:300",
        {tag: 'seq', 
         left:{ tag: 'note', pitch: 'a4', dur: 300 },
         right:{ tag: 'note', pitch: 'b3', dur: 300 }});
  
  parse("a seq of notes with note scoped durations", 
        "{c1:100 d2:200}",
        {tag: 'seq', 
         left:{ tag: 'note', pitch: 'c1', dur: 100 },
         right:{ tag: 'note', pitch: 'd2', dur: 200 }});

  parse("a seq of >2 notes with note scoped durations", 
        "{c1:100 d2:200 b3:300}",
        {tag: 'seq', 
         left:{ tag: 'note', pitch: 'c1', dur: 100 },
         right:{tag: 'seq', 
                left:{ tag: 'note', pitch: 'd2', dur: 200 },
                right:{ tag: 'note', pitch: 'b3', dur: 300 }}});

});



describe('Playing notes in harmony', function(){
  
  parse("a par of one note with list scoped duration", 
        "harmony {a2}:300",
        { tag: 'note', pitch: 'a2', dur: 300 });

  parse("a par of one note with list scoped duration", 
        "harmony{a2}:300",
        { tag: 'note', pitch: 'a2', dur: 300 });

  parse("a par of one note with list scoped duration", 
        "harmony    {a2}:300",
        { tag: 'note', pitch: 'a2', dur: 300 });

  parse("a par of one note with note scoped duration", 
        "harmony {a2:301}",
        { tag: 'note', pitch: 'a2', dur: 301 });

  parse("a par of notes with list scoped duration", 
        "harmony {a4 b3}:300",
        {tag: 'par', 
         left:{ tag: 'note', pitch: 'a4', dur: 300 },
         right:{ tag: 'note', pitch: 'b3', dur: 300 }});
  
  parse("a par of notes with note scoped durations", 
        "harmony {c1:100 d2:200}",
        {tag: 'par',
         left:{ tag: 'note', pitch: 'c1', dur: 100 },
         right:{ tag: 'note', pitch: 'd2', dur: 200 }});

});


describe('rests', function(){
  
  parse("a rest", 
        "rest:300",
        { tag: 'rest', dur: 300 });

  parse("a seq of notes+rests with list scoped duration", 
        "{a4 rest b3 rest}:300",
        {tag: 'seq', 
         left:{ tag: 'note', pitch: 'a4', dur: 300 },
         right: {tag:'seq',
                 left: { tag: 'rest', dur: 300 },
                 right: {tag: 'seq',
                         left:{ tag: 'note', pitch: 'b3', dur: 300 },
                         right: { tag: 'rest', dur: 300 }}}});
});


describe('nested expressions', function(){

  parse("a seq of notes with list scoped duration", 
        "{a4 b3 {c4 d3}:300}:300",
        { tag: 'seq',
          left: { tag: 'note', pitch: 'a4', dur: 300 },
          right: 
          { tag: 'seq',
            left: { tag: 'note', pitch: 'b3', dur: 300 },
            right: 
            { tag: 'seq',
              left: { tag: 'note', pitch: 'c4', dur: 300 },
              right: { tag: 'note', pitch: 'd3', dur: 300 } } } });

  parse("a seq of notes with list scoped duration", 
        "{a4 b3 harmony {c4 d3}:300}:300",
        { tag: 'seq',
          left: { tag: 'note', pitch: 'a4', dur: 300 },
          right: 
          { tag: 'seq',
            left: { tag: 'note', pitch: 'b3', dur: 300 },
            right: 
            { tag: 'par',
              left: { tag: 'note', pitch: 'c4', dur: 300 },
              right: { tag: 'note', pitch: 'd3', dur: 300 } } } });

});



describe('repeats', function(){

  parse("repeat a simple note",
        "repeat 3 a2:300",            // repeat a2 3 times
        {tag:"repeat",count:3,section:{tag:"note",pitch:"a2",dur:300}});

  parse("a seq of notes with list scoped duration", 
        "repeat 5 {a4 b3 {c4 d3}:300}:300",
        { tag: 'repeat',
          count: 5,
          section: 
          { tag: 'seq',
            left: { tag: 'note', pitch: 'a4', dur: 300 },
            right: 
            { tag: 'seq',
              left: { tag: 'note', pitch: 'b3', dur: 300 },
              right: 
              { tag: 'seq',
                left: { tag: 'note', pitch: 'c4', dur: 300 },
                right: { tag: 'note', pitch: 'd3', dur: 300 } } } } });

  parse("a seq of notes+rests with list scoped duration", 
        "repeat 99 {a4 rest b3 rest}:300",
        { tag: 'repeat',
          count: 99,
          section: 
          { tag: 'seq',
            left: { tag: 'note', pitch: 'a4', dur: 300 },
            right: 
            { tag: 'seq',
              left: { tag: 'rest', dur: 300 },
              right: 
              { tag: 'seq',
                left: { tag: 'note', pitch: 'b3', dur: 300 },
                right: { tag: 'rest', dur: 300 } } } } });
  
  parse("a seq of notes with note scoped durations", 
        "{c1:100 repeat 3 a2:300 d2:200}",
        { tag: 'seq',
          left: { tag: 'note', pitch: 'c1', dur: 100 },
          right: 
          { tag: 'seq',
            left: 
            { tag: 'repeat',
              count: 3,
              section: { tag: 'note', pitch: 'a2', dur: 300 } },
            right: { tag: 'note', pitch: 'd2', dur: 200 } } });

});


