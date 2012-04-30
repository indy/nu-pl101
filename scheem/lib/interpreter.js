

exports.evalScheem = function (expr) {
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
    return evalScheem(expr[1]) + evalScheem(expr[2]);
  case '-':
    return evalScheem(expr[1]) - evalScheem(expr[2]);
  case '*':
    return evalScheem(expr[1]) * evalScheem(expr[2]);
  case '/':
    return evalScheem(expr[1]) / evalScheem(expr[2]);

  case 'define':
    env[expr[1]] = evalScheem(expr[2], env);
    return 0;
  case 'set!':
    env[expr[1]] = evalScheem(expr[2], env);
    return 0;
  case 'begin':
    for(i=1;i<expr.length;i+=1) {
      res = evalScheem(expr[i], env);
    }
    return res;
  case 'quote':
    return expr[1];

  case '=':
    op = (evalScheem(expr[1], env) === evalScheem(expr[2], env));
    return op ? '#t' : '#f';
  case '<':
    op = (evalScheem(expr[1], env) < evalScheem(expr[2], env));
    return op ? '#t' : '#f';
  case '>':
    op = (evalScheem(expr[1], env) > evalScheem(expr[2], env));
    return op ? '#t' : '#f';

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

  case 'if':
    res = evalScheem(expr[1], env);
    if(res === '#t') {
      return evalScheem(expr[2], env);
    } else {
      return evalScheem(expr[3], env);
    }

  }

};
