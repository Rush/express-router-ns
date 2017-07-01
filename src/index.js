const methods = require('http').METHODS.map(methodName => methodName.toLowerCase());

module.exports = function(ParentRouter) {
  class ExpressRouterNs extends ParentRouter {
    constructor(_options = {}) {
      super(_options);
      
      const appRouter = this;
      appRouter.namespace = function routerNamespace(namespacePath, cb) {
          var router = new ParentRouter(_options);
          const saveMethods = frame => {
            methods.forEach(function(methodName) {
                frame[methodName] = appRouter[methodName];
                appRouter[methodName] = router[methodName].bind(router);
            });
          }
          const restoreMethods = frame => {
            methods.forEach(function(methodName) {
                appRouter[methodName] = frame[methodName];
            });
          }
          
          this.use(namespacePath, router);
          var oldNamespace = appRouter.namespace;
          appRouter.namespace = function(namespacePath, cb) {
              routerNamespace.call(router, namespacePath, cb);
          };
          
          var frame = {};
          saveMethods(frame);
          cb.call(router);
          restoreMethods(frame);
          
          appRouter.namespace = oldNamespace;
      };    
    }
  };
  
  return ExpressRouterNs;
};
