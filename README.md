# express-router-ns

This package replaces the obsolete express-namespace

## You want to migrate from Express 3.x with express-namespace

```
require('express-namespace')
var express = require('express')
var app = express();

# registering /a/b/c route
app.namespace('/a', function() {
  app.namespace('/b', function() {
    app.get('/c', function(req, res) {
      res.end();
    });
  });
});
```

## Usage with Express 4.x with express-router-ns
```
var express = require('express')
var ExpressRouterNs = require('express-router-ns')(express.Router);
var app = express();
var appRouter = new ExpressRouterNs();

app.use(appRouter)

# registering /a/b/c route
appRouter.namespace('/a', function() {
  appRouter.namespace('/b', function() {
    appRouter.get('/c', function(req, res) {
      res.end();
    });
  });
});
```
