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
    [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    w:validchar+ { return w.join(""); }
