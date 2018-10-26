
// fgraphql populate hooks for service `users`. (Can be re-generated.)
const runTime = require('@feathers-plus/graphql/lib/run-time');
const fgraphql = require('../../hooks/fgraphql');
const { parse } = require('graphql');
// !<DEFAULT> code: graphql
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
const serviceResolvers = require('../../services/graphql/service.resolvers');
// !end
// !code: imports // !end
// !code: init // !end

/* For your information: all record and resolver fields

const queryAll = {
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
};
*/

/* For your information: just resolver fields

const queryJoins = {
  fullName: {
    _args: {},
  },
  posts: {
    _args: {},
    author: {},
    comments: {},
  },
  comments: {
    _args: {},
    author: {},
    likes: {},
  },
  followed_by: {
    _args: {},
    follower: {},
    followee: {},
  },
  following: {
    _args: {},
    follower: {},
    followee: {},
  },
  likes: {
    _args: {},
    author: {},
    comment: {},
  },
};
*/

// !<DEFAULT> code: hook
// eslint-disable-next-line no-unused-vars
const usersPopulate = context => {
  if (context.params.$populate) return context; // another populate is calling this service

  // Setup query appropriate to circumstances in context
  if (context.foo) return context;
  let query = {};




  query = {
    fullName: {},
    following: {
      follower: {
        fullName: {},
      }
    },
    followed_by: {
      followee: {
        fullName: {},
      },
    },
    likes: {
      comment: {
        body: 1,
        post: {
          body: 1,
        },
      },
    },
    posts: {
      _args: {query:{$sort:{body:1}}},
      body: 1,
      comments: {
        body: 1,
        author: {
          fullName: {},
        },
      },
      author: {
        fullName: {},
        following: {
          follower: {
            fullName: {},
          }
        },
        followed_by: {
          followee: {
            fullName: {},
          },
        },
      }
    },
  };


  if (context.params.$populateQuery) {
    query = context.params.$populateQuery;
  } else {
    if (context.bar) Object.assign(query, { messages: 1 });
    if (context.baz) Object.assign(query, { messages: { _args: { query: { hidden: false }}}});
  }

  // Return populated data
  return fgraphql({
    parse,
    runTime,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query,
    options: {
      inclAllFieldsServer: false
    },
  })(context);
};

let moduleExports = usersPopulate;
// !end

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
