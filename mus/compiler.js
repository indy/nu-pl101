var reverse = function(expr) {
    if(expr.tag === 'note') {
        return expr;
    } else {
        return {tag: 'seq',
                left: reverse(expr.right),
                right: reverse(expr.left)
               };
    }
};

var endTime = function (time, expr) {
  var duration = function(exp) {
    if(exp.tag === 'note') {
      return exp.dur;
    } else if(exp.tag === 'seq') {
      return duration(exp.left) + duration(exp.right);
    } else if(exp.tag === 'par') {
      var lDur = duration(exp.left);
      var rDur = duration(exp.right);
      return lDur > rDur ? lDur : rDur;
    } else {
      throw "endTime error";
    }
  };
  return duration(expr) + time;
};

function traverse(res, time, expr) {
  if(expr.tag === 'note') {
    res.push({ tag: expr.tag, 
               pitch: expr.pitch, 
               dur: expr.dur, 
               start: time});
  } else if(expr.tag === 'seq') {
    res = traverse(res, time, expr.left);
    res = traverse(res, endTime(time, expr.left), expr.right);
  } else if(expr.tag === 'par'){
    res = traverse(res, time, expr.left);
    res = traverse(res, time, expr.right);
  } else {
    throw "error";
  }
  return res;
}

var compile = function (musexpr) {
  return traverse([], 0, musexpr);
};

/*
var playMUS = function(musexpr) {
  playNote(compile(musexpr));
};
*/

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
