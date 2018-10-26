
// fgraphql populate hooks for service `relationships`. (Can be re-generated.)
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
  recordType: 'Relationship',
  query: {
    id: 1,
    _id: 1,
    followerId: 1,
    followeeId: 1,
    follower_users: {

    },
    followee_users: {

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