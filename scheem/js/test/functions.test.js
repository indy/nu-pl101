
var Scheem;

if (typeof module !== 'undefined') {
  // In Node load required modules
  var chai = require('chai');
  var interpreter = require('../lib/interpreter');
  var parser = require('../lib/parser');

} else {
  // In browser assume already loaded by <script> tags
  var parser = Scheem.parser;
  var interpreter = Scheem.interpreter;
}

var evalScheem = interpreter.evalScheem;
var scheemParser = parser.buildParser();  

function evalEnvTest(str, env, expected) {
  test(str, function () {

    var ast = scheemParser(str);
    chai.assert.deepEqual(expected.ast, ast);

    var res = evalScheem(ast, env);

    chai.assert.deepEqual(res, expected.res);
    if (expected.env !== undefined) {
      chai.assert.deepEqual(expected.env, env);
    }
  });
}

function evalShouldThrow2(desc, expression, env) {
  test("should throw " + desc, function () {
    chai.expect(function () {
      evalScheem(expression, env);
    }).to.throw();
  });
}

suite('looking up variables in outer scope ', function () {

  evalEnvTest('(+ x y)',
              { bindings:{'x': 8}, 
                outer:{
                  bindings:{'y':9}, 
                  outer:{}
                }
              },
              { ast: [['+', 'x', 'y']],
                env: { bindings:{'x': 8}, 
                       outer:{
                         bindings:{'y':9}, 
                         outer:{}
                       }
                     },
                res: 17
              });
});

suite('let-one scope ', function () {

  evalEnvTest('(let-one x 5 x)',
              {bindings:{'x': 2}, outer:{}},
              { ast: [['let-one', 'x', 5, 'x']],
                env: {bindings:{'x': 2}, outer:{}},
                res: 5
              });

  evalEnvTest('(define x 4) (let-one x 5 x)',
              {bindings:{}, outer:{}},
              { ast: [['define', 'x', 4],
                      ['let-one', 'x', 5, 'x']],
                env: {bindings:{'x': 4}, outer:{}},
                res: 5
              });

});


suite('function application ', function () {

  var return2 = function() { return 2;};
  evalEnvTest('(ret-2)',
              {bindings:{'ret-2': return2},
               outer:{}},
              { ast: [['ret-2']],
                env: {bindings:{'ret-2': return2},
                      outer:{}},
                res: 2
              });

  var subtract5 = function(i) { return i - 5;};
  evalEnvTest('(sub-5 12)',
              {bindings:{'sub-5': subtract5},
               outer:{}},
              { ast: [['sub-5', 12]],
                env: {bindings:{'sub-5': subtract5},
                      outer:{}},
                res: 7
              });

  var addBoth = function(a, b) { return a + b;};
  evalEnvTest('(add-both 3 4)',
              {bindings:{'add-both': addBoth},
               outer:{}},
              { ast: [['add-both', 3, 4]],
                env: {bindings:{'add-both': addBoth},
                      outer:{}},
                res: 7
              });

});
