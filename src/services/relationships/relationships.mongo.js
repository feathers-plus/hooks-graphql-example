
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `relationships`. (Can be re-generated.)
const merge = require('lodash.merge');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      followerUuid: {
        faker: {
          kf: "users"
        },
        bsonType: "objectId"
      },
      followeeUuid: {
        faker: {
          kf: "users"
        },
        bsonType: "objectId"
      }
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
