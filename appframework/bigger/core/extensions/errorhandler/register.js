define('core/extensions/errorhandler/register', [
  'core/extensionpoint'
], function (extension) {
  extension.point({id: 'core/modules:create'}).extend({
    action: function (data, callback) {
      console.log("appplying tha point");
      require(['core/extensions/errorhandler/main'], function (errorhandler) {
        errorhandler.attach(data);
        callback(null, true);
      });
    }
  });
});
