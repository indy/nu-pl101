
/*!
 * pegs
 * Copyright(c) 2012 indy <email@indy.io>
 * MIT Licensed
 */

exports.version = '0.0.1';

var PEG = require('pegjs');
var fs = require('fs'); // for loading files

exports.buildParser = function(pegFile) {
  var data = fs.readFileSync(pegFile, 'utf-8');
  return PEG.buildParser(data).parse;
}

exports.buildParser2 = function(pegFile) {
  var data = fs.readFileSync(pegFile, 'utf-8');
  var parseFn = PEG.buildParser(data).parse;
  return musAst(parseFn);
}


function musAst(parseFn) {
  return function(form) {
    var raw = parseFn(form);
    return tidy(raw);
  }
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
