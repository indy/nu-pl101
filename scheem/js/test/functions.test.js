
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

function removeMandatoryEnv(env) {

  var e = env;
  while(e.outer !== undefined) {
    if(e.outer.mandatory !== undefined) {
      e.outer = {};
      return env;
    }
    e = e.outer;
  }
  return env;
}

function evalEnvTest(str, env, expected) {
  test(str, function () {

    var ast = scheemParser(str);
    chai.assert.deepEqual(expected.ast, ast);

    var res = evalScheem(ast, env);

    chai.assert.deepEqual(res, expected.res);
    if (expected.env !== undefined) {
      var e = removeMandatoryEnv(env);
      chai.assert.deepEqual(expected.env, e);
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

suite('let scope ', function () {

  evalEnvTest('(define add4 (let ((x 4)) (lambda (y) (+ x y)))) (add4 6)',
              {bindings:{}, outer:{}},
              { ast: [['define', 'add4', ['let', [['x', 4]], ['lambda', ['y'], ['+', 'x', 'y']]]],
                      ['add4', 6]],
                res: 10
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

suite('lambda', function () {
  test('lambda function', function() {
    var ast = scheemParser(['(define foo (lambda (x y) (+ x y)))',
                            '(foo 6 7)'].join(''));
    var res = evalScheem(ast);
    chai.assert.equal(res, 13);
  });


  test('calling an anonymous function', function() {
    var ast = scheemParser('((lambda (x) (+ x 2)) 7)');
    var res = evalScheem(ast);
    chai.assert.equal(res, 9);
  });

  test('passing a function as a value to another function', function() {
    var ast = scheemParser(['(define plus-two (lambda (x) (+ x 2)))',
                            '(define pass-in-six (lambda (f) (f 6)))',
                            '(pass-in-six plus-two)'].join(''));
    var res = evalScheem(ast);
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
    var ast = scheemParser(['(define foo (lambda (y) (lambda (z) (+ z y))))',
                            '((foo 6) 7)'].join(''));
    var res = evalScheem(ast);
    chai.assert.equal(res, 13);
  });

  test('recursive function', function() {
    var ast = scheemParser(['(define power (lambda (x y) (if (= 1 y) x (power (+ x x) (- y 1)))))',
                            '(power 2 4)'].join(''));
    var res = evalScheem(ast);
    chai.assert.equal(res, 16);
  });

});



suite('example programs', function () {
  test('factorial function', function() {
    var ast = scheemParser(["(define factorial (lambda (x) ",
                            "  (if (= x 1) ",
                            "      1 ",
                            "      (* x (factorial (- x 1))))))",
                            "(factorial 3)"].join(''));
    var res = evalScheem(ast);
    chai.assert.equal(res, 6);
  });

});

