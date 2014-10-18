var Dredd = require('dredd');
var path = require('path');

module.exports = {
  validate: function(serverUrl, cb) {
    if (typeof serverUrl == 'function') {
      cb = serverUrl;
      serverUrl = 'http://localhost:8080';
    }
    new Dredd({
      blueprintPath: path.join(__dirname, 'todos.apib'),
      server: serverUrl,
      options: {
        hookfiles: path.join(__dirname, 'hooks.js')
      }
    }).run(cb);
  }
};
