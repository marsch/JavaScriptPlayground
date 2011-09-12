define('base/fella/oop', [
  
], function () {
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

  return {
    interface: Interface
  }
});

