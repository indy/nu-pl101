
if (typeof module !== 'undefined') {
  // In Node load required modules
  var interpreter = require('../lib/interpreter');
  var evalScheemString = interpreter.evalScheemString;
  var chai = require('chai');

} else {
  var evalScheemString = Scheem.interpreter.evalScheemString;
}

function evalShould(desc, 
                    str, env, 
                    expectedRes, expectedEnv) {
  test(desc, function() {

    chai.assert.deepEqual(evalScheemString(str, env), 
                     expectedRes);

    if(expectedEnv !== undefined) {
      chai.assert.deepEqual(expectedEnv, env);
    }

  });
}

suite('arithmetic', function() {

  evalShould('return a number',
             '5', {},
             5);

  evalShould('add two numbers',
             '(+ 2 3)', {},
             5);

  evalShould('multiply two numbers',
             '(* 2 3)', {},
             6);

  evalShould('subtract two numbers',
             '(- 5 3)', {},
             2);

  evalShould('divide two numbers',
             '(/ 10 2)', {},
             5);

  evalShould('combined arithmetic operations',
             '(* (/ 8 4) (+ 1 1))', {},
             4);

});



suite('variables', function() {
  
  evalShould('return a number',
             '5', {x:2, y:3, z:10},
             5);

  evalShould('lookup a variable',
             'x', {x:2, y:3, z:10},
             2);

  evalShould('add two numbers',
             '(+ 2 3)', {x:2, y:3, z:10},
             5);

  evalShould('multiply a number and variable',
             '(* y 3)', {x:2, y:3, z:10},
             9);

  evalShould('combined variables',
             '(/ z (+ x y))', {x:2, y:3, z:10},
             2);

});

suite('setting values', function() {

  evalShould('define a value',
             '(define a 5)', {x:2, y:3, z:10},
             0, {x:2, y:3, z:10, a:5});

  evalShould('set! a value',
             '(set! z 1)', {x:2, y:3, z:10},
             0, {x:2, y:3, z:1});

  evalShould('set! a value',
             '(set! a 1)', {x:2, y:3, z:10},
             0, {x:2, y:3, z:10, a:1});

  evalShould('set! a value',
             '(set! y (+ x 5))', {x:2, y:3, z:10},
             0, {x:2, y:7, z:10});

});

suite('begin', function() {

  evalShould('begin 1',
             '(begin 1 2 3)', {},
             3);

  evalShould('begin 2',
             '(begin (+ 2 2))', {},
             4);

  evalShould('begin 3',
             '(begin x y x)', {x:1, y:2},
             1);

  evalShould('begin 3',
             '(begin (set! x 5) (set! x (+ y x)) x)', {x:1, y:2},
             7);

});


suite('quote', function() {

  evalShould('quote a number',
             '(quote 3)', {}, 
             3);
  
  evalShould('quote an atom',
             '(quote dog)', {}, 
             'dog');

  evalShould('should quote a list',
             '(quote (1 2 3))', {},
             [1, 2, 3]);

  evalShould('should quote a list 2',
             '(quote (+ 2 3))', {},
             ['+', 2, 3]);

  evalShould('should quote a list 3',
             '(quote (quote (+ 2 3)))', {},
             ['quote', ['+', 2, 3]]);

});


suite('working with values', function() {

  evalShould('compare values 1',
             '(< 2 2)', {}, 
             '#f');

  evalShould('compare values 2',
             '(< 2 3)', {}, 
             '#t');
  
  evalShould('compare values 2',
             '(< (+ 1 1) (+ 2 3))', {}, 
             '#t');
  
});


suite('working with lists', function() {

  evalShould('(quote (2 3))',
             '(quote (2 3))', {}, 
             [2, 3]);

  evalShould("(cons 1 '(2 3))",
             "(cons 1 '(2 3))", {}, 
             [1, 2, 3]);

  evalShould("(cons '(1 2) '(3 4))",
             "(cons '(1 2) '(3 4))", {}, 
             [[1, 2], 3, 4]);

  evalShould("(car '((1 2) 3 4))",
             "(car '((1 2) 3 4))", {}, 
             [1, 2]);

  evalShould("(cdr '((1 2) 3 4))",
             "(cdr '((1 2) 3 4))", {}, 
             [3, 4]);

});


suite('conditionals', function() {

  evalShould('(if (= 1 1) 2 3)',
             '(if (= 1 1) 2 3)', {},
             2);


  evalShould('(if (= 1 0) 2 3)',
             '(if (= 1 0) 2 3)', {},
             3);

  evalShould('(if (= 1 1) 2 error)',
             '(if (= 1 1) 2 error)', {}, 
             2);

  evalShould('(if (= 1 0) error 3)',
             '(if (= 1 0) error 3)', {},
             3);

  evalShould('(if (= 1 1) (if (= 2 3) 10 11) 12)',
             '(if (= 1 1) (if (= 2 3) 10 11) 12)', {},
             11);

});

