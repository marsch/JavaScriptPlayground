
var APP = APP || {};

APP.namespace = function (ns_string) {
  var parts = ns_string.split('.'),
    parent = APP,
    i;

  if (parts[0] === 'APP') {
    parts = parts.slice(1);
  }

  for (i=0; i < parts.length; i += 1) {
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }
  return parent;
}


//examples

var myModule = APP.namespace('APP.fellajs.super.duper');

APP.fellajs.super.duper = function () {
  console.log("super duper namespace");
}

var myModule2 = APP.namespace('APP.fellajs.rate.mal');

APP.fellajs.rate.mal = function () {
  console.log("rate mal wie ich heiße");
}


APP.fellajs.rate.mal();
APP.fellajs.super.duper();
