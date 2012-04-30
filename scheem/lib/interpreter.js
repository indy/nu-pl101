if (typeof module !== 'undefined') {
  var fs = require('fs');
  var parser = require('./parser');
  var buildParser = parser.buildParser;
}


function makepegdef() {
  
}

var evlString;
if (typeof module !== 'undefined') {
  // node.js
  evlString = function(string, env) {
    var pegDef = fs.readFileSync('peg/scheem.pegjs', 'utf-8');
    var scheemParser = buildParser(pegDef);
    var expr = scheemParser(string);
    return evalScheem(expr, env);
  }

} else {
  // browser
  evlString = function(string, env) {
    var pegDef = "start =\n    expr\n\nexpr =\n    ignore a:atom ignore { return a; }\n  / ignore \"(\" e:expr* \")\" ignore { return e; }\n  / \"'\" e:expr { return [\"quote\", e]; }\n\nignore =\n    blank* comment*\n\nblank =\n    \" \"\n  / \"\\n\"\n  / \"\\t\"\n\ncomment = \n    \";;\" [^\\n]* \"\\n\" blank*\n\nvalidchar = \n    [><a-zA-Z0-9_?!+\-=@#$%^&*/.]\n\nnumber =\n    [0-9]\n\natom =\n    n:number+ { return parseInt(n.join(\"\"), 10); }\n  / w:validchar+ { return w.join(\"\"); }";

    var scheemParser = buildParser(pegDef);
    var expr = scheemParser(string);
    return evalScheem(expr, env);
  }
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

var evalScheem = evl;
var evalScheemString = evlString;

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
    module.exports.evalScheemString = evalScheemString;
}

