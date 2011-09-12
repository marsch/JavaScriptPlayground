define('core/extensionpoint', [
  'base/base'
], function () {
  //inspired by cisco laguna's inspiration of the eclipse platform
  var registry = {};
  var ExtensionPoint = function (options) {
    var extensions = [];

    this.id = options.id;
    this.description = options.description;

    this.extend = function (extension) {
      console.log("extend:");
      console.log(extension);
      extensions.push(extension);
      //should sort the points or some thing
    };

    this.all = function() {
      return extensions;
    };

    this.each = function (cb) {
      return _.each(extensions, cb);
    };

    this.map = function (cb) {
      return _.map(extensions, cb);
    }; 
  };

  ExtensionPoint.point = function (options) {
    var id = options.id;
    console.log("POINT:"+id);
    if(typeof registry[id] !== "undefined") {
      return registry[id];
    } else {
      return (registry[id] = new ExtensionPoint(options));
    }
  };

  ExtensionPoint.load = function (list, callback) {
    list = list || [];
    list = _(list).map(function(i) {
      return "core/extensions/" + i + "/register";
    });
    
    
    require(list, callback);
  };

  return ExtensionPoint;

});
