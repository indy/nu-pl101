/*!
 * scheem interpreter
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/

if(typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.interpreter = (function() {

  if (typeof module !== 'undefined') {
    var peg = require('./peg');
    var parser = require('./parser');
  } else {
    var peg = Scheem.peg;
    var parser = Scheem.parser;
  }

  var scheemParser = parser.buildParser(peg.pegDef);  

  var evlString = function(string, env) {
    var expr = scheemParser(string);
    return evl(expr, env);
  }

  var evl = function (expr, env) {
    var i, xs, x, res, op;

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
      return expr;
    }

    // Strings are variable references
    if (typeof expr === 'string') {
      return env[expr];
    }

    // Look at head of list for operation
    switch (expr[0]) {
    case '+':
      return evl(expr[1], env) + evl(expr[2], env);
    case '-':
      return evl(expr[1], env) - evl(expr[2], env);
    case '*':
      return evl(expr[1], env) * evl(expr[2], env);
    case '/':
      return evl(expr[1], env) / evl(expr[2], env);

    case 'define':
      env[expr[1]] = evl(expr[2], env);
      return 0;
    case 'set!':
      env[expr[1]] = evl(expr[2], env);
      return 0;
    case 'begin':
      for(i=1;i<expr.length;i+=1) {
        res = evl(expr[i], env);
      }
      return res;
    case 'quote':
      return expr[1];
    case "'":
      return expr[1];

    case '=':
      op = (evl(expr[1], env) === evl(expr[2], env));
      return op ? '#t' : '#f';
    case '<':
      op = (evl(expr[1], env) < evl(expr[2], env));
      return op ? '#t' : '#f';
    case '>':
      op = (evl(expr[1], env) > evl(expr[2], env));
      return op ? '#t' : '#f';

    case 'cons':
      x = evl(expr[1], env);
      xs = evl(expr[2], env);
      xs.unshift(x);
      return xs;
    case 'car':
      xs = evl(expr[1], env);
      return xs[0];
    case 'cdr':
      xs = evl(expr[1], env);
      xs.splice(0, 1);
      return xs;

    case 'if':
      res = evl(expr[1], env);
      if(res === '#t') {
        return evl(expr[2], env);
      } else {
        return evl(expr[3], env);
      }

    }

  };

  return {
    evalScheem: evl,
    evalScheemString: evlString
  };

})();

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = Scheem.interpreter.evalScheem;
    module.exports.evalScheemString = Scheem.interpreter.evalScheemString;
}
