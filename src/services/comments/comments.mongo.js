
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `comments`. (Can be re-generated.)
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
      authorId: {
        faker: {
          fk: "users"
        },
        bsonType: "objectId"
      },
      postId: {
        faker: {
          fk: "posts"
        },
        bsonType: "objectId"
      },
      body: {
        faker: "lorem.sentence",
        bsonType: "string"
      },
      archived: {
        faker: "random.boolean",
        bsonType: "string"
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
