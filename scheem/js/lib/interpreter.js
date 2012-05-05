/*!
 * scheem interpreter
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/

var Scheem;

if (typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.interpreter = (function () {

  var reduceArgs = function (expr, env, fn) {
    return expr.slice(2).reduce(function(a, b) {return fn(a, eval(b, env));},
                                eval(expr[1], env));
  };

  var dispatchOn = {
    '+': function(expr, env) {
      return reduceArgs(expr, env, function (a, b) { return a + b; });
    },
    '-': function(expr, env) {
      return reduceArgs(expr, env, function (a, b) { return a - b; });
    },
    '*': function(expr, env) {
      return reduceArgs(expr, env, function (a, b) { return a * b; });
    },
    '/': function(expr, env) {
      return reduceArgs(expr, env, function (a, b) { return a / b; });
    },
    'define': function(expr, env) {
      env[expr[1]] = eval(expr[2], env);
      return 0;
    },
    'set!': function(expr, env) {
      if (env[expr[1]] === undefined) {
        throw "trying to set! an undefined variable: " + expr[1];
      } else {
        env[expr[1]] = eval(expr[2], env);
      }
      return 0;
    },
    'begin': function(expr, env) {
      var res;
      for (var i = 1;i < expr.length;i += 1) {
        res = eval(expr[i], env);
      }
      return res;
    },
    'quote': function(expr, env) {
      if (expr.length !== 2) {
        throw "need a single expression after 'quote'";
      } 
      return expr[1];
    },
    '=': function(expr, env) {
      return (eval(expr[1], env) === eval(expr[2], env)) ? '#t' : '#f';
    },
    '<': function(expr, env) {
      return (eval(expr[1], env) < eval(expr[2], env)) ? '#t' : '#f';
    },
    '>': function(expr, env) {
      return (eval(expr[1], env) > eval(expr[2], env)) ? '#t' : '#f';
    },
    'cons': function(expr, env) {
      var x = eval(expr[1], env);
      var xs = eval(expr[2], env);
      xs.unshift(x);
      return xs;
    },
    'car': function(expr, env) {
      var xs = eval(expr[1], env);
      return xs[0];
    },
    'cdr': function(expr, env) {
      var xs = eval(expr[1], env).slice();
      xs.splice(0, 1);
      return xs;
    },
    'if': function(expr, env) {
      var res = eval(expr[1], env);
      if (res === '#t') {
        return eval(expr[2], env);
      } else {
        return eval(expr[3], env);
      }
    }
  };


  var eval = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
      return expr;
    }

    // Strings are variable references
    if (typeof expr === 'string') {
      if (env[expr] === undefined) {
        throw "unknown variable " + expr;
      }
      return env[expr];
    }

    var op = expr[0];
    return dispatchOn[op](expr, env);
  };

  return {
    evalScheem: function (expr, env) {
      var res;
      expr.forEach(function (e) {
        res = eval(e, env);
      });
      return res;
    }
  };

}());

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
  module.exports.evalScheem = Scheem.interpreter.evalScheem;
}
