
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


suite('lambda-one', function () {

  test('defining a function', function () {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser('(define plus-two (lambda-one x (+ x 2)))');
    var expected = { ast: [['define',
                            'plus-two',
                            ['lambda-one', 'x', ['+', 'x', 2]]]],
                res: 0
              };

    chai.assert.deepEqual(expected.ast, ast);
    var res = evalScheem(ast, env);
    chai.assert.deepEqual(res, expected.res);

    // function calls in js
    chai.assert.equal(env.bindings['plus-two'](33), 35);

    // function calls in scheem
    ast = scheemParser('(plus-two 77)');
    res = evalScheem(ast, env);
    chai.assert.equal(res, 79);

  });

  // calling an anonymous function
  evalEnvTest('((lambda-one x (+ x 2)) 7)',
              {bindings:{},outer:{}},
              { ast: [[['lambda-one', 'x', ['+', 'x', 2]], 7]],
                env: {bindings:{},outer:{}},
                res: 9
              });

  test('passing a function as a value to another function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define plus-two (lambda-one x (+ x 2)))',
                            '(define pass-in-six (lambda-one f (f 6)))',
                            '(pass-in-six plus-two)'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 8);
  });


  test('argument to a function shadows a global variable', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define x 44)',
                            '(define plus-two (lambda-one x (+ x 2)))',
                            '(define y (plus-two 3))'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(env.bindings['x'], 44);
    chai.assert.equal(env.bindings['y'], 5);
  });

  test('inner function uses values from enclosing function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define foo (lambda-one y (lambda-one z (+ z y))))',
                            '((foo 6) 7)'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 13);
  });

});

suite('lambda', function () {
  test('lambda function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define foo (lambda (x y) (+ x y)))',
                            '(foo 6 7)'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 13);
  });


  test('calling an anonymous function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser('((lambda (x) (+ x 2)) 7)');
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 9);
  });

  test('passing a function as a value to another function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define plus-two (lambda (x) (+ x 2)))',
                            '(define pass-in-six (lambda (f) (f 6)))',
                            '(pass-in-six plus-two)'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 8);
  });


  test('argument to a function shadows a global variable', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define x 44)',
                            '(define plus-two (lambda (x) (+ x 2)))',
                            '(define y (plus-two 3))'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(env.bindings['x'], 44);
    chai.assert.equal(env.bindings['y'], 5);
  });

  test('inner function uses values from enclosing function', function() {
    var env = {bindings:{},outer:{}};
    var ast = scheemParser(['(define foo (lambda (y) (lambda (z) (+ z y))))',
                            '((foo 6) 7)'].join(''));
    var res = evalScheem(ast, env);
    chai.assert.equal(res, 13);
  });

});
