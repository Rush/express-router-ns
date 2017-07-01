const express = require('express');
const ExpressRouterNs = require('./')(express.Router);
const request = require('supertest');

describe('ExpressRouterNs', () => {
  let app;
  let appRouter;
  beforeEach(function() {
    app = express();
    appRouter = new ExpressRouterNs();
    app.use(appRouter);
  });
  const send200 = (req, res) => res.end();
  const send500 = (req, res) => res.status(500).end();
  const assertRoute = path => request(app).get(path).expect(200);
  
  it('should handle simple request', () => {
    appRouter.get('/user', send200);
    
    return assertRoute('/user');
  });
  
  it('should handle simple namespace', () => {
    appRouter.get('/user', send200);
    
    appRouter.namespace('/foo', function() {
      appRouter.get('/action', send200);
    });
      
    return assertRoute('/foo/action');
  });
  
  it('should restore original methods', () => {
    appRouter.get('/user', send200);
    
    appRouter.namespace('/foo', () => {
      appRouter.get('/action', send200);
    });
    
    appRouter.get('/user2', send200);
      
    return assertRoute('/user2');
  });
  
  it('should handle multi-level namespace and restore', () => {
    appRouter.namespace('/foo1', () => {
      appRouter.namespace('/foo2', () => {
        appRouter.namespace('/foo3', () => {
          appRouter.namespace('/foo4', () => {
            appRouter.namespace('/foo5', () => {
              appRouter.get('/foo', send200);
            });
          });
        });
      });
    });
    appRouter.get('/bar', send200);
    return assertRoute('/foo1/foo2/foo3/foo4/foo5/foo').then(() => {
      return assertRoute('/bar');
    });
  });
});
