var request = require('request');
// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');
var url = require('url');

function uri(t, path) {
  return url.format({
    protocol: 'http',
    hostname: t.host,
    port: t.port,
    pathname: path
  });
}

hooks.before('Todos > Todo > Get a Todo', function(t, done) {
  request.post({
    uri: uri(t, 'todos'),
    json: {'title': 'do that'}
  }, function(err, res, todo) {
    t.fullPath = '/todos/' + todo.id;
    return done();
  });
});

hooks.before('Todos > Todo > Delete a Todo', function(t, done) {
  request.post({
    uri: uri(t, 'todos'),
    json: {'title': 'delete me'}
  }, function(err, res, todo) {
    t.fullPath = '/todos/' + todo.id;
    return done();
  });
});

hooks.after('Todos > Todo > Delete a Todo', function(t, done) {
  request.get({
    uri: uri(t, t.fullPath)
  }, function(err, res, body) {
    console.assert(res.statusCode == 404);
    return done();
  });
});

hooks.after('Todos > Todos Collection > Archive done Todos', function(t, done) {
  request.get({
    uri: uri(t, 'todos')
  }, function(err, res, body) {
    JSON.parse(body).forEach(function(todo) {
      console.assert(!todo.complete);
    });
    return done();
  });
});
