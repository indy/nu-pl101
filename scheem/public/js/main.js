function Con(id, mode) {
  this.console = CodeMirror(document.getElementById(id), {
    mode: mode,
    lineNumbers: true
  });

  this.content = "";

  this.log = function(msg) {
    this.content = this.content + "\n" + msg;
    this.console.setValue(this.content);
    var line = this.console.lineCount();
    this.console.setCursor({line: line, ch: 0})
  }
  
  this.clear = function() {
    this.content = "";
    this.console.setValue(this.content);
  }
}

// After page load
$(function() {

  var editor = CodeMirror(document.getElementById("editor"), {
    value: "(* 2 3)",
    mode: "scheme",
    theme: "ambiance",
    indentUnit: 2,
    tabSize: 2,
    matchBrackets: true
  });

  var con = new Con("console", "diff");
  var envCon = new Con("environment", "javascript");

//  con.log("This is where output goes.");

  var parser = Scheem.parser;
  var scheemParser = parser.buildParser();
  var evalScheem = Scheem.interpreter.evalScheem;
  var env = {};

  $('#run').click(function() {
    var user_text = editor.getValue();
    con.log('\n' + user_text.trim());
    try {
      var parsed = scheemParser(user_text);
      try {
        var result = evalScheem(parsed, env);
        con.log('> ' + JSON.stringify(result));
        envCon.clear();
        envCon.log(JSON.stringify(env));
      }
      catch(e) {
        con.log('- Eval Error: ' + e);
      }
    }
    catch(e) {
      con.log('- Parse Error: ' + e);
    }
  });

  function allClear() {
    con.clear();
    env = {};
    envCon.clear();
  }

  $('#clear-output').click(function() {
    con.clear();
  });
  $('#clear-environment').click(function() {
    env = {};
    envCon.clear();
  });

  $('#ex-1').click(function() {
    allClear();
    editor.setValue("\n\
; declare variables\n\
(define a 12)\n\
(define b 34)\n\
\n\
(define c (+ a b))\n\
\n\
; redefine variables\n\
(set! a 20)\n\
\n\
(+ a c)\n\
");
  })

  $('#ex-2').click(function() {
    allClear();
    editor.setValue("\n\
; a list of two items\n\
(define some-list '(foo bar))\n\
\n\
(define d 100)\n\
(define e 120)\n\
\n\
; prepend the minimum of d and e onto some-list\n\
(cons (if (< d e) \n\
          'd \n\
          'e) \n\
      some-list)\n\
\n\
\n\
");
  })

  $('#ex-3').click(function() {
    allClear();
    editor.setValue("\n\
; which item in the list is the largest\n\
(define number-list '(4 3))\n\
\n\
(if (> (car number-list)\n\
       (car (cdr number-list)))\n\
    'first 'second)\n\
\n\
");
  })



});
