define('base/fella/process', [
], function () {

  var process = function() {
    var that = {};
    var IMPL_ERROR = "just a stub class, you need to register a concrete platform specific implementation";
    /*
    * TODO: should return a generic process Object within the callback
    * so the process is stopable later
    */
    that.execute = function (executable, args, callback) {
      throw IMPL_ERROR;
    };
    return that;
  };
  
  return process();
});
