// Hooks for service `panoHotspots`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks
// eslint-disable-next-line no-unused-vars
const calculateCoordinates = require('./hooks/calculate-coordinates')
// eslint-disable-next-line no-unused-vars
const clearXmlCache = require('../../../hooks/clear-xml-cache')
// eslint-disable-next-line no-unused-vars
const sanitizePanoHotspots = require('./hooks/sanitize-pano-hotspots')
// !code: imports
const { shallowPopulate } = require('feathers-shallow-populate')
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./pano-hotspots.validate')
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
const populateTargetPano = shallowPopulate({
  include: [{
    service: 'panos',
    nameAs: 'targetPano',
    keyHere: 'targetPanoId',
    keyThere: '_id',
    asArray: false
  }]
})
const populateInfoboxes = shallowPopulate({
  include: [{
    service: 'infoboxes',
    nameAs: 'infobox',
    keyHere: 'infoboxId',
    keyThere: '_id',
    asArray: false
  }]
})
const populateHotspotIcon = shallowPopulate({
  include: [{
    service: 'hotspot-icons',
    nameAs: 'hotspotIcon',
    keyHere: 'hotspotIconId',
    keyThere: '_id',
    asArray: false
  }]
})
// !end

let moduleExports = {
  before: {
    // Your hooks should include:
    //   all   : authenticate('jwt')
    // !<DEFAULT> code: before
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
        sanitizePanoHotspots(),
        populatePano,
        populateTargetPano,
        populateInfoboxes,
        populateHotspotIcon,
        calculateCoordinates()
      )
    ],
    get: [
      sanitizePanoHotspots(),
      populatePano,
      populateTargetPano,
      populateInfoboxes,
      populateHotspotIcon,
      calculateCoordinates(),
      clearXmlCache(async context => {
        if (context.result.envPanoId) {
          const envPano = await context.app.service('env-panos').get(context.result.envPanoId)

          return { _id: envPano.environmentId }
        }
      })
    ],
    create: [
      sanitizePanoHotspots(),
      populatePano,
      populateTargetPano,
      populateInfoboxes,
      populateHotspotIcon,
      calculateCoordinates(),
      clearXmlCache(async context => {
        if (context.result.envPanoId) {
          const envPano = await context.app.service('env-panos').get(context.result.envPanoId)

          return { _id: envPano.environmentId }
        }
      })
    ],
    update: [
      sanitizePanoHotspots(),
      populatePano,
      populateTargetPano,
      populateInfoboxes,
      populateHotspotIcon,
      calculateCoordinates(),
      clearXmlCache(async context => {
        if (context.result.envPanoId) {
          const envPano = await context.app.service('env-panos').get(context.result.envPanoId)

          return { _id: envPano.environmentId }
        }
      })
    ],
    patch: [
      sanitizePanoHotspots(),
      populatePano,
      populateTargetPano,
      populateInfoboxes,
      populateHotspotIcon,
      calculateCoordinates(),
      clearXmlCache(async context => {
        if (context.result.envPanoId) {
          const envPano = await context.app.service('env-panos').get(context.result.envPanoId)

          return { _id: envPano.environmentId }
        }
      })
    ],
    remove: [
      clearXmlCache(async context => {
        if (context.result.envPanoId) {
          const envPano = await context.app.service('env-panos').get(context.result.envPanoId)

          return { _id: envPano.environmentId }
        }
      })
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