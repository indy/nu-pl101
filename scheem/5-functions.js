

// 6

var add_binding = function (env, v, val) {
    env.bindings[v] = val;
    return env;
};

// 5

var evalScheem = function (expr, env) {
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'lambda-one':
              return function(_arg) {
                var b = {};
                b[expr[1]] = _arg;
                return evalScheem(expr[2], 
                                  {bindings: b, outer: env});
            };
        default:
            // Simple application
            var func = evalScheem(expr[0], env);
            var arg = evalScheem(expr[1], env);
            return func(arg);
    }
};


// 4

var evalScheem = function (expr, env) {
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'quote':
            return expr[1];
        default:
            var fn = evalScheem(expr[0], env);
            return fn(evalScheem(expr[1], env));
    }
};

// 3

var update = function (env, v, val) {
    if(env.bindings[v] !== undefined) {
        env.bindings[v] = val;
        return env;
    }
    return update(env.outer, v, val);
};

// 2

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'let-one':
            var bindings = {};
            bindings[expr[1]] = evalScheem(expr[2], env);
            return evalScheem(expr[3], {bindings: bindings,
                                        outer: env});
    }
};

// 1

var lookup = function (env, v) {
    if(env === {}) {
        return;
    }
    if(env.bindings[v] !== undefined) {
        return env.bindings[v];
    }
    return lookup(env.outer, v);
};
