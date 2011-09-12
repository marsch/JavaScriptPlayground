define('core/extensions/eventlogger/main', [

], function () {
  return {
    attach: function (box, core) {
      var pubmethod = box.publish;
      if( typeof pubmethod === 'function') {
        box.publish = function() {
          console.log(arguments);
          return function(topic) {
            return method.apply(this, arguments);
          }
        }
      }
      console.log("attaching eventlogger");
      console.log(box);
    }
  };
});
