var midiNumbers = { "a0": 22, "b0": 23, "c1": 24, "d1": 26,
                    "e1": 28, "f1": 29, "g1": 31, "a1": 33,
                    "b1": 35, "c2": 36, "d2": 38, "e2": 40,
                    "f2": 41, "g2": 43, "a2": 45, "b2": 47,
                    "c3": 48, "d3": 50, "e3": 52, "f3": 53,
                    "g3": 55, "a3": 57, "b3": 59, "c4": 60,
                    "d4": 62, "e4": 64, "f4": 65, "g4": 67,
                    "a4": 69, "b4": 71, "c5": 72, "d5": 74,
                    "e5": 76, "f5": 77, "g5": 79, "a5": 81,
                    "b5": 83, "c6": 84, "d6": 86, "e6": 88,
                    "f6": 89, "g6": 91, "a6": 93, "b6": 95,
                    "c7": 96, "d7": 98, "e7": 100, "f7": 101,
                    "g7": 103, "a7": 105, "b7": 107, "c8": 108
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
    } else if (exp.tag === 'rest') {
      return exp.dur;
    } else if (exp.tag === 'repeat') {
      return exp.count * duration(exp.section);
    } else {
      throw "endTime error. Unknown tag: " + exp.tag;
    }
  };
  return duration(expr) + time;
};

function traverse(res, time, expr) {
  if(expr.tag === 'note') {
    res.push({ tag: expr.tag, 
               pitch: midiNumbers[expr.pitch], 
               dur: expr.dur, 
               start: time });
  } else if(expr.tag === 'seq') {
    res = traverse(res, time, expr.left);
    res = traverse(res, endTime(time, expr.left), expr.right);
  } else if(expr.tag === 'par'){
    res = traverse(res, time, expr.left);
    res = traverse(res, time, expr.right);
  } else if(expr.tag === 'rest') {
    res.push({ tag: expr.tag,
               dur: expr.dur,
               start: time });
  } else if(expr.tag === 'repeat') {
    var t = time;
    for(var i=0;i<expr.count;i+=1) {
      res = traverse(res, t, expr.section);
      t += endTime(0, expr.section);
    }
  } else {
    throw "error. Unknown tag: " + expr.tag;
  }
  return res;
}

var compile = function (musexpr) {
  return traverse([], 0, musexpr);
};
