define('base/fella/async', [], function () {
  
  
  var async = function () {
    var that = {};
    that.first = {};
    that.last = {};

    that.asyncMap = function (list, fn, cb_) {
      var n = list.length,
        results = [],
        errState = null
      function cb (er, data) {
        if (errState) {
          return
        }
        if (er) {
          return cb(errState = er)
        }
        results.push(data)
        if (-- n === 0) {
          return cb_(null, results)
        }
      }
    
      if (list.length === 0) {
        return cb_(null, []);
      }
      list.forEach(function (l) {
        fn(l, cb)
      });
    };

    that.bindActor = function () {
      var args = Array.prototype.slice.call(arguments),
        obj = null,
        fn;

      if (typeof args[0] === "object") {
        obj = args.shift();
        fn = args.shift();
        if(typeof fn === "string") {
          fn = obj[fn];
        }
      } else {
          fn = args.shift();
      }
      return function (cb) {
        fn.apply(obj, args.concat(cb));
      };
    };

    that.chain = function (things, res, cb) {
      if(!cb) {
        cb = res;
        res = [];
      }
      (function LOOP (i, len) {
        if(i >= len) {
          return cb(null, res);
        }
        if(things[i].constructor.toString().indexOf("Array") !== -1) {
          things[i] = that.bindActor.apply(null, things[i].map(function(i) {
            return (i === that.first) ? res[0] : (i === that.last) ? res[res.length-1]: i
          }));
        }
        
        if(!things[i]) {
          return LOOP(i + 1, len);
        }
        
        things[i](function (er, data) {
          res.push( er || data);
          if(er) {
            return cb( er, res);
          }
          LOOP(i+1, len);
        });
      })(0, things.length);
    };
    return that;
  };
  return async();

});
