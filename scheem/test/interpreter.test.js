
if (typeof module !== 'undefined') {
  // In Node load required modules
  var interpreter = require('../lib/interpreter');
  var evalScheem = interpreter.evalScheem;
  var chai = require('chai');
  var assert = chai.assert;
  var expect = chai.expect;

} else {
  // In browser assume already loaded by <script> tags
  var assert = chai.assert;
  var expect = chai.expect;
}

function evalShould(desc, 
                    expression, env, 
                    expectedRes, expectedEnv) {
  it(desc, function() {
    assert.deepEqual(evalScheem(expression, env), 
                     expectedRes);

    if(expectedEnv !== undefined) {
      assert.deepEqual(expectedEnv, env);
    }

  });
}

describe('arithmetic', function() {

  evalShould('return a number',
             5, {},
             5);

  evalShould('add two numbers',
             ['+', 2, 3], {},
             5);

  evalShould('multiply two numbers',
             ['*', 2, 3], {},
             6);

  evalShould('subtract two numbers',
             ['-', 5, 3], {},
             2);

  evalShould('divide two numbers',
             ['/', 10, 2], {},
             5);

  evalShould('combined arithmetic operations',
             ['*', ['/', 8, 4], ['+', 1, 1]], {},
             4);

});

describe('variables', function() {
  
  evalShould('return a number',
             5, {x:2, y:3, z:10},
             5);

  evalShould('lookup a variable',
             'x', {x:2, y:3, z:10},
             2);

  evalShould('add two numbers',
             ['+', 2, 3], {x:2, y:3, z:10},
             5);

  evalShould('multiply a number and variable',
             ['*', 'y', 3], {x:2, y:3, z:10},
             9);

  evalShould('combined variables',
             ['/', 'z', ['+', 'x', 'y']], {x:2, y:3, z:10},
             2);

});

describe('setting values', function() {

  evalShould('define a value',
             ['define', 'a', 5], {x:2, y:3, z:10},
             0, {x:2, y:3, z:10, a:5});

  evalShould('set! a value',
             ['set!', 'z', 1], {x:2, y:3, z:10},
             0, {x:2, y:3, z:1});

  evalShould('set! a value',
             ['set!', 'a', 1], {x:2, y:3, z:10},
             0, {x:2, y:3, z:10, a:1});

  evalShould('set! a value',
             ['set!', 'y', ['+', 'x', 5]], {x:2, y:3, z:10},
             0, {x:2, y:7, z:10});

});

describe('begin', function() {

  evalShould('begin 1',
             ['begin', 1, 2, 3], {},
             3);

  evalShould('begin 2',
             ['begin', ['+', 2, 2]], {},
             4);

  evalShould('begin 3',
             ['begin', 'x', 'y', 'x'], {x:1, y:2},
             1);

  evalShould('begin 3',
             ['begin', 
              ['set!', 'x', 5], 
              ['set!', 'x', ['+', 'y', 'x']], 
              'x'], {x:1, y:2},
             7);

});

describe('quote', function() {

  evalShould('quote a number',
             ['quote', 3], {}, 
             3);
  
  evalShould('quote an atom',
             ['quote', 'dog'], {}, 
             'dog');

  evalShould('should quote a list',
             ['quote', [1, 2, 3]], {},
             [1, 2, 3]);

  evalShould('should quote a list 2',
             ['quote', ['+', 2, 3]], {},
             ['+', 2, 3]);

  evalShould('should quote a list 3',
             ['quote', ['quote', ['+', 2, 3]]], {},
             ['quote', ['+', 2, 3]]);

});


describe('working with values', function() {

  evalShould('compare values 1',
             ['<', 2, 2], {}, 
             '#f');

  evalShould('compare values 2',
             ['<', 2, 3], {}, 
             '#t');
  
  evalShould('compare values 2',
             ['<', ['+', 1, 1], ['+', 2, 3]], {}, 
             '#t');
  
});


describe('working with lists', function() {

  evalShould('(quote (2 3))',
             ['quote', [2, 3]], {}, 
             [2, 3]);

  evalShould("(cons 1 '(2 3))",
             ['cons', 1, ['quote', [2, 3]]], {}, 
             [1, 2, 3]);

  evalShould("(cons '(1 2) '(3 4))",
             ['cons', 
              ['quote', [1, 2]], ['quote', [3, 4]]], {}, 
             [[1, 2], 3, 4]);

  evalShould("(car '((1 2) 3 4))",
             ['car', ['quote', [[1, 2], 3, 4]]], {}, 
             [1, 2]);

  evalShould("(cdr '((1 2) 3 4))",
             ['cdr', ['quote', [[1, 2], 3, 4]]], {}, 
             [3, 4]);
  
});


describe('conditionals', function() {

  evalShould('(if (= 1 1) 2 3) test',
             ['if', ['=', 1, 1], 2, 3], {},
             2);


  evalShould('(if (= 1 0) 2 3) test',
             ['if', ['=', 1, 0], 2, 3], {},
             3);

  evalShould('(if (= 1 1) 2 error) test',
             ['if', ['=', 1, 1], 2, 'error'], {}, 
             2);

  evalShould('(if (= 1 1) error 3) test',
             ['if', ['=', 1, 0], 'error', 3], {},
             3);

  evalShould('(if (= 1 1) (if (= 2 3) 10 11) 12) test',
             ['if', ['=', 1, 1],
              ['if', ['=', 2, 3], 10, 11], 12], {},
             11);

});
