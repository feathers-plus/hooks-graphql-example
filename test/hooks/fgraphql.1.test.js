
/* eslint no-console: 0 */
const { assert } = require('chai');
const fgraphql = require('../../src/hooks/fgraphql');

// **** skip hook when test
// **** queryIsProperGraphQL
// **** schema as obj, top prop and not

describe('common hook discard', () => {
  describe('removes fields', () => {
    /* eslint-disable */
    const beforeJohn  = () => ({ type: 'before', data:   {  first: 'John',    last: 'Doe' } });
    const beforeUndef = () => ({ type: 'before', data:   {  first: undefined, last: 'Doe' } });
    const beforeNull =  () => ({ type: 'before', data:   {  first: null,      last: 'Doe' } });
    const afterJane =   () => ({ type: 'after',  result: {  first: 'Jane',    last: 'Doe' } });
    const afterBoth =   () => ({ type: 'after',  result: [{ first: 'John',    last: 'Doe' }, { first: 'Jane', last: 'Doe' }] });
    const afterPage =   () => ({ type: 'after',  result: { total: 2, skip: 0, data: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }] } });

    const decisionTable = [
      // desc,        schema,    resolvers,  recordType, query,     options,      context,      client, result
      ['schema str',  s('str'),  r('full'),  'User',     q('str'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema fcn',  s('fcn'),  r('full'),  'User',     q('str'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema obj',  s('obj'),  r('full'),  'User',     q('str'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query str',   s('str'),  r('full'),  'User',     q('str'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query str+',  s('str'),  r('full'),  'User',     q('str+'), o('both+'),   afterJane(),  false,  a('janeFull')  ],
      ['query fcn',   s('str'),  r('full'),  'User',     q('fcn'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query fcn+',  s('str'),  r('full'),  'User',     q('fcn+'), o('both+'),   afterJane(),  false,  a('janeFull')  ],
      ['opt server-', s('str'),  r('full'),  'User',     q('str'),  o('server-'), afterJane(),  false,  a('janeFull-') ],
      ['opt client-', s('str'),  r('full'),  'User',     q('str'),  o('client-'), afterJane(),  true,   a('janeFull-') ],
    ];
    /* eslint-enable */

    decisionTable.forEach(([desc, schema, resolvers, recordType, query, options, context, client, result]) => {
      it(desc, async () => {
        context.params = context.params || {};
        if (client) {
          context.params.provider = 'socketio';
        }

        const newContext = await fgraphql({
          schema, resolvers, recordType, query, options
        })(context);

        assert.deepEqual(newContext.data || newContext.result, result, 'unexpected result');
      });
    });
  });
});

// schemas
function s(typ) {
  const sdl = `
type User {
  _id: ID
  firstName: String
  lastName: String
  fullName: String!
}`;

  switch (typ) {
  case 'str':
    return sdl;
  case 'fcn':
    return () => sdl;
  case 'obj':
    return {
      User : {
        firstName: { typeof: 'String' },
        lastName: { typeof: 'String' },
        fullName: { nonNullTypeField: true, typeof: 'String' },
      },
    };
  }
}

// resolvers
function r(typ) {
  return function resolvers (app, options) { // eslint-disable-line no-unused-vars
    const {convertArgsToFeathers, extractAllItems, extractFirstItem} = options;  // eslint-disable-line no-unused-vars
    const convertArgs = convertArgsToFeathers([]);  // eslint-disable-line no-unused-vars
    //  let comments = app.service('/comments');

    switch (typ) {
    case 'full':
      return {
        User: {
          // fullName: String!
          fullName:
            (parent, args, content, ast) => `${parent.first} ${parent.last}`, // eslint-disable-line no-unused-vars
        }
      };
    }
  };
}

// query
function q(typ) {
  switch (typ) {
  case 'str':
    return { fullName: {} };
  case 'str+':
    return { User: { fullName: {} } };
  case 'fcn':
    return () => ({ fullName: {} });
  case 'fcn+':
    return () => ({ User: { fullName: {} } });
  case 'big1':
    return {
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
    };
  }
}

// options
function o(typ) {
  switch (typ) {
  case 'both':
    return {
      inclAllFieldsServer: true,
      inclAllFieldsClient: true,
    };
  case 'both+':
    return {
      inclAllFieldsServer: true,
      inclAllFieldsClient: true,
      queryIsProperGraphQL: true,
    };
  case 'server-':
    return {
      inclAllFieldsServer: false,
    };
  case 'client-':
    return {
      inclAllFieldsClient: false,
    };
  }
}

// results
function a(typ) {
  switch (typ) {
  case 'janeFull' :
    return { first: 'Jane', last: 'Doe', fullName: 'Jane Doe' };
  case 'janeFull-' :
    return { fullName: 'Jane Doe' };
  }
}

// eslint-disable-next-line no-unused-vars
const sdl = `
type User {
  id: ID
  _id: ID
  email: String
  firstName: String
  lastName: String
  fullName: String!
  posts(query: JSON, params: JSON, key: JSON): [Post!]
  comments: [Comment!]
  followed_by: [Relationship!]
  following: [Relationship!]
  likes: [Like!]
}`;
