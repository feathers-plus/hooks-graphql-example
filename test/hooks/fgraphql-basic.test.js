
/* eslint no-console: 0 */
const { assert } = require('chai');
const { parse } = require('graphql');
const fgraphql = require('../../src/hooks/fgraphql');

// ********************************* error when neither resolver nor record field exists for name
// decide if allow foo name or _ignore_other_fields

describe('fgraphql-basic.test.js', () => {
  describe('basic tests', () => {
    /* eslint-disable */
    const beforeJohn  = () => ({ type: 'before', data:   {  first: 'John',    last: 'Doe' } });
    const beforeUndef = () => ({ type: 'before', data:   {  first: undefined, last: 'Doe' } });
    const beforeNull =  () => ({ type: 'before', data:   {  first: null,      last: 'Doe' } });
    const beforeJane =  () => ({ type: 'before', data:   {  first: 'Jane',    last: 'Doe' } });
    const afterJane =   () => ({ type: 'after',  result: {  first: 'Jane',    last: 'Doe' } });
    const afterBoth =   () => ({ type: 'after',  result: [{ first: 'John',    last: 'Doe' }, { first: 'Jane', last: 'Doe' }] });
    const afterPage =   () => ({ type: 'after',  result: { total: 2, skip: 0, data: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }] } });

    const decisionTable = [
      // Test options
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['schema str',  s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema fcn',  s('fcn'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema obj',  s('obj'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query str',   s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query str+',  s('str'),  r('full'),   'User',     q('obj+'),  o('graph'),   afterJane(),  false,  a('janeFull')  ],
      ['query fcn',   s('str'),  r('full'),   'User',     q('fcn'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query fcn+',  s('str'),  r('full'),   'User',     q('fcn+'),  o('graph'),   afterJane(),  false,  a('janeFull')  ],
      ['opt server-', s('str'),  r('full'),   'User',     q('obj'),   o('server-'), afterJane(),  false,  a('janeFull-') ],
      ['opt client-', s('str'),  r('full'),   'User',     q('obj'),   o('client-'), afterJane(),  true,   a('janeFull-') ],
      ['before hook', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeFull')  ],
      // Test error checking
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['x schema',    s('err1'), r('full'),   'User',     q('obj+'),  o('graph'),   afterJane(),  false,  101            ],
      ['x query',     s('str'),  r('full'),   'User',     q('err1'),  o('both'),    afterJane(),  false,  102            ],
      ['x quer mult', s('str'),  r('full'),   'User',     q('err2'),  o('both'),    afterJane(),  false,  103            ],
      ['x hook type', s('str'),  r('full'),   'Userxxx',  q('obj'),   o('both'),    afterJane(),  false,  104            ],
      ['x reso func', s('str'),  r('err1'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  203            ],
      // Test features not available in GraphQL
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['ok findUser', s('str'),  r('full'),   'User',     q('obj+'),  o('graph'),   afterJane(),  false,  a('janeFull')  ],
      ['no findUser', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['mess parent', s('str'),  r('parent'), 'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeMess')  ],
      ['opt {} 1',    s('str'),  r('full'),   'User',     q('any1'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['opt {} 2',    s('str'),  r('full'),   'User',     q('any2'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['opt {} 3',    s('str'),  r('full'),   'User',     q('any3'),  o('both'),    afterJane(),  false,  a('janeFull')  ],
      // Test recursion
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['posts',       s('SDL2'), r('SDL2'),   'User',     q('SDL2a'), o('both'),    afterJane(),  false,  a('janeSDL2')  ],
    ];
    /* eslint-enable */

    decisionTable.forEach(([desc, schema, resolvers, recordType, query, options, context, client, result]) => {
      it(desc, async () => {
        context.params = context.params || {};
        if (client) {
          context.params.provider = 'socketio';
        }

        try {
          const newContext = await fgraphql({
            parse, schema, resolvers, recordType, query, options
          })(context);

          if (!isObject(result)) {
            assert(false, `Unexpected success. Expected ${result}.`);
          } else {
            console.log('result=', result);
            console.log('actual=', newContext.data || newContext.result);
            assert.deepEqual(newContext.data || newContext.result, result, 'unexpected result');
          }
        } catch(err) {
          if (err.message.substr(0, 19) === 'Unexpected success.') return err;

          if (isObject(result)) {
            assert(false, `unexpected fail: ${err.message}`);
            return;
          }

          assert.strictEqual(err.code, result, `unexpected error: ${err.message}`);
        }
      });
    });
  });
});

// schemas
function s(typ) {
  const SDL1 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  fullName: String!
}`;

  const SDL2 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  _id: ID
  body: String
}`;

  switch (typ) {
  case 'str':
    return SDL1;
  case 'fcn':
    return () => SDL1;
  case 'obj':
    return {
      User : {
        firstName: { typeof: 'String' },
        lastName: { typeof: 'String' },
        fullName: { nonNullTypeField: true, typeof: 'String' },
      },
    };
  case 'err1':
    return () => null;

  case 'SDL2':
    return SDL2;
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
    case 'parent':
      return {
        User: {
          // fullName: String!
          fullName:
            (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
              const returns = `${parent.first} ${parent.last}`;
              parent.first = 'foo';
              return returns;
            },
        }
      };
    case 'err1':
      return { User: { fullName: 'foo' } };

    case 'SDL2':
      return {
        User: {
          // posts: [Post]
          posts:
            (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
              console.log('SDL2 User posts');
              return [
                { _id: '1001', body: 'foo' },
                { _id: '1002', body: 'bar' },
              ];
            },
        },
        Post: {}
      };
    }
  };
}

// query
function q(typ) {
  switch (typ) {
  /* eslint-disable */
  case 'obj':
    return                    { fullName: {}        }   ;
  case 'any1':
    return                    { fullName: null      }   ;
  case 'any2':
    return                    { fullName: undefined }   ;
  case 'any3':
    return                    { fullName: '' }   ;
  case 'obj+':
    return        { findUser: { fullName: {} } } ;
  case 'fcn':
    return () => (            { fullName: {} }  );
  case 'fcn+':
    return () => ({ findUser: { fullName: {} } });
  case 'err1':
    return undefined;
  case 'err2':
    return {
      findUser: { fullName: {} },
      getUser:  {}
    };

  case 'SDL2a':
    return { posts: {} }   ;

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
    /* eslint-enable */
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
  case 'graph':
    return { queryIsProperGraphQL: true };
  case 'server-':
    return { inclAllFieldsServer: false };
  case 'client-':
    return { inclAllFieldsClient: false };
  case 'loop':
    return { skipHookWhen: () => false  };
  }
}

// results
function a(typ) {
  switch (typ) {
  /* eslint-disable */
  case 'janeFull' :
    return { first: 'Jane', last: 'Doe', fullName: 'Jane Doe' };
  case 'janeFull-' :
    return {                             fullName: 'Jane Doe' };
  case 'janeMess' :
    return { first: 'foo',  last: 'Doe', fullName: 'Jane Doe' };

  case 'janeSDL2' :
    return { first: 'Jane', last: 'Doe', posts: [
        { _id: '1001', body: 'foo' },
        { _id: '1002', body: 'bar' },
      ] };
  }
  /* eslint-enable */
}

// eslint-disable-next-line no-unused-vars
const SDL = `
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

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}