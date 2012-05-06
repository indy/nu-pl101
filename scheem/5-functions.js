
// 3

var update = function (env, v, val) {
    // Your code here
    if(env.name === v) {
        env.value = val;
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
            return evalScheem(expr[3], {name: expr[1],
                                        value: evalScheem(expr[2], env),
                                        outer: env});
    }
};


// 1

var lookup = function (env, v) {
    // Your code here
    if(env === null) {
        return;
    }
    if(env.name === v) {
        return env.value;
    }
    return lookup(env.outer, v);
};
