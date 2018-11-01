
// fgraphql populate hook for service `posts`. (Can be re-generated.)
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
      author: {},
      comments: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      author: {
        fullName: {},
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {},
      },
      comments: {
        author: {},
        likes: {},
      },
    }
  },
  // !code: queries // !end
};

async function postsPopulate (context) {
  // eslint-disable-next-line no-unused-vars
  const params = context.params;
  let query, options;

  if (params.$populate) return context; // another populate is calling this service

  // !code: populate
  // Example: always the same query
  ({ query, options } = queries.twoLevels);

  // Populate the data.
  const newContext = await fgraphql({
    parse,
    runTime,
    schema,
    resolvers,
    recordType: 'Post',
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
let moduleExports = postsPopulate;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
  query: {
    id: 1,
    _id: 1,
    authorId: 1,
    body: 1,
    draft: 1,
    author: {
      _args: {},
      id: 1,
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      fullName: {},
      posts: {},
      comments: {},
      followed_by: {},
      following: {},
      likes: {},
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
  }
};
*/
