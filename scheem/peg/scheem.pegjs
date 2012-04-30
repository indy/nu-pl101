start =
    expr

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
    ";;" [^\n]* "\n" blank*

validchar = 
    [a-zA-Z0-9_?!+\-=@#$%^&*/.]

number =
    [0-9]

atom =
    n:number+ { return parseInt(n.join(""), 10); }
  / w:validchar+ { return w.join(""); }

