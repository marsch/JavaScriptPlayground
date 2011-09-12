require([
  'base/base',
  'core/core',
  'modules/modules'
], function (base, core, modules) {

  modules.register(core);

  core.loadExtensions([
    'errorHandler',
    'eventlogger'
  ],  function () {
    core.startAll();

    console.log("require is finished");
    console.log(base);
    console.log(base.fella.events);
    
    setTimeout(function () {
      core.stopAll();
    }, 1000);
  });
 });
