define('base/fella/platforms/xul/process', [], function () {

  var process = function() {
    var that = {};

    var CC = {},
        CI = {};
    
    try {
      CC = Components.classes;
      CI = Components.interfaces;
    } catch (e) {
      return that;
    }

    that.execute = function (executable, args, callback) {
      var file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(executable);

      var proc = CC['@mozilla.org/process/util;1'].createInstance(CI.nsIProcess);
      proc.init(file);
      
      proc.runwAsync(args, args.length, {

        // when the process exits
        observe: function (proc, aTopic, aData) {
          console.log('OBSERVE?? - NOTIFICATION');
          console.log(aTopic);

          console.log("isrunning:"+proc.isRunning);
          console.log("exitValue:"+proc.exitValue);
        }
      });
      callback(null, {});


    };

    return that;
  };
  return process;
});
