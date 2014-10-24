'use strict';

var request = require('request');
// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');

var API_BASE_URL = global.TODOMVC_API_BASE_URL;

// DELETE /todos
// after: check that there is no more completed todos.
hooks.after('Todos > Todos Collection > Archive completed Todos', function (t, done) {
	request.get(uri('/todos'), function (err, res, body) {
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
		uri: uri('/todos'),
		json: {
			title: 'dredd'
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
		uri: uri('/todos'),
		json: {
			title: 'dredd'
		}
	}, function (err, res, todo) {
		t.fullPath = '/todos/' + todo.id;
		return done();
	});
});

hooks.after('Todos > Todo > Delete a Todo', function (t, done) {
	request.get(uri(t.fullPath), function (err, res) {
		console.assert(res.statusCode === 404);
		return done();
	});
});

// Remove all todos that were created by the tests.
hooks.afterAll(function (done) {
	request.get(uri('/todos'), function (err, res, todos) {
		var deleted = 0;
		var doneCalled = false;

		function completeHook(err) {
			if (!doneCalled) {
				doneCalled = true;
				done(err);
			}
		}

		if (!Array.isArray(todos)) {
			try {
				todos = JSON.parse(todos);
			} catch (e) {
				completeHook(e);
			}
		}

		var todosToDelete = todos.filter(function (todo) {
			return todo.title === 'dredd';
		});

		if (todosToDelete.length === 0) {
			completeHook();
			return;
		}

		todosToDelete.forEach(function (todo, index, todos) {
			request.del(uri('/todos/' + todo.id), function (err) {
				if (err) {
					completeHook(err);
					return;
				}

				if (++deleted === todos.length) {
					completeHook();
				}
			});
		});
	});
});

function uri(path) {
	return API_BASE_URL + path;
}
