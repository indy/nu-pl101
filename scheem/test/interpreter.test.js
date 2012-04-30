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
  
  var env = {x:2, y:3, z:10};

  evalShould('return a number',
             5, env,
             5);

  evalShould('lookup a variable',
             'x', env,
             2);

  evalShould('add two numbers',
             ['+', 2, 3], env,
             5);

  evalShould('multiply a number and variable',
             ['*', 'y', 3], env,
             9);

  evalShould('combined variables',
             ['/', 'z', ['+', 'x', 'y']], env,
             2);

});

describe('setting values', function() {

  var env = {x:2, y:3, z:10};

  evalShould('define a value',
             ['define', 'a', 5], env,
             0, {x:2, y:3, z:10, a:5});

  env = {x:2, y:3, z:10};
  evalShould('set! a value',
            ['set!', 'z', 1], env,
            0, {x:2, y:3, z:1});

  env = {x:2, y:3, z:10};
  evalShould('set! a value',
            ['set!', 'a', 1], env,
            0, {x:2, y:3, z:10, a:1});

  env = {x:2, y:3, z:10};
  evalShould('set! a value',
            ['set!', 'y', ['+', 'x', 5]], env,
            0, {x:2, y:7, z:10});

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


