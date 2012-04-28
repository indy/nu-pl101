{

function parentTag(tag, e) {
  return { tag: tag, children: e};
};

function applyDuration(notes, d) {
  return notes.map(function(n) {
    if(n.dur === undefined && (n.tag === 'note' || n.tag === 'rest')) {
      n.dur = d;
    }
    return n;
  });
};

function tidy(ast) {

  if(ast.section) {
    ast.section = tidy(ast.section);
  }

  if(ast.children === undefined) {
    return ast;
  }

  if(ast.children.length === 1) {
    return tidy(ast.children[0]);
  }

  ast.left = tidy(ast.children[0]);
  ast.right = tidy({tag: ast.tag, children: ast.children.slice(1)});

  delete ast.children;

  return ast;
};

}

start = 
    n:repeatingExpression
    { return tidy(n); }

repeatingExpression =
    "repeat" blank* n:number blank* e:exp blank* { return {tag: 'repeat',
                                        count: n,
                                        section: e}; }
  / exp

exp =
    h:heldNote { return h; }
  / l:list { return parentTag('seq', l); }
  / "harmony" blank* l:list { return parentTag('par', l); }

list =
    "{" h:exp+ "}" d:duration { return applyDuration(h, d); }
  / "{" h:repeatingExpression+ "}" { return h; }
 
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

