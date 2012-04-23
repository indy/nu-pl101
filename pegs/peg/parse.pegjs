
start =
    quotedExpression

quotedExpression =
    "'" e:expression
    { return ["quote", e];}
  / expression

expression =
    atom
  / space* "(" s: spacedExpression+ ")" space*
    {return s;}

spacedExpression = 
    space* e: quotedExpression space*
    {return e;}

space =
    " "
  / "\n"
  / "\t"

validchar = 
    [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
