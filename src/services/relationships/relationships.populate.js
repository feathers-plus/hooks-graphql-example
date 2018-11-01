
// fgraphql populate hook for service `relationships`. (Can be re-generated.)
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
      follower: {},
      followee: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      follower: {
        fullName: {},
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {},
      },
      followee: {
        fullName: {},
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {},
      },
    }
  },
  // !code: queries // !end
};

async function relationshipsPopulate (context) {
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
    recordType: 'Relationship',
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
let moduleExports = relationshipsPopulate;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
  query: {
    id: 1,
    _id: 1,
    followerId: 1,
    followeeId: 1,
    follower: {
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
    followee: {
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
  }
};
*/
