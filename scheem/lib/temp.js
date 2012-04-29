var evalScheem = function (expr) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1]) + evalScheem(expr[2]);
        case '-':
            return evalScheem(expr[1]) - evalScheem(expr[2]);
        case '*':
            return evalScheem(expr[1]) * evalScheem(expr[2]);
        case '/':
            return evalScheem(expr[1]) / evalScheem(expr[2]);
    }
};



var evalScheem = function (expr, env) {
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
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env);

        case '*':
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env);

        case '/':
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env);
    }
};

// Write a version of evalScheem that can handle reading variables, addition, define, and set!. It should directly update values in the input environment.

var evalScheem = function (expr, env) {
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
    return evalScheem(expr[1], env) +
      evalScheem(expr[2], env);
  case '-':
    return evalScheem(expr[1], env) -
      evalScheem(expr[2], env);

  case '*':
    return evalScheem(expr[1], env) *
      evalScheem(expr[2], env);

  case '/':
    return evalScheem(expr[1], env) /
      evalScheem(expr[2], env);

  case 'define':
    env[expr[1]] = evalScheem(expr[2], env);
    return 0;
  case 'set!':
    env[expr[1]] = evalScheem(expr[2], env);
    return 0;

  }
};





// Write a version of evalScheem that can handle addition, set!, and begin.
var evalScheem = function (expr, env) {
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
    return evalScheem(expr[1], env) +
      evalScheem(expr[2], env);
  case 'set!':
    env[expr[1]] = evalScheem(expr[2], env);
    return 0;
  case 'begin':
    var res;
    for(var i=1;i<expr.length;i+=1) {
      res = evalScheem(expr[i], env);
    }
    return res;
  }
};


// Write a version of evalScheem that can do addition and quotation.
var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }
  // Look at head of list for operation
  switch (expr[0]) {
  case '+':
    return evalScheem(expr[1], env) +
      evalScheem(expr[2], env);
  case 'quote':
    return expr[1];
  }
};

// Here's a version of evalScheem that can handle addition and equality between numbers.
var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }
  // Look at head of list for operation
  switch (expr[0]) {
  case '+':
    return evalScheem(expr[1], env) +
      evalScheem(expr[2], env);
  case '=':
    var eq =
      (evalScheem(expr[1], env) ===
       evalScheem(expr[2], env));
    if (eq) return '#t';
    return '#f';
  }
};

//Write a version of evalScheem that works with addition and the predicate < for numbers.
var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }
  // Look at head of list for operation
  switch (expr[0]) {
  case '+':
    return evalScheem(expr[1], env) +
      evalScheem(expr[2], env);
  case '<':
    var lt =
      (evalScheem(expr[1], env) <
       evalScheem(expr[2], env));
    if (lt) return '#t';
    return '#f';
  }
};


// Write a version of evalScheem that works with quote, cons, car, and cdr. Don't worry about illegal inputs.

var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }

  var xs, x;
  
  // Look at head of list for operation
  switch (expr[0]) {
  case 'quote':
    return expr[1];
  case 'cons':
    x = evalScheem(expr[1], env);
    xs = evalScheem(expr[2], env);
    xs.unshift(x);
    return xs;
  case 'car':
    xs = evalScheem(expr[1], env);
    return xs[0];
  case 'cdr':
    xs = evalScheem(expr[1], env);
    xs.splice(0, 1);
    return xs;
  }
};



// Write a version of evalScheem that works with = and the if form.

var evalScheem = function (expr, env) {
  // Numbers evaluate to themselves
  if (typeof expr === 'number') {
    return expr;
  }
  if (expr === 'error') throw('Error');
  // Look at head of list for operation
  switch (expr[0]) {
  case '=':
    var eq =
      (evalScheem(expr[1], env) ===
       evalScheem(expr[2], env));
    if (eq) return '#t';
    return '#f';
  case 'if':
    var res = evalScheem(expr[1], env);
    if(res === '#t') {
      return evalScheem(expr[2], env);
    } else {
      return evalScheem(expr[3], env);
    }
  }
};
