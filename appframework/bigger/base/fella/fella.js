define('base/fella/fella', [

  'base/fella/events',
  'base/fella/async',
  'base/fella/http',
  'base/fella/process',
  'base/fella/storage',
  'base/fella/files',

  'base/fella/oop'
], function () {

  var fellajs = {

    /*
    * Registers a module into the namespace of fellajs
    */
    register: function (ns_string, extension) {
      var parts = ns_string.split('.'),
        parent = fellajs,
        len,
        i = 0;
      
      if (parts[0] === 'fellajs') {
        parts = parts.slice(1);
      }
      
      len = parts.length;

      for (; i < len; i += 1) {
        console.log(parts[i]);

        if (typeof parent[parts[i]] === "undefined") {
          parent[parts[i]] = {};
        }
        //add extension at the end
        if ((i+1) == len) {
          parent[parts[i]] = extension;
        }
        parent = parent[parts[i]];
      }

      return parent;
    }
  };

  return fellajs;
});
