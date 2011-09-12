define('base/fella/files', [
], function () {


  var files = function () {
    var that = {};
    var IMPL_ERROR = "just a stub class, you need to register a concrete platform specific implementation";
    that.getInfo = function (path, callback) {
      throw IMPL_ERROR;
    };
    
    that.exists = function (path) {
      throw IMPL_ERROR;
    };

    that.isDirectory = function (path) {
      throw IMPL_ERROR;
    };

    that.createDirectory = function (path, permission) {
      throw IMPL_ERROR;
    };

    that.readFile = function (path, callback) {
      throw IMPL_ERROR;
    };
    that.writeFile = function (path, content, callback) {
      throw IMPL_ERROR;
    };
    
    that.getUserHome = function () {
      throw IMPL_ERROR;
    };

    return that;
  };

  return files();
});
