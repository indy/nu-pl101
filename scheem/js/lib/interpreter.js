/*!
 * scheem interpreter
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
*/

var Scheem;

if (typeof(Scheem) === 'undefined') {
  Scheem = {};
}

Scheem.interpreter = (function (global) {
  "use strict";

  var newScope = function(env) {
    return {bindings: {}, outer: env};
  };

  var addBinding = function (env, v, val) {
    env.bindings[v] = val;
    return env;
  };

  var addBindings = function (expr, env) {
    expr.forEach(function(e) {
      addBinding(env, e[0], evl(e[1], env));
    });
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

  var mutate = function (env, v, val) {
    if(env === {}) {
      throw "trying to alter an undefined variable: " + v;
    }
    if(env.bindings[v] !== undefined) {
      env.bindings[v] = val;
      return env;
    }
    return mutate(env.outer, v, val);
  };

  var addRequiredForms = function (env) {
    var bindings = {    
      '+': function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(a, b) { return a + b; });
      },
      '-': function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(a, b) { return a - b; });
      },
      '*': function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(a, b) { return a * b; });
      },
      '/': function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(a, b) { return a / b; });
      },
      '=': function(a, b) {
        return a === b ? '#t' : '#f';
      },
      '<': function(a, b) {
        return a < b ? '#t' : '#f';
      },
      '>': function(a, b) {
        return a > b ? '#t' : '#f';
      },
      'empty?': function(xs) {
        return xs.length === 0 ? '#t' : '#f';
      },
      'cons': function(x, xs) {
        xs.unshift(x);
        return xs;
      },
      'car': function(lst) {
        return lst[0];
      },
      'cdr': function(lst) {
        return lst.slice(1);
      },
      'alert': function(expr) {
        if (typeof module !== 'undefined') {
          console.log(expr);
        } else {
          alert(expr);
        }
      }
    };

    var mandatoryEnv = {bindings:bindings, outer:{}, mandatory: true};

    // go to the outermost environment and wrap the default bindings around it
    var e = env;
    while(Object.keys(e.outer).length > 0) {
      if(e.mandatory !== undefined) {
        return env;
      }
      e = e.outer;
    }
    if(e.mandatory !== undefined) {
      return env;
    }
    e.outer = mandatoryEnv;
    return env;
  }

  var specialForm = {
    '.': function(expr, env) {
      var obj = global;
      var thisobj = global;

      expr[1].forEach(function(e) {
        thisobj = obj;
        obj = obj[e];
      });

      var args = expr.slice(2).map(function(e) {
        return evl(e, env);
      });

      return obj.apply(thisobj, args);

    },
    'define': function(expr, env) {
      env = addBinding(env, expr[1], evl(expr[2], env));
      return 0;
    },
    'set!': function(expr, env) {
      env = mutate(env, expr[1], evl(expr[2], env));
      return 0;
    },
    'begin': function(expr, env) {
      var res;
      expr.slice(1).forEach(function (e){
        res = evl(e, env);
      });
      return res;
    },
    'quote': function(expr, env) {
      if (expr.length !== 2) {
        throw "need a single expression after 'quote'";
      } 
      return expr[1];
    },
    'if': function(expr, env) {
      if (evl(expr[1], env) === '#t') {
        return evl(expr[2], env);
      } else {
        return evl(expr[3], env);
      }
    },
    '_string': function(expr, env) {
      return expr[1];
    },
    'let': function(expr, env) {
      return evl(expr[2], addBindings(expr[1], newScope(env)));
    },
    'lambda': function(expr, env) {
      return function() {
        var args = arguments;
        var newEnv = newScope(env);

        expr[1].map(function(e, i){
          addBinding(newEnv, e, args[i]);
        });

        return evl(expr[2], newEnv);
      };
    }
  };


  var argsAsArray = function(expr, env) {
    return expr.slice(1).reduce(function(a, b) { 
                                  a.push(evl(b, env));
                                  return a;},
                                []);
  };

  var evl = function(expr, env) {
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
    if(specialForm[op] !== undefined) {
      return specialForm[op](expr, env);
    } else {
      // function application
      fn = evl(expr[0], env);
      args = argsAsArray(expr, env);
      return fn.apply(null, args);
    }
  };

  return {
    evalScheem: function(expr, env) {
      var res;
      if(env === undefined) {
        env = {bindings:{},outer:{}};
      }
      env = addRequiredForms(env);
      expr.forEach(function (e) {
        res = evl(e, env);
      });
      return res;
    }
  };

}(this));

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
  module.exports.evalScheem = Scheem.interpreter.evalScheem;
}
