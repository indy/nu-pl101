{
function applyDuration(notes, d) {
  return notes.map(function(n) {
    if(n.dur === undefined) {
      n.dur = d;
    }
    return n;
  });
}
}

start = 
    n:seq
    { return n; }

seq =
    "{" h:heldNote+ "}" d:duration { return applyDuration(h, d); }
  / "{" h:heldNote+ "}" { return h; }
  / h:heldNote { return h; }
 
heldNote =
    n:note d:duration blank* { n["dur"] = d; return n;}
  / n:note blank* { return n; }

duration =
    ":" d:number { return d; }

note =
    a:[a-g] d:[0-8] { return {tag: "note", pitch:a + d} }

number = 
    d:[0-9]+ { return parseInt(d.join("")); }

whitespace =
    blank* comment*

blank =
    " "
  / "\n"
  / "\t"

comment = 
    ";;" [^\n]* "\n" blank*
