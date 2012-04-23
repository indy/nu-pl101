start =
    expression

expression =
    atom
  / "(" s: spacedExpression+ ")"
    {return s;}

spacedExpression = 
    e: expression space?
    {return e;}

space =
    " "

validchar = 
    [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
