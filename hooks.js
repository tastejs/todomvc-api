'use strict';

var async = require('async');
var request = require('request');
// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');
var url = require('url');

var BASE_URL;

// DELETE /todos
// after: check that there is no more completed todos.
hooks.after('Todos > Todos Collection > Archive completed Todos', function (t, done) {
	request.get(uri(t, '/todos'), function (err, res, body) {
		JSON.parse(body).forEach(function (todo) {
			console.assert(!todo.complete);
		});
		return done();
	});
});

// GET /todos/:id
// before: create a new todo.
hooks.before('Todos > Todo > Get a Todo', function (t, done) {
	request.post({
		uri: uri(t, '/todos'),
		json: {
			title: 'dredd'
		}
	}, function (err, res, todo) {
		t.fullPath = '/todos/' + todo.id;
		return done();
	});
});

// PUT /todos/:id
// before: create a new todo.
// after: check that the todo is marked complete.
hooks.before('Todos > Todo > Update a Todo', function (t, done) {
	request.post({
		uri: uri(t, '/todos'),
		json: {
			title: 'dredd',
			completed: false
		}
	}, function (err, res, todo) {
		t.fullPath = '/todos/' + todo.id;
		return done();
	});
});

// DELETE /todos/:id
// before: create a new todo.
// after: check that the todo is gone.
hooks.before('Todos > Todo > Delete a Todo', function (t, done) {
	request.post({
		uri: uri(t, '/todos'),
		json: {
			title: 'dredd'
		}
	}, function (err, res, todo) {
		t.fullPath = '/todos/' + todo.id;
		return done();
	});
});

hooks.after('Todos > Todo > Delete a Todo', function (t, done) {
	request.get(uri(t, t.fullPath), function (err, res) {
		console.assert(res.statusCode === 404);
		return done();
	});
});

// Remove all todos that were created by the tests.
hooks.afterAll(function (done) {
	request.get(uri('/todos'), function (err, res, todos) {
		if (!Array.isArray(todos)) {
			try {
				todos = JSON.parse(todos);
			} catch (e) {
				done(e);
			}
		}

		var todosToDelete = todos.filter(function (todo) {
			return todo.title === 'dredd';
		});

		async.parallel(todosToDelete.map(function (todo) {
			return function (next) {
				request.del(uri('/todos/' + todo.id), next);
			};
		}), done);
	});
});

function uri(t, path) {
	path = path || t;
	if (!BASE_URL) {
		BASE_URL = t;
	}
	return url.format({
		protocol: BASE_URL.protocol,
		hostname: BASE_URL.host,
		port: BASE_URL.port,
		pathname: path
	});
}
