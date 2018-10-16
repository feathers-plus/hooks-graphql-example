
// Hooks for service `users`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
// eslint-disable-next-line no-unused-vars
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
// eslint-disable-next-line no-unused-vars
const fgraphql = require('../../hooks/fgraphql');
// !code: imports
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
const serviceResolvers = require('../../services/graphql/service.resolvers');
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./users.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // Your hooks should include:
    //   find  : authenticate('jwt')
    //   get   : authenticate('jwt')
    //   create: hashPassword()
    //   update: hashPassword(), authenticate('jwt')
    //   patch : hashPassword(), authenticate('jwt')
    //   remove: authenticate('jwt')
    // !<DEFAULT> code: before
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword() ],
    update: [ hashPassword(), authenticate('jwt') ],
    patch: [ hashPassword(), authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
    // !end
  },

  after: {
    // Your hooks should include:
    //   all   : protect('password') /* Must always be the last hook */
    // !code: after
    all: [ protect('password') /* Must always be the last hook */ ],

    // firstName, lastName, draft, body are fields stored in their respective records.
    // fullName, posts, author, comments, followed_by, follower, following, followee, likes, comment
    // are created by calls to resolver functions.
    find: fgraphql({
      schema: schemaDefinitionLanguage,
      resolvers: serviceResolvers, // could be ../../services/graphql/batchloader.resolvers
      query: context => ({ // SDL string or func returning SDL string
        User: {
          fullName: {},
          posts: {
            _args: { query: {  } }, // { key: any, query: { ... }, params: { ... }
            author: {
              firstName: '',
              fullName: '', // {} or '' doesn't matter as no props inside would-have-been {}
              posts: {
                draft: '',
              },
            },
          },
          comments: {},
          followed_by: {
            foo: '', // non-resolver name looks like field name. forces drop of real fields
            follower: {
              foo: '',
              fullName: {},
            }
          },
          following: {
            foo: '',
            followee: {
              foo: '',
              fullName: {},
            },
          },
          likes: {
            author: {
              firstName: '',
              lastName: '',
            },
            comment: {
              body: ''
            },
          },
        }
      }),
      options: {
        inclAllFieldsServer: true,
        inclAllFieldsClient: true,
      },
    }),
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
