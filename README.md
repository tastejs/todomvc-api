todomvc-api
===========

[TodoMVC](//todomvc.com/) API contains the [apiblueprint](//apiblueprint.org/) [spec](todos.apib) and a [dredd](//github.com/apiaryio/dredd) wrapper to run validation tests against [TasteStack](//github.com/tastejs/TasteStack) TodoMVC backends.

### Usage w/ [gulp](//gulpjs.com) and [express](//expressjs.com)
```
var todomvc = require('todomvc-api);
gulp.task('test', function(done) {
  todomvc(function start(serverStarted) {
    var server = app.listen(0, function() {
      var serverUrl = url.format({
        protocol: 'http',
        hostname: server.address().address,
        port: server.address().port
      });
      serverStarted(serverUrl, function stop(serverStopped) {
        server.close(serverStopped);
      });
    });
  }, done);
});
```