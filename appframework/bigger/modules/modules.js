define('modules/modules', [
  'base/base',
  'core/core',
  'modules/dummy/dummy'
], function () {

  //modules to register
  var register = function (Core) {
    var dummy = require('modules/dummy/dummy');
    console.log("isDUmmy?"+dummy);
    Core.register('Dummy', dummy);
  };
  return {
    register: register
  };
});
