var interpreter = require('../lib/interpreter');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

function evalShould(desc, 
                    expression, env, 
                    expectedRes, expectedEnv) {
  it(desc, function() {
    assert.deepEqual(interpreter.evalScheem(expression, env), 
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

});
