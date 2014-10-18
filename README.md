todomvc-api
===========

[TodoMVC](//todomvc.com/) API contains the [apiblueprint](//apiblueprint.org/) [spec](todos.apib) and a [dredd](//github.com/apiaryio/dredd) wrapper to run validation tests against [TasteStack](//github.com/tastejs/TasteStack) TodoMVC backends.

### Usage w/ [gulp](//gulpjs.com) and [express](//expressjs.com)
```
var todomvc = require('todomvc-api);

gulp.task('test', function(done) {
  var server = app.listen(8080, function() {
    // default API url is http://localhost:8080       
    todomvc.validator().run(function(err, stats) {
      server.close(function() {
        if (stats && (stats.errors || stats.failures)) {
          done('api validation failed');
          return;
        }
        done(err);
      });
    });
    // also accept custom API url.
    todomvc.validator('http://127.0.0.1:9090').run(function(err, stats){});
  });
});
```