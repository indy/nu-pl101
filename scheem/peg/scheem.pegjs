start =
    expr+

expr =
    ignore a:atom ignore { return a; }
  / ignore "(" e:expr* ")" ignore { return e; }
  / "'" e:expr { return ["quote", e]; }

ignore =
    blank* comment*

blank =
    " "
  / "\n"
  / "\t"

comment = 
    ";" [^\n]* "\n" blank*

atom =
    string
  / number
  / word


string =
    "\"" s:[^"\""]* "\"" { return ["_string", s.join("")]; }

word =
    w:[><a-zA-Z0-9_?!+\-=@#$%^&*/.]+ { return w.join(""); }

number =
    n:[0-9]+ { return parseInt(n.join(""), 10); }
  / "-" n:number { return -n; }
