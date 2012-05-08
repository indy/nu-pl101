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

var newScope = function(env) {
  return {bindings: {}, outer: env};
};

var addBinding = function (env, v, val) {
    env.bindings[v] = val;
    return env;
};
var lookup = function (env, v) {
    if(env === {}) {
        throw "unknown variable " + v;
    }
    if(env.bindings[v] !== undefined) {
        return env.bindings[v];
    }
    return lookup(env.outer, v);
};
var update = function (env, v, val) {
    if(env === {}) {
        throw "trying to set! an undefined variable: " + v;
    }
    if(env.bindings[v] !== undefined) {
        env.bindings[v] = val;
        return env;
    }
    return update(env.outer, v, val);
};


  var reduceArgs = function(expr, env, fn) {
    return expr.slice(2).reduce(function(a, b) { return fn(a, eval(b, env)); },
                                eval(expr[1], env));
  };

  var bool = function(expr, env, fn) {
    return fn(eval(expr[1], env), eval(expr[2], env)) ? '#t' : '#f';
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
      env = addBinding(env, expr[1], eval(expr[2], env));
      return 0;
    },
    'set!': function(expr, env) {
      env = update(env, expr[1], eval(expr[2], env));
      return 0;
    },
    'begin': function(expr, env) {
      var res;
      expr.slice(1).forEach(function (e){
        res = eval(e, env);
      });
      return res;
    },
    'quote': function(expr, env) {
      if (expr.length !== 2) {
        throw "need a single expression after 'quote'";
      } 
      return expr[1];
    },
    'cons': function(expr, env) {
      var xs = eval(expr[2], env);
      xs.unshift(eval(expr[1], env));
      return xs;
    },
    'car': function(expr, env) {
      return eval(expr[1], env)[0];
    },
    'cdr': function(expr, env) {
      return eval(expr[1], env).slice(1);
    },
    '=': function(expr, env) {
      return bool(expr, env, function(a, b) { return a == b; });
    },
    '<': function(expr, env) {
      return bool(expr, env, function (a, b) { return a < b; });
    },
    '>': function(expr, env) {
      return bool(expr, env, function (a, b) { return a > b; });
    },
    'if': function(expr, env) {
      if (eval(expr[1], env) === '#t') {
        return eval(expr[2], env);
      } else {
        return eval(expr[3], env);
      }
    },
    'let-one': function(expr, env) {
      var newEnv = addBinding(newScope(env), 
                              expr[1], eval(expr[2], env));
      return eval(expr[3], newEnv);
    }
  };


  var argsAsArray = function(expr, env) {
    return expr.slice(1).reduce(function(a, b) { 
                                  a.push(eval(b, env));
                                  return a;},
                                []);
  };

  var eval = function(expr, env) {
    var op, fn, args;

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
      return expr;
    }

    // Strings are variable references
    if (typeof expr === 'string') {
      return lookup(env, expr);
    }

    op = expr[0];
    if(dispatchOn[op] !== undefined) {
      return dispatchOn[op](expr, env);
    } else {
      // function application
      fn = eval(expr[0], env);
      args = argsAsArray(expr, env);
      return fn.apply(null, args);
    }
  };

  return {
    evalScheem: function(expr, env) {
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
