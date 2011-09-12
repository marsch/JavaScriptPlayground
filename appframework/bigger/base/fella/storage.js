define('base/fella/storage', [

], function () {
  /*
  * couchdb based storage class
  */

  var storage = function () {
    var that = {};
    that.urlPrefix = '';

    that.init = function (options) {
      options = options || {};
      that.urlPrefix = options.urlPrefix || 'http://127.0.0.1:5984';

    };
    that.login = function (options) {
      console.log("try to login to couch");
      console.log(that.urlPrefix);
      
      options = options || {};

      $.ajax({
        type: 'POST',
        url: that.urlPrefix + '_session',
        //dataType: 'json',
        data: { name: options.name, password: options.password },
        /*beforeSend: function (xhr) {
          xhr.setRequestHeader('Accept', 'application/json');
        },*/
        error: function (xhr, textStatus, errorThrown) {
          console.log(errorThrown.toString());
          console.log(textStatus);
          console.log("errrororororororororor");
        },
        complete: function(req) {
          console.log("STATUS:"+req.responseText);
          var resp = $.parseJSON(req.responseText);
          console.log("hallo!!!");
          alert(req.responseText);
          if(req.status === 200) {
            if(options.success) {
              options.success(resp);
            } else if (options.error) {
              options.error(req.status, resp.error, resp.reason);
            } else {
              console.log('An error occured logging in: ' + resp.reason);
            }
          }
        }
      });
    };

    return that;
  };

  return storage();
});
