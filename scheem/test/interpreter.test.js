
if (typeof module !== 'undefined') {
  // In Node load required modules
  var chai = require('chai');
  var interpreter = require('../lib/interpreter');
  var peg = require('../lib/peg');
  var parser = require('../lib/parser');
  var evalScheem = interpreter.evalScheem;
  var evalScheemString = interpreter.evalScheemString;
} else {
  // In browser assume already loaded by <script> tags
  var peg = Scheem.peg;
  var parser = Scheem.parser;
  var evalScheem = Scheem.interpreter.evalScheem;
  var evalScheemString = Scheem.interpreter.evalScheemString;
}

// evalTest also compares the resultant AST, so we'll need
// the parser
var scheemParser = parser.buildParser(peg.pegDef);  

function evalTest(str, env, expected) {
  test(str, function() {
    chai.assert.deepEqual(evalScheemString(str, env), 
                          expected.res);
    if(expected.env !== undefined) {
      chai.assert.deepEqual(expected.env, env);
    }

    chai.assert.deepEqual(expected.ast, scheemParser(str));
  });
}

function evalShouldThrow(desc, expression, env) {
  test("should throw " + desc, function() {
    chai.expect(function() {
      evalScheem(expression, env);
    }).to.throw();
  });
}

suite('arithmetic: ', function() {

  evalTest('5',
           {},
           {
             ast:5,
             env:{},
             res:5
           });

  evalTest('(+ 2 3)',
           {},
           {
             ast:['+', 2, 3],
             env:{},
             res:5
           });

  evalTest('(* 2 3)',
           {},
           {
             ast:['*', 2, 3],
             env:{},
             res:6
           });

  evalTest('(- 5 3)',
           {},
           {
             ast:['-', 5, 3],
             env:{},
             res:2
           });

  evalTest('(/ 10 2)',
           {},
           {
             ast:['/', 10, 2],
             env:{},
             res:5
           });

  evalTest('(* (/ 8 4) (+ 1 1))',
           {},
           {
             ast:['*', ['/', 8, 4], ['+', 1, 1]],
             env:{},
             res:4
           });

});



suite('variables: ', function() {
  
  evalTest('5',
           {x:2, y:3, z:10},
           {
             ast:5,
             env:{x:2, y:3, z:10},
             res:5
           });

  evalTest('x',
           {x:2, y:3, z:10},
           {
             ast:'x',
             env:{x:2, y:3, z:10},
             res:2
           });

  evalTest('(+ 2 3)',
           {x:2, y:3, z:10},
           {
             ast:['+', 2, 3],
             env:{x:2, y:3, z:10},
             res:5
           });

  evalTest('(* y 3)',
           {x:2, y:3, z:10},
           {
             ast:['*', 'y', 3],
             env:{x:2, y:3, z:10},
             res:9
           });

  evalTest('(/ z (+ x y))',
           {x:2, y:3, z:10},
           {
             ast:['/', 'z', ['+', 'x', 'y']],
             env:{x:2, y:3, z:10},
             res:2
           });

});

suite('setting values:', function() {

  evalTest('(define a 5)',
           {x:2, y:3, z:10},
           {
             ast:['define', 'a', 5],
             env:{x:2, y:3, z:10, a:5},
             res:0
           });

  evalTest('(set! z 1)',
           {x:2, y:3, z:10},
           {
             ast:['set!', 'z', 1],
             res:0,
             env:{x:2, y:3, z:1}
           });

  evalTest('(set! y (+ x 5))',
             {x:2, y:3, z:10},
             {
               ast: ['set!', 'y', ['+', 'x', 5]], 
               res: 0,
               env: {x:2, y:7, z:10}
             });

  evalShouldThrow("when set!'ing an undefined variable", 
                  ['set!', 'y', 42], {});

});

suite('begin: ', function() {

  evalTest('(begin 1 2 3)',
           {},
           {
             ast:['begin', 1, 2, 3],
             env:{},
             res:3
           });

  evalTest('(begin (+ 2 2))',
           {},
           {
             ast:['begin', ['+', 2, 2]],
             env:{},
             res:4
           });

  evalTest('(begin x y x)',
           {x:1, y:2},
           {
             ast:['begin', 'x', 'y', 'x'],
             env:{x:1, y:2},
             res:1
           });

  evalTest('(begin (set! x 5) (set! x (+ y x)) x)',
           {x:1, y:2},
           {
             ast:['begin', 
                  ['set!', 'x', 5], 
                  ['set!', 'x', ['+', 'y', 'x']], 
                  'x'],
             env:{x:7, y:2},
             res:7
           });
});

