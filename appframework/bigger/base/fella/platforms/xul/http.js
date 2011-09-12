define('base/fella/platforms/xul/http', [], function () {
  
  var http = function () {
    var that = {};

    
    //if it accidently loaded in the wrong environment
    var CC = {},
        CI = {};
    
    try {
      CC = Components.classes;
      CI = Components.interfaces;
    } catch (e) {
      return that;
    }
    //failsafe end
      

    /**
    * options:
    *   host
    *   port
    *   (socketPath)
    *   method
    *   path
    *   headers
    *   agent
    *
    *   SHOULD BE REMOVED or REPLACED with a Jquery.ajax compatible implementation
    *   I THINK for normal requests $.ajax is okay - execpt fileuploads etc. or streams
    *
    */ 
    that.request = function (options, callback) {
      var ioservice,
        channel,
        uri,
        streamListener;


      ioservice = CC['@mozilla.org/network/io-service;1'].getService( CI.nsIIOService);
      //should use nsIUploadChannel for datastream uploads
      
      uri = ioservice.newURI(options.url, null, null);
      channel = ioservice.newChannelFromURI(uri);

      streamListener = {
        onStartRequest: function (aRequest, aContext) {
          console.log("onStartRequest");
        },
        onDataAvailable: function (aRequest, aContext, aInputStream, aOffset, aCount) {
          var sis = CC['@mozilla.org/scriptableinputstream;1'].createInstance(
            CI.nsIScriptableInputStream
          );
          sis.init(aInputStream);

          var chunk = sis.read(aCount);


          console.log("onDataAvailable");
          console.log(chunk);
        },
        onStopRequest: function (aRequest, aContext, aStatusCode) {
          console.log("onStopRequest");
          console.log(aStatusCode);
        },
        onChannelRedirect: function () {
          console.log("onChannelRedirect");
        }
      };

      channel.asyncOpen( streamListener, this);

      console.log('requesting:' + options.url);
      console.log(uri);
    };


    return that;
  };

  return http;
});
