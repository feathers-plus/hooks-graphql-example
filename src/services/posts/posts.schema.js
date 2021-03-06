
// Define the Feathers schema for service `posts`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Posts',
  description: 'Posts database.',
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    id: { type: 'ID' },
    _id: { type: 'ID' },
    authorId: { type: 'ID', faker: { fk: 'users' } },
    body: { faker: 'lorem.sentence' },
    draft: { type: 'boolean', faker: 'random.boolean' },
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'Post',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'Posts',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !code: graphql_add
      author: { type: 'User!', args: false, relation: { ourTable: 'authorId', otherTable: '_id' } },
      comments: { type: '[Comment!]', args: false, relation: { ourTable: '_id', otherTable: 'postId' } },
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
