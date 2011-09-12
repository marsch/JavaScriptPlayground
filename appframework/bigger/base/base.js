define('base/base', [
  'base/fella/fella',

  'base/fella/oop',
  'base/fella/events',
  'base/fella/async',
  'base/fella/storage',

  //platofrm specific
  'base/fella/platforms/xul/http',
  'base/fella/platforms/xul/process',
  'base/fella/platforms/xul/files',

  'base/underscore/underscore'

], function (fellajs) {
  console.log("base libraries loaded");

  //general
  fellajs.register('fellajs.oop', require('base/fella/oop'));
  fellajs.register('fellajs.events', require('base/fella/events'));
  fellajs.register('fellajs.async', require('base/fella/async'));
  fellajs.register('fellajs.storage', require('base/fella/storage'));


  //platform specific
  fellajs.register('fellajs.http', require('base/fella/platforms/xul/http'));
  fellajs.register('fellajs.process', require('base/fella/platforms/xul/process'));
  fellajs.register('fellajs.files', require('base/fella/platforms/xul/files'));

  var base = {
    fella: fellajs
  }

  return base;
});
