var request = require('request');
// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');
var url = require('url');

// DELETE /todos
// after: check that there is no more completed todos.
hooks.after('Todos > Todos Collection > Archive completed Todos', function(t, done) {
  request.get({
    uri: uri(t, 'todos')
  }, function(err, res, body) {
    JSON.parse(body).forEach(function(todo) {
      console.assert(!todo.complete);
    });
    return done();
  });
});

// GET /todos/:id
// before: create a new todo.
hooks.before('Todos > Todo > Get a Todo', function(t, done) {
  request.post({
    uri: uri(t, 'todos'),
    json: {'title': 'do that'}
  }, function(err, res, todo) {
    t.fullPath = '/todos/' + todo.id;
    return done();
  });
});

// DELETE /todos/:id
// before: create a new todo.
// after: check that the todo is gone.
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

function uri(t, path) {
  return url.format({
    protocol: 'http',
    hostname: t.host,
    port: t.port,
    pathname: path
  });
}
