var rpc = require('../src/jsonrpc');

var server = new rpc.Server();

server.on('error', function(err) {
  console.log(err)
})

server.enableAuth("myuser", "secret123");

/* Expose two simple functions */
server.expose('add', function (args, opts, callback) {
    callback(null, args[0]+args[1]);
  }
);

server.expose('multiply', function (args, opts, callback) {
    callback(null, args[0]*args[1]);
  }
);

/* We can expose entire modules easily */
server.exposeModule('math', {
  power: function(args, opts, callback) {
    callback(null, Math.pow(args[0], args[1]));
  },
  sqrt: function(args, opts, callback) {
    callback(null, Math.sqrt(args[0]));
  }
});

/* By using a callback, we can delay our response indefinitely, leaving the
 request hanging until the callback emits success. */
server.exposeModule('delayed', {
    echo: function(args, opts, callback) {
      var data = args[0];
      var delay = args[1];
      setTimeout(function() {
        callback(null, data);
      }, delay);
    },

    add: function(args, opts, callback) {
      var first = args[0];
      var second = args[1];
      var delay = args[2];
      setTimeout(function() {
        callback(null, first + second);
      }, delay);
    }
  }
);

/* HTTP server on port 8088 */
server.listen(8088, 'localhost');

/* Raw socket server on port 8089 */
server.listenRaw(8089, 'localhost');
