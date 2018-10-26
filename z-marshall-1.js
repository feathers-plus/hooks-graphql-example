// Hooks for service `environments`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks
// eslint-disable-next-line no-unused-vars
const clearXmlCache = require('../../../hooks/clear-xml-cache')
// eslint-disable-next-line no-unused-vars
const mapByAttr = require('../../../hooks/map-by-attr')
// !code: imports
const slugify = require('feathers-slugify')
const { shallowPopulate } = require('feathers-shallow-populate')
const benchmark = require('../../../hooks/benchmark')
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./environments.validate')
// !end

// !code: init
const populateEnvPanos = shallowPopulate({
  include: [{
    service: 'env-panos',
    nameAs: 'envPanos',
    keyHere: '_id',
    keyThere: 'environmentId',
    asArray: true
  }]
})
const populateTourMenuItems = context => {
  if (context.params.query && context.params.query.$populate && context.params.query.$populate.includes('tour-menu-items')) {
    return shallowPopulate({
      include: [{
        service: 'tour-menu-items',
        nameAs: 'tourMenuItems',
        keyHere: '_id',
        keyThere: 'envId',
        asArray: true
      }]
    })(context)
  }
}
// !end

let moduleExports = {
  before: {
    // Your hooks should include:
    //   all   : authenticate('jwt')
    // !code: before
    all: [],
    find: [
      iff(
        context => context.params.query.envSlug,
        context => {
          context.params.envSlug = context.params.query.envSlug
        }
      ).else (
        authenticate('jwt')
      ),
      // Restrict non-admins to only their allowed records.
      iff(
        context => context.params.user && !context.params.user.roles.includes('admin') && !context.params.envSlug,
        context => {
          context.params.query.clientId = {
            $in: context.params.user.clients
          }
        }
      )
    ],
    // No auth required if they have an environment's _id
    get: [
      // Keep people from futzing with the endpoint.  Return an auth error if they don't pass an id.
      iff(
        context => {
          return !context.id
        },
        authenticate('jwt')
      )
    ],
    create: [
      authenticate('jwt'),
      slugify({ slug: 'name' })
    ],
    update: [
      authenticate('jwt')
    ],
    patch: [
      authenticate('jwt')
    ],
    remove: [
      authenticate('jwt')
    ]
    // !end
  },

  after: {
    // !code: after
    all: [],
    find: [
      iff(
        context => {
          const { params } = context
          return params.query && params.query.$populate && params.query.$populate.includes('env-panos')
        },
        populateEnvPanos,
        mapByAttr({
          keyToMap: 'envPanos',
          dest: 'envPanosByPanoId',
          attr: 'panoId'
        })
      ),
      benchmark('before populateTourMenuItems'),
      populateTourMenuItems,
      benchmark('after populateTourMenuItems')
    ],
    get: [
      iff(
        context => {
          const { params } = context
          return params.query && params.query.$populate && params.query.$populate.includes('env-panos')
        },
        populateEnvPanos,
        mapByAttr({
          keyToMap: 'envPanos',
          dest: 'envPanosByPanoId',
          attr: 'panoId'
        })
      ),
      benchmark('before populateTourMenuItems'),
      populateTourMenuItems,
      benchmark('after populateTourMenuItems')
    ],
    create: [
      populateEnvPanos,
      populateTourMenuItems
    ],
    update: [
      populateEnvPanos,
      populateTourMenuItems,
      clearXmlCache(context => context.result.slug)
    ],
    patch: [
      populateEnvPanos,
      populateTourMenuItems,
      clearXmlCache(context => context.result.slug)
    ],
    remove: [
      clearXmlCache(context => context.result.slug)
    ]
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
}

// !code: exports // !end
module.exports = moduleExports

// !code: funcs // !end
// !code: end // !end