
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

const b = fgraphql({
  parse,
  schema: schemaDefinitionLanguage,
  resolvers: serviceResolvers,
  recordType: 'User',
  query: {
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

  },
  options: {},
});

let moduleExports = {
  a,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs
// just joining recs
const hook1 = makeFgraphql({
  fullName: {}, posts: {}, comments: {}, likes: {},
  followed_by: { follower: {} }, following: { followee: {} } // both use same n:m table
});

// slightly cleaner notation for joins
const hook1a = makeFgraphql({
  fullName: 1, posts: 1, comments: 1, likes: 1,
  followed_by: { follower: 1 }, following: { followee: 1 }
});

// recursive join
const hook2 = makeFgraphql({
  followed_by: { follower: { firstName: 1, lastName: 1 } },
  following: { followee: { fullName: 1 } }
}, {
  inclAllFieldsServer: false,
  inclAllFieldsClient: false,
});

// client provides fgraphql query
const hook3 = context => {
  return makeFgraphql(context.params.$graphql)(context);
};


// ad hoc decision making
const usersPopulate = context => {
  let query = {};

  if (context.foo) return context;
  if (context.params.$populateQuery) {
    query = context.params.$populateQuery;
  } else {
    if (context.bar) Object.assign(query, { messages: 1 });
    if (context.baz) Object.assign(query, { messages: { _args: { query: { hidden: false }}}});
  }

  return fgraphql({
    parse,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query,
    options: {},
    resolverContent: {}
  })(context);
};

// more structured decision making
const hook5 = context => {
  let query;

  switch(something) {
    case something1:
      query = { posts: { _args: { query: { draft: 1 } } } };
      break;
    case something2:
      query = { posts: { _args: { query: { draft: 0, active: true } } } };
      break;
  }

  return fgraphql({
    parse,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query,
    options,
  });
};

function makeFgraphql(query = {}, options = {}) {
  return fgraphql({
    parse,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query,
    options,
  });
}
// !end
// !code: end // !end
