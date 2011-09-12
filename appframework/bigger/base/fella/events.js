define('base/fella/events', [], function () {
   var events = function () {
    var that = {};
    var slice = [].slice;
    var subscriptions = {};


    that.publish = function (topic) {
      console.log("PUBLISH:   " + topic);
      var args = slice.call(arguments, 1),
        subscription,
        len,
        i=0,
        ret;

      if(!subscriptions[ topic ]) {
        return true;
      }
      len = subscriptions[topic].length;
      console.log("found subscriptions: "+len);
      for(;i<len;i++) {
        subscription = subscriptions[topic][i];
        console.log("handle subscription");
        ret = subscription.callback.apply( subscription.context, args );

        // callback should always return true,
        // interceptor pattern here >>
        if (ret === false) {
          break;
        }
      }
      return ret !== false;
    };

    that.subscribe = function (topic, context, callback, priority) {
      console.log("subscribe:"+topic);
      if ( arguments.length === 3 && typeof callback === "number" ) {
        priority = callback;
        callback = context;
        context = null;
      }
      if (arguments.length === 2) {
        callback = context;
        context = null;
      }
      priority = priority || 10;

      var topicIndex = 0,
        topics = topic.split( /\s/ ),
        topicLength = topics.length,
        added;

      console.log("to topics");
      console.log(topics);
      for( ; topicIndex < topicLength; topicIndex++) {
        topic = topics[ topicIndex ];
        added = false;
        if( !subscriptions[topic]) {
          subscriptions[topic] = [];
          console.log("add topic:"+topic);
        }
        console.log("subs len:"+subscriptions[topic].length);
        var i = subscriptions[topic].length - 1,
          subcriptionInfo = {
            callback: callback,
            context: context,
            priority: priority
          };

        console.log("topic:"+topic);
        console.log("at:"+i);
        for( ;i>=0; i--) {
          if(subscriptions[topic][i].priority <= priority) {
            subscriptions[topic].splice(i+1,0,subcriptionInfo);
            added = true;
            break;
          }
        }

        if(!added) {
          subscriptions[topic].unshift(subcriptionInfo);
        }
      }
      return callback;
    };

    that.unsubscribe = function (topic, callback) {
      if(!subscriptions[topic]) {
        return;
      }

      var len = subscriptions[topic].length,
        i = 0;

      for(;i<len;i++) {
        if(subscriptions[topic][i].callback === callback) {
          subscriptions[topic].splice(i,1);
          break;
        }
      }
    };

    return that;
  };

  return events();

});
