var Dredd = require('dredd');
var path = require('path');

module.exports = function(startServer, cb) {
  startServer(function(serverUrl, stopServer) {
    var dredd = new Dredd({
      blueprintPath: path.join(__dirname, 'todos.apib'),
      server: serverUrl,
      options: {
        hookfiles: path.join(__dirname, 'hooks.js')
      }
    });
    dredd.run(function(error, stats){
      stopServer(cb);
    });
  });
}
