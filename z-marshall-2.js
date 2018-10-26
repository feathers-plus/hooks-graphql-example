// Hooks for service `envPanos`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks
// eslint-disable-next-line no-unused-vars
const calculateInfoboxBubbles = require('./hooks/calculate-infobox-bubbles')
// eslint-disable-next-line no-unused-vars
const clearXmlCache = require('../../../hooks/clear-xml-cache')
// eslint-disable-next-line no-unused-vars
const loadTargetEnvPanos = require('./hooks/load-target-env-panos')
// !code: imports
const { shallowPopulate } = require('feathers-shallow-populate')
const benchmark = require('../../../hooks/benchmark')
const { discard } = require('feathers-hooks-common')
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./env-panos.validate')
// !end

// !code: init
const populatePano = shallowPopulate({
  include: [{
    service: 'panos',
    nameAs: 'pano',
    keyHere: 'panoId',
    keyThere: '_id',
    asArray: false
  }]
})
const populateTargetEnvs = shallowPopulate({
  include: [{
    service: 'env-panos',
    nameAs: 'targetEnvPanos',
    keyHere: 'targetEnvPanoIds',
    keyThere: '_id',
    asArray: true
  }]
})
const populatePanoHotspots = shallowPopulate({
  include: [{
    service: 'pano-hotspots',
    nameAs: 'panoHotspots',
    keyHere: '_id',
    keyThere: 'envPanoId',
    asArray: true
  }]
})
// !end

let moduleExports = {
  before: {
    // Your hooks should include:
    //   all   : authenticate('jwt')
    // !code: before
    all: [],
    find: [
      iff(
        context => {
          return context.params.provider && (!context.params.query.environmentId || !context.params.query.panoId)
        },
        authenticate('jwt'),

        iff(
          context => {
            return !context.params.user.roles.includes('admin') && !context.params.user.clients.length
          },
          // environmentId and panoId are required
          context => {
            const { environmentId: envId, panoId } = context.params.query

            if (envId === null || envId === undefined || panoId === null || panoId === undefined) {
              throw new Error('environmentId and panoId are required')
            }
          }
          // required('environmentId', 'panoId')
        ),
        // When a envId and panoId are provided, log a stat-view.  Do not wait for the response
        iff(
          context => context.params.query.environmentId && context.params.query.panoId,
          context => {
            const { environmentId: envId, panoId } = context.params.query

            app.service('stat-views').create({ type: 'env-pano', envId, panoId })
          }
        )
      ),
      iff(
        context => context.params.query.environmentId && context.params.query.panoId,
        context => context.params.paginate = false
      )
    ],
    get: [
      authenticate('jwt')
    ],
    create: [
      authenticate('jwt')
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
      // This first check allows passing $populate: false to skip populates
      iff(
        context => context.params.query.$populate === false,
        context => {
          delete context.params.query.$populate
          return context
        }
      ).else(
        populatePano,

        // Always populate pano-hotspots for internal queries.
        // Only populate pano-hotspots for external requests that specifically ask for them.
        iff(
          context => {
            return context.params.query.$populate && context.params.query.$populate.includes('pano-hotspots') ||
              !context.params.provider
          },
          populatePanoHotspots,
          calculateInfoboxBubbles(),
          // If only one envPano is loaded, get all directly-connected targetEnvPanos from the connected pano hotspots.
          iff(
            context => context.result.data ? context.result.data.length === 1 : context.result.length === 1,
            ...loadTargetEnvPanos
          )
        ),

        benchmark('before discard'),
        discard('targetEnvPanoIds', 'panoHotspotIds')
      )
    ],
    get: [
      populatePano,
      populatePanoHotspots
    ],
    create: [
      populatePano,
      populatePanoHotspots,
      clearXmlCache(context => ({ _id: context.result.environmentId }))
    ],
    update: [
      populatePano,
      populatePanoHotspots,
      clearXmlCache(context => ({ _id: context.result.environmentId }))
    ],
    patch: [
      populatePano,
      populatePanoHotspots,
      clearXmlCache(context => ({ _id: context.result.environmentId }))
    ],
    remove: [
      clearXmlCache(context => ({ _id: context.result.environmentId }))
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