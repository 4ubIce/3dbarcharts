"use strict";

var slice = require('./es6.array.slice');

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};