suite('quote: ', function() {

  evalTest('(quote 3)',
           {},
           {
             ast:['quote', 3],
             env:{}, 
             res:3
           });

  evalTest('(quote dog)',
           {},
           {
             ast:['quote', 'dog'],
             env:{}, 
             res:'dog'
           });

  evalTest('(quote (1 2 3))',
           {},
           {
             ast:['quote', [1, 2, 3]],
             env:{},
             res:[1, 2, 3]
           });

  evalTest('(quote (+ 2 3))',
           {},
           {
             ast:['quote', ['+', 2, 3]],
             env:{},
             res:['+', 2, 3]
           });

  evalTest('(quote (quote (+ 2 3)))',
           {},
           {
             ast:['quote', ['quote', ['+', 2, 3]]],
             env:{},
             res:['quote', ['+', 2, 3]]
           });

  evalTest("'3",
           {},
           {
             ast:['quote', 3], 
             env:{}, 
             res:3
           });

  evalTest("'dog",
           {},
           {
             ast: ['quote', 'dog'],
             env: {},
             res: 'dog'
           });

  evalTest("'(1 2 3)",
           {},
           {
             ast: ['quote', [1, 2, 3]],
             env: {},
             res: [1, 2, 3]
           });

  evalTest('(quote (+ 2 3))',
           {},
           {
             ast:['quote', ['+', 2, 3]],
             env: {},
             res:['+', 2, 3]
           });

  evalTest('(quote (quote (+ 2 3)))',
           {},
           {
             ast:['quote', ['quote', ['+', 2, 3]]],
             env:{},
             res:['quote', ['+', 2, 3]]
           });

  evalShouldThrow("when more than 1 expression follows quote", 
                  ['quote', 'y', 42], {});

});


suite('working with values:', function() {

  evalTest('(< 2 2)',
           {},
           {
             ast:['<', 2, 2],
             env:{}, 
             res:'#f'
           });

  evalTest('(< 2 3)',
           {},
           {
             ast:['<', 2, 3],
             env:{}, 
             res:'#t'
           });
  
  evalTest('(< (+ 1 1) (+ 2 3))',
           {},
           {
             ast:['<', ['+', 1, 1], ['+', 2, 3]],
             env:{}, 
             res:'#t'
           });
  
});


suite('working with lists: ', function() {

  evalTest('(quote (2 3))',
           {},
           {
             ast:['quote', [2, 3]],
             env:{}, 
             res:[2, 3]
           });

  evalTest("(cons 1 '(2 3))",
           {},
           {
             ast:['cons', 1, ['quote', [2, 3]]],
             env:{}, 
             res:[1, 2, 3]
           });

  evalTest("(cons '(1 2) '(3 4))",
           {},
           {
             ast:['cons', 
                  ['quote', [1, 2]], ['quote', [3, 4]]],
             env:{}, 
             res:[[1, 2], 3, 4]
           });

  evalTest("(car '((1 2) 3 4))",
           {},
           {
             ast:['car', ['quote', [[1, 2], 3, 4]]],
             env:{}, 
             res:[1, 2]
           });

  evalTest("(cdr '((1 2) 3 4))",
           {},
           {
             ast:['cdr', ['quote', [[1, 2], 3, 4]]],
             env:{}, 
             res:[3, 4]
           });
  
});


suite('conditionals: ', function() {

  evalTest('(if (= 1 1) 2 3)',
           {},
           {
             ast:['if', ['=', 1, 1], 2, 3],
             env:{},
             res:2
           });

  evalTest('(if (= 1 0) 2 3)',
           {},
           {
             ast:['if', ['=', 1, 0], 2, 3],
             env:{},
             res:3
           });

  evalTest('(if (= 1 1) 2 error)',
           {},
           {
             ast:['if', ['=', 1, 1], 2, 'error'],
             env:{}, 
             res:2
           });

  evalTest('(if (= 1 0) error 3)',
           {},
           {
             ast:['if', ['=', 1, 0], 'error', 3],
             env:{},
             res:3
           });

  evalTest('(if (= 1 1) (if (= 2 3) 10 11) 12)',
           {},
           {
             ast:['if', ['=', 1, 1],
                  ['if', ['=', 2, 3], 10, 11], 12],
             env:{},
             res:11
           });
});

