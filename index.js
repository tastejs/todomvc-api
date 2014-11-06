'use strict';

var Dredd = require('dredd');
var express = require('express');
var fs = require('fs');
var markdown = require('marked');
var path = require('path');

var server = module.exports.server = express();

server.use(express.static(__dirname));

server.get('/', function (req, res) {
	module.exports.getSpecHtml(function (err, html) {
		if (err) {
			throw err;
		}

		res.end(html);
	});
});

module.exports.getSpecHtml = function (callback) {
	var blueprintPath = require.resolve('todomvc-api/todos.apib');

	fs.readFile(blueprintPath, function (err, blueprint) {
		if (err) {
			return callback(err);
		}

		var cssPath = require.resolve('github-markdown-css/github-markdown.css');
		var body = markdown(blueprint.toString().replace(/^FORMAT.*/, ''));

		callback(null, [
			'<!doctype html>',
			'<html lang="en">',
			'	<head>',
			'		<meta charset="utf-8">',
			'		<title>TodoMVC API Blueprint</title>',
			'		<link rel="stylesheet" href="' + path.relative(__dirname, cssPath) + '">',
			'		<style>',
			'			body { background: #eee; }',
			'			.markdown-body { background: #fff; width:790px; margin: 30px auto; padding: 30px; }',
			'		</style>',
			'	</head>',
			'	<body>',
			'		<article class="markdown-body">' + body + '</article>',
			'	</body>',
			'</html>'
		].join('\n'));
	});
};

module.exports.validate = function (serverUrl, cb) {
	if (typeof serverUrl === 'function') {
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
};
