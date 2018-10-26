
// fgraphql populate hooks for service `users`. (Can be re-generated.)
const { fgraphql } = require('feathers-hooks-common');
const { parse } = require('graphql');
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
const serviceResolvers = require('../../services/graphql/service.resolvers');
// !code: imports // !end
// !code: init // !end

const a = fgraphql({
  parse,
  schema: schemaDefinitionLanguage,
  resolvers: serviceResolvers,
  recordType: 'User',
  query: {
    id: 1,
    _id: 1,
    email: 1,
    firstName: 1,
    lastName: 1,
    fullName: {
      _args: {},
    },
    posts: {
      _args: {},
      id: 1,
      _id: 1,
      authorId: 1,
      body: 1,
      draft: 1,
      author: {},
      comments: {},
    },
    comments: {
      _args: {},
      id: 1,
      _id: 1,
      authorId: 1,
      postId: 1,
      body: 1,
      archived: 1,
      author: {},
      likes: {},
    },
    followed_by: {
      _args: {},
      id: 1,
      _id: 1,
      followerId: 1,
      followeeId: 1,
      follower: {},
      followee: {},
    },
    following: {
      _args: {},
      id: 1,
      _id: 1,
      followerId: 1,
      followeeId: 1,
      follower: {},
      followee: {},
    },
    likes: {
      _args: {},
      id: 1,
      _id: 1,
      authorId: 1,
      commentId: 1,
      author: {},
      comment: {},
    },

  },
  options: {},
});


let moduleExports = {
  a,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
