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

  con.log("This is where output goes.");

  var parser = Scheem.parser;
  var scheemParser = parser.buildParser();
  var evalScheem = Scheem.interpreter.evalScheem;
  var env = {};

  $('#run').click(function() {
    var user_text = editor.getValue();
    con.log('\n' + user_text);
    try {
      var parsed = scheemParser(user_text);
      try {
        var result = evalScheem(parsed, env);
        con.log('-> ' + JSON.stringify(result));
        envCon.clear();
        envCon.log(JSON.stringify(env));
      }
      catch(e) {
        con.log('Eval Error: ' + e);
      }
    }
    catch(e) {
      con.log('Parse Error: ' + e);
    }
  });

  $('#clear-output').click(function() {
    con.clear();
  });
  $('#clear-environment').click(function() {
    env = {};
    envCon.clear();
  });

});
