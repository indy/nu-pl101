// Add a "comma" infix operator that is lower precedence than addition to the example. Your generated parser should return parse trees.


start =
    comma

comma =
    left:additive "," right:comma
    { return {tag: ",", left:left, right:right}; }
   / additive

additive =
    left:multiplicative "+" right:additive
        { return {tag: "+", left:left, right:right}; }
  / multiplicative

multiplicative =
    left:primary "*" right:multiplicative
        { return {tag: "*", left:left, right:right}; }
  / primary

primary =
    integer
  / "(" additive:comma ")"
      { return comma; }

integer =
    digits:[0-9]+
        { return parseInt(digits.join(""), 10); }
