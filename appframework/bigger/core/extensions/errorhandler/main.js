define('core/extensions/errorhandler/main', [

], function () {
  return {
    attach: function (instance) {
      console.log("attaching errorhandler");
      console.log(instance);
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
  };
});
