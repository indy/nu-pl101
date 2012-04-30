var interpreter = require('../lib/interpreter');
var chai = require('chai');
var assert = chai.assert;

function testEval(expression, env, expected) {
  assert.deepEqual(interpreter.evalScheem(expression, env), 
                   expected);
}

describe('quote', function() {

    it('should quote a number', function() {
      testEval(['quote', 3], {}, 
               3);
    });

    it('should quote an atom', function() {
      testEval(['quote', 'dog'], {}, 
               'dog');
    });

    it('should quote a list', function() {
      testEval(['quote', [1, 2, 3]], {}, 
               [1, 2, 3]);
    });

});

