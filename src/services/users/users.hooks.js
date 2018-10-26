
// Hooks for service `users`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
// eslint-disable-next-line no-unused-vars
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
// eslint-disable-next-line no-unused-vars
const fgraphql = require('../../hooks/fgraphql');
// !code: imports
const { parse } = require('graphql');
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
const serviceResolvers = require('../../services/graphql/service.resolvers');
const populate = require('./users.populate.js');
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
    find: populate,
    /*
      query = () => ({ // query or func returning query
    fullName: {},
    posts: {
      _args: { query: {  } }, // { key: any, query: { ... }, params: { ... }
      author: {
        firstName: 1,
        fullName: 1, // {} or '' or 1 doesn't matter as no props inside would-have-been {}
        posts: {
          draft: 1,
        },
      },
    },
    comments: {},
    followed_by: {
      foo: 1, // non-resolver name looks like field name. forces drop of real fields
      follower: {
        foo: 1,
        fullName: 1,
      }
    },
    following: {
      foo: 1,
      followee: {
        foo: 1,
        fullName: 1,
      },
    },
    likes: {
      author: {
        firstName: 1,
        lastName: 1,
      },
      comment: {
        body: 1
      },
    },
  });
    fgraphql({
      parse,
      runTime,
      schema: schemaDefinitionLanguage, //
      resolvers: serviceResolvers, // could also be ../../services/graphql/batchloader.resolvers
      recordType: 'User', // the Type of the records returned by the service call
      query: () => ({ // query or func returning query
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
      }),
      options: {
        // these values are the defaults
        skipHookWhen: context => !!(context.params || {}).graphql, // set by generated resolvers
        queryIsProperGraphQL: false, // not ( findUser: { fullName: {} }} but { fullName:{} }
        inclAllFieldsServer: true, // if no field explicitly incl, incl them all. called on server
        inclAllFieldsClient: true, // called on client
      },
    }),
    */
    get: [populate],
    create: [populate],
    update: [],
    patch: [],
    remove: [populate]
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
