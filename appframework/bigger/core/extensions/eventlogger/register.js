define('core/extensions/eventlogger/register', [
  'core/extensionpoint'
], function (extension) {
  extension.point({id:'core/sandbox:create'}).extend({
    action: function (core) {
      console.log("applying eventlogger");
      require(['core/extensions/eventlogger/main'], function (eventlogger) {
        eventlogger.attach(core);
      });
    }
  });

});
