var Dredd = require('dredd');
var path = require('path');

module.exports = {
  validator: function(serverUrl) {
    if (!serverUrl) {
      serverUrl = 'http://localhost:8080';
    }
    return new Dredd({
      blueprintPath: path.join(__dirname, 'todos.apib'),
      server: serverUrl,
      options: {
        hookfiles: path.join(__dirname, 'hooks.js')
      }
    });
  }
};
