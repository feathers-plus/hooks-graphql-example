
// Setup content param passed to resolvers. Compatible to feathers-graphql adapter.
const resolverContent = {
  app: this._app,
  provider: context.params.provider,
  user: context.params.user,
  authenticated: context.params.authenticated,
  batchLoaders: {},
  cache: {},
};

[/* other params to copy */].forEach(name => {
  if (name in context.params) {
    resolverContent[name] = context.params[name];
  }
});