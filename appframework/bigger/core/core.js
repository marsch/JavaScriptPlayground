define('core/core', [
  'base/base',
  'core/sandbox',
  'core/extensionpoint'
], function (base) {
  console.log("core loaded");

  var Sandbox = require('core/sandbox');
  var Interface = base.fella.oop.interface;
  var IModule = new Interface('IModule', ['init', 'destroy']);
  var ExtensionPoint = require('core/extensionpoint');
  var base = require('base/base');

  // Application Core
  // The application core manages modules, that's it.
  // The application core tells a module when it should 
  // initialize and when it should shutdown. The application
  // manages communication between modules. The application
  // core handles errors
  //
  // Application Core Jobs
  // =====================
  // Manage modules lifecylce
  //  - tell modules when to start and stop doing their jbo
  // Enable inter-module communication
  //  - allow loose coupling between modules that are related to one another
  // General error handling
  //  - Detect, trap, and report errors in the system
  // Be extensible
  //  - the first three jobs are not enough
  var Core = function() {
    var moduleData = {},
        debug = false;

    return {
      register: function (moduleId, creator) {
        console.log("registering..."+moduleId);
        console.log("creator:"+creator);
        moduleData[moduleId] = {
          creator: creator,
          instance: null
        };
      },
      createInstance: function (moduleId, callback) {
        var instance = moduleData[moduleId].creator(new Sandbox(this)),
            name,
            method;

        var chained = [];
        ExtensionPoint.point({id:'core/modules:create'}).each(function (ext) {
          chained.push([ext, 'action',instance]); 
          //ext.action.apply(this, [instance, callback]);
          //_.call(ext.action, instance);
        });
        base.fella.async.chain(chained, function () {
          callback(null, instance);
        });
      },
      start: function (moduleId) {
        this.createInstance(moduleId, function (err, data) {
          moduleData[moduleId].instance = data;
          Interface.ensureImplements(moduleData[moduleId].instance, IModule);
          moduleData[moduleId].instance.init();
        });
      },
      stop: function (moduleId) {
        var data = moduleData[moduleId];
        if(data.instance) {
          data.instance.destroy();
          data.instance = null;
        }
      },
      startAll: function () {
        for (var moduleId in moduleData) {
          if(moduleData.hasOwnProperty(moduleId)) {
            this.start(moduleId);
          }
        }
      },
      stopAll: function () {
        for (var moduleId in moduleData) {
          if(moduleData.hasOwnProperty(moduleId)) {
            this.stop(moduleId);
          }
        }
      },
      loadExtensions: function (list, callback) {
        return ExtensionPoint.load(list, callback);
      }
    }
  }();
  return Core;
});
