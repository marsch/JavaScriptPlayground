/*
* a small application framework, inspired by nicholas c. zakas,
* by his talk at bayjax - september 2009
*/

// Base Library
// The base library provides basic functionality.
// Ideally, only the application core has any idea
// what base library is being used.
//
// Base Library Jobs
// =================
// Environment Normalization
//  - Abstract away differences in OS, Environment with common interface
// General-purpose utitlites
//  - Parser/serializers for XML, JSON, etc
//  - Object manipulation
//  - DOM manipulation
//  - Network
//  - Storage
// Provide low-level extensibility


//constructor
var Interface = function(name, methods) {
  if(arguments.length != 2) {
    throw new Error("Interface constructor called with " + arguments.length + 
                    "arguments, but expected exactly 2.");
  }

  this.name = name;
  this.methods = [];
  
  var len = methods.length,
    i=0;

  for(;i <len; i++) {
    if(typeof methods[i] !== 'string') {
      throw new Error("Interface constructor expects method names to be " +
                      "passed in as a string.");
    }
    this.methods.push(methods[i]);
  }
};

//Static class method.

Interface.ensureImplements = function (object) {
  if(arguments.length < 2) {
    throw new Error("Function Interface.ensureImplements called with " +
                    arguments.length + " arguments, but expected at least 2.");
  }

  var len = arguments.length,
    i = 1;

  for(;i<len;i++) {
    var interface = arguments[i];
    if(interface.constructor !== Interface) {
      throw new Error("Function Interface.ensureImplements expects arguments " +
                      "two and above to be instances of Interface.");
    }

    var methodsLen = interface.methods.length,
      j = 0;

    for(;j<methodsLen;j++) {
      var method = interface.methods[j];
      if(!object[method] || typeof object[method] !== 'function') {
        throw new Error("Function Interface.ensureImplements: object " +
                        "does not implement the " + interface.name +
                        " interface. Method " + method + " was not found.");
      }
    }
  }
};

var IModule = new Interface('IModule', ['init', 'destroy']);
var ISandbox = new Interface('ISandbox', ['notifiy', 'listen']);



// Sandbox(es)
// The sandbox ensures a consistent interface, modules can
// rely on the methods to always be there. Modules only know
// the sandbox, the rest of the architecture doesn't exist
// to them. The sandbox also acts like a security guard. Knows
// what the modules are allowed to access and do on the framework
//
// Sandbox Jobs
// ============
// Consistency
//  - Interface must be dependable
// Security
//  - Determine which parts of the framework a module can access
// Communication
//  - Translate module requests into core actions
//

var Sandbox = function (core) {
  return {
    notify: function () {},
    listen: function () {}
  }
};



// Extensions
//  remember: extensions like eclipse (pub/sub)
//  remember: piping pattern
//  remember: interceptor pattern


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
      moduleData[moduleId] = {
        creator: creator,
        instance: null
      };
    },
    createInstance: function (moduleId) {
      var instance = moduleData[moduleId].creator(new Sandbox(this)),
          name,
          method;

      if(!debug) {
        for (name in instance) {
          method = instance[name];
          if( typeof method === 'function') {
            instance[name] = function (name, method) {
              return function() {
                try {
                  return method.apply(this, arguments);
                } catch (e) {
                  console.log(e);
                }
              }
            }(name, method);
          }
        }
      }
      return instance;
    },
    start: function (moduleId) {
      moduleData[moduleId].instance = this.createInstance(moduleId);
      Interface.ensureImplements(moduleData[moduleId].instance, IModule);
      moduleData[moduleId].instance.init();
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
    }
  }
}();





// Modules
//
// Each module has its own sandbox, an interface with which 
// the module can interact to ensure loose coupling. Modules
// have limited knowledge, each module knows about their sandbox
// and that's it
//
// Module Rules
// ============
// Hands to yourself
//  - Only call your own methods or those on the sandbox
//  - Don't access things out of scope
//  - Don't access non-native global objects
// Ask, don't take
//  - anything else you need, ask the sandbox
// Don't leave your toys around
//  - don't create global objects
// Don't talk to strangers
//  - Don't directly reference other modules
Core.register('ModuleA', function (sandbox) {
  return {
    init: function () {
      console.log("init ModuleA");
    },
    destroy: function () {
      console.log("destroy ModuleA");
    }
  };
});

Core.register('ModuleB', function (sandbox) {

  return {
    init: function() {
      console.log("init ModuleB");
    },
    shutdown: function() {
      console.log("shutdown ModuleB");
    },
    destroy: function() {
      this.shutdown();
    }
  }
});

// start the application
Core.startAll();
Core.stopAll();
