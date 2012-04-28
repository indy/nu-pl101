var assert = require('assert');
var compiler = require('../lib/compiler');

function compare(txt, ast, note) {
  it(txt, function(){
    assert.deepEqual(compiler.compile(ast), note);
  });
};

describe("Compiler", function(){

  compare("Basic test",
          { tag: 'seq',
            left: 
            { tag: 'seq',
              left: { tag: 'note', pitch: 'a4', dur: 250 },
              right: { tag: 'note', pitch: 'b4', dur: 250 }},
            right:
            { tag: 'seq',
              left: { tag: 'note', pitch: 'c4', dur: 500 },
              right: { tag: 'note', pitch: 'd4', dur: 500 }}}, 
          [ { tag: 'note', pitch: 69, dur: 250, start: 0 },
            { tag: 'note', pitch: 71, dur: 250, start: 250 },
            { tag: 'note', pitch: 60, dur: 500, start: 500 },
            { tag: 'note', pitch: 62, dur: 500, start: 1000 } ]);


  compare("Rests", 
          { tag: 'seq',
            left: 
            { tag: 'seq',
              left: { tag: 'rest', dur: 500 },
              right: { tag: 'note', pitch: 'b4', dur: 250 }},
            right:
            { tag: 'seq',
              left: { tag: 'note', pitch: 'c4', dur: 500 },
              right: { tag: 'note', pitch: 'd4', dur: 500 }}},
          [ { tag: 'rest', dur: 500, start: 0 },
            { tag: 'note', pitch: 71, dur: 250, start: 500 },
            { tag: 'note', pitch: 60, dur: 500, start: 750 },
            { tag: 'note', pitch: 62, dur: 500, start: 1250 } ]);


  compare("Harmonies", 
          { tag: 'par',
            left: { tag: 'note', pitch: 'c4', dur: 250 },
            right:
            { tag: 'par',
              left: { tag: 'note', pitch: 'e4', dur: 250 },
              right: { tag: 'note', pitch: 'g4', dur: 250 }}},
          [ { tag: 'note', pitch: 60, dur: 250, start: 0 },
            { tag: 'note', pitch: 64, dur: 250, start: 0 },
            { tag: 'note', pitch: 67, dur: 250, start: 0 } ]);

  compare("Repeat sections", 
          { tag: 'seq',
            left: 
            { tag: 'seq',
              left: { tag: 'note', pitch: 'a4', dur: 250 },
              right: { tag: 'repeat',
                       section: { tag: 'note', 
                                  pitch: 'b4', 
                                  dur: 250 },
                       count: 3 } },
            right:
            { tag: 'seq',
              left: { tag: 'note', pitch: 'c4', dur: 500 },
              right: { tag: 'note', pitch: 'd4', dur: 500 }}},
          [ { tag: 'note', pitch: 69, dur: 250, start: 0 },
            { tag: 'note', pitch: 71, dur: 250, start: 250 },
            { tag: 'note', pitch: 71, dur: 250, start: 500 },
            { tag: 'note', pitch: 71, dur: 250, start: 750 },
            { tag: 'note', pitch: 60, dur: 500, start: 1000 },
            { tag: 'note', pitch: 62, dur: 500, start: 1500 } ]);

});
