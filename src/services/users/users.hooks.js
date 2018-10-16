
// Hooks for service `users`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
// eslint-disable-next-line no-unused-vars
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
// eslint-disable-next-line no-unused-vars
const fgraphql = require('../../hooks/fgraphql');
// !code: imports
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
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
    find: fgraphql({
      schema: schemaDefinitionLanguage,
      query: {
        User: {
          // will incl all fields from rec as no field names were specified
          fullName: '',
          posts: {
            // props allowed in _args are { key: any, query: { ... }, params: { ... }
            _args: { query: { draft: false } },
            // will incl all fields from rec as no field names were specified
            author: {
              // includes only firstName from rec as at least 1 field name was specified
              firstName: '',
              fullName: '',
              posts: {
                // includes only draft from rec as at least 1 field name was specified
                draft: '',
              },
            },
          },
          // will incl all fields from rec as no field names were specified
          comments: '',
          followed_by: {
            follower: ''
          },
          following: {
            followee: '',
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
      }
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
