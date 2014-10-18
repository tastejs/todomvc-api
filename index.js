var Dredd = require('dredd');
var path = require('path');

module.exports = {
  validate: function(serverUrl, cb) {
    if (typeof serverUrl === 'function') {
      cb = serverUrl;
      serverUrl = 'http://localhost:8080';
    }
    var dredd = new Dredd({
      blueprintPath: path.join(__dirname, 'todos.apib'),
      server: serverUrl,
      options: {
        hookfiles: path.join(__dirname, 'hooks.js')
      }
    });
    dredd.run(function(err, stats) {
      if (err || stats.failures || stats.errors) {
        err = err || 'api validation failed';
      }
      cb(err, stats);
    });
  }
};
