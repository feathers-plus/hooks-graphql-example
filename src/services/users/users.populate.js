
// fgraphql populate hook for service `users`. (Can be re-generated.)
const runTime = require('@feathers-plus/graphql/lib/run-time');
const { fgraphql } = require('feathers-hooks-common');
const { parse } = require('graphql');
// !<DEFAULT> code: graphql
const schema = require('../../services/graphql/graphql.schemas');
const resolvers = require('../../services/graphql/service.resolvers');
// !end
// !code: imports // !end
// !code: init // !end

const queries = {
  // No populate
  none: {},
  // All resolver fields 1 level deep.
  oneLevel: {
    query: {
      fullName: {},
      posts: {},
      comments: {},
      followed_by: {},
      following: {},
      likes: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      fullName: {
      },
      posts: {
        author: {},
        comments: {},
      },
      comments: {
        author: {},
        likes: {},
      },
      followed_by: {
        follower: {},
        followee: {},
      },
      following: {
        follower: {},
        followee: {},
      },
      likes: {
        author: {},
        comment: {},
      },
    }
  },
  // !code: queries
  ex2: {
    query: {
      posts: {},
    },
  },
  ex3: {
    query: {
      posts: {},
      comments: {},
      followed_by: {},
      following: {},
      likes: {},
    },
  },
  ex4: {
    query: {
      email: 1,
      posts: {
        body: 1,
        draft: 1,
      },
    },
  },
  ex5: {
    query: {
      email: 1,
      posts: {
        body: 1,
        author: {
          email: 1,
        }
      },
      likes: {
        author: {
          email: 1,
        },
        comment: {
          body: 1,
        },
      },
    },
    options: {
      inclAllFieldsServer: false
    },
  },
  ex6: {
    query: {
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
    },
    options: {
      inclAllFieldsServer: false,
    },
  },
  // !end
};

async function usersPopulate (context) {
  // eslint-disable-next-line no-unused-vars
  const params = context.params;
  let query, options;

  if (params.$populate) return context; // another populate is calling this service

  // !code: populate
  // Example: always the same query
  ({ query, options } = queries.ex6);

  /*
  // Example: select query based on user being authenticated or not
  ({ query, options } = queries[params.user ? queries.foo : queries.bar]);

  // Example: select query based on the user role
  if (params.user && params.user.roles.includes('foo')) {
    ({ query, options } = queries.foo);
  }

  // Example: allow client to provide the query
  if (params.$populateQuery) {
    ({ query, options } = params.$populateQuery);
  }
  */

  // Populate the data.
  const newContext = await fgraphql({
    parse,
    runTime,
    schema,
    resolvers,
    recordType: 'User',
    query,
    options,
  })(context);

  // Prune and sanitize the data.
  // ...

  // End the hook.
  return newContext;
  // !end
}

// !code: more // !end
let moduleExports = usersPopulate;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
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
  }
};
*/
