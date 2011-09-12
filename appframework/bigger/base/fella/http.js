define('base/fella/http', [
], function () {



  var http = function () {
    var that = {};
    var IMPL_ERROR = "just a stub class, you need to register a concrete platform specific implementation";
    that.request = function (options, callback) {
      throw IMPL_ERROR;
    };

    return that;
  };

  return http();

});
