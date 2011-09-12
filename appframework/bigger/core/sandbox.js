define('core/sandbox', [
  'base/base',
  'core/extensionpoint'
], function (base) {
  var ExtensionPoint = require('core/extensionpoint');
  // Sandbox(es)
  // The sandbox ensures a consistent interface, modules can
  // rely on the methods to always be there. Modules only know
  // the sandbox, the rest of the architecture doesn't exist
  // to them. The sandbox also acts like a security guard. Knows
  // what the modules are allowed to access and do on the framework
  //
  // Sandbox Jobs
  // ============
  // Consistency
  //  - Interface must be dependable
  // Security
  //  - Determine which parts of the framework a module can access
  // Communication
  //  - Translate module requests into core actions
  //
  var Sandbox = function (core) {
    var box = {
      publish: base.fella.events.publish,
      subscribe: base.fella.events.subscribe,
      unsubscribe: base.fella.events.unsubscribe
    };

    ExtensionPoint.point({id:'core/sandbox:create'}).each(function(ext) {
      ext.action.apply(this, [box, core]);
    });


    return box;
  };

  return Sandbox;
});
