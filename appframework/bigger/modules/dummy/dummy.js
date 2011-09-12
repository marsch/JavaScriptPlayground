define('modules/dummy/dummy', [
  'base/base',
  'core/core',
  'core/sandbox',
  'modules/modules'
], function () {
  var module = function(sandbox) {
    return {
      init: function() {
        console.log("init dummy module");
        sandbox.publish("hello.i.am.a.dummy.module");
      },
      destroy: function() {
        console.log("destry dummy module");
        console.log(sandbox.publish);
        sandbox.publish("hello.i.am.a.dummy.module");
      }
    };
  };
  console.log("load module dummy");
  return module;
});
