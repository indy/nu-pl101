function Con(id) {
  this.console = CodeMirror(document.getElementById("myconsole"), {
    mode: "diff",
    lineNumbers: true
  });
  this.content = "";

  this.log = function(msg) {
    this.content = this.content + "\n" + msg;
    this.console.setValue(this.content);
    var line = this.console.lineCount();
    this.console.setCursor({line: line, ch: 0})
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

  var con = new Con("myconsole");
  con.log("This is where output goes.");

  var parser = Scheem.parser;
  var scheemParser = parser.buildParser();
  var evalScheem = Scheem.interpreter.evalScheem;

  $('#submitbutton').click(function() {
    var user_text = editor.getValue();
//    $('#console').html(''); // clear console
    con.log('\n' + 'Your input was: "' + user_text + '"');
    try {
      var parsed = scheemParser(user_text);
      con.log('Parsed: ' + JSON.stringify(parsed));
      try {
        var result = evalScheem(parsed, {});
        con.log('Result: ' + JSON.stringify(result));
      }
      catch(e) {
        con.log('Eval Error: ' + e);
      }
    }
    catch(e) {
      con.log('Parse Error: ' + e);
    }
  });

});
