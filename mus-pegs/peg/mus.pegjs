{

function parentTag(tag, e) {
  return { tag: tag, children: e};
}
function applyDuration(notes, d) {
  return notes.map(function(n) {
    if(n.dur === undefined && (n.tag === 'note' || n.tag === 'rest')) {
      n.dur = d;
    }
    return n;
  });
}
}

start = 
    n:exp
    { return n; }

exp =
    h:heldNote { return h; }
  / l:list { return parentTag('seq', l); }
  / "h" l:list { return parentTag('par', l); }

list =
    "{" h:exp+ "}" d:duration { return applyDuration(h, d); }
  / "{" h:exp+ "}" { return h; }
 
heldNote =
    n:note d:duration blank* { n["dur"] = d; return n;}
  / n:note blank* { return n; }

note =
    a:[a-g] d:[0-8] { return {tag: "note", pitch:a + d}; }
  / "rest" { return {tag: "rest"}; }

duration =
    ":" d:number { return d; }

number = 
    d:[0-9]+ { return parseInt(d.join("")); }

blank =
    " "
  / "\n"
  / "\t"

