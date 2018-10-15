
// Configure the Feathers services. (Can be re-generated.)
let comments = require('./comments/comments.service');
let likes = require('./likes/likes.service');
let posts = require('./posts/posts.service');
let relationships = require('./relationships/relationships.service');
let users = require('./users/users.service');

let graphql = require('./graphql/graphql.service');
// !code: imports // !end
// !code: init // !end

// eslint-disable-next-line no-unused-vars
let moduleExports = function (app) {
  app.configure(comments);
  app.configure(likes);
  app.configure(posts);
  app.configure(relationships);
  app.configure(users);

  app.configure(graphql);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
