
// fgraphql populate hooks for service `likes`. (Can be re-generated.)
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
  recordType: 'Like',
  query: {
    id: 1,
    _id: 1,
    authorId: 1,
    commentId: 1,
    author_users: {

    },
    comment_comments: {

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