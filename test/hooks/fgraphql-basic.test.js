
/* eslint no-console: 0 */
const runTime = require('@feathers-plus/graphql/lib/run-time');
const { assert } = require('chai');
const { parse } = require('graphql');
const fgraphql = require('../../src/hooks/fgraphql');

describe('fgraphql-basic.test.js', () => {
  describe('basic tests', () => {
    /* eslint-disable */
    const beforeJane =  () => ({ type: 'before', data:   {  first: 'Jane',    last: 'Doe' } });
    const afterJane =   () => ({ type: 'after',  result: {  first: 'Jane',    last: 'Doe' } });

    const decisionTable = [
      // Test options
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['schema str',  s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema fcn',  s('fcn'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['schema obj',  s('obj'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query str',   s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['query fcn',   s('str'),  r('full'),   'User',     q('fcn'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['opt server-', s('str'),  r('full'),   'User',     q('obj'),   o('server-'), afterJane(),  false,  a('janeFull-') ],
      ['opt client-', s('str'),  r('full'),   'User',     q('obj'),   o('client-'), afterJane(),  true,   a('janeFull-') ],
      ['before hook', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeFull')  ],
      // Test conversion of resolver results
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['undef->null', s('cnv0'), r('undefin'),'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeNull')  ],
      ['undef->array',s('cnv1'), r('undefin'),'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeArray0')],
      ['obj->array',  s('cnv1'), r('full'),   'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeArray') ],
      ['array->obj',  s('str'),  r('array1'), 'User',     q('obj'),   o('both'),    beforeJane(), false,  a('janeFull')  ],
      // Test error checking
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['x schema',    s('err1'), r('full'),   'User',     1,          o('both'),    afterJane(),  false,  101            ],
      ['x query',     s('str'),  r('full'),   'User',     q('err1'),  o('both'),    afterJane(),  false,  102            ],
      ['x hook type', s('str'),  r('full'),   'Userxxx',  q('obj'),   o('both'),    afterJane(),  false,  104            ],
      ['x context',   s('str'),  r('full'),   'User',     q('obj'),   o('prop-'),   afterJane(),  false,  105            ],
      ['x reso func', s('str'),  r('err1'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  203            ],
      ['x array len2',s('str'),  r('array2'), 'User',     q('obj'),   o('both'),    afterJane(),  false,  204            ],
      // Test features not available in GraphQL
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['normal',      s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['chge parent', s('str'),  r('parent'), 'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeMess')  ],
      ['value 1',     s('str'),  r('full'),   'User',     q('value1'),o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['value 0',     s('str'),  r('full'),   'User',     q('value0'),o('both'),    afterJane(),  false,  a('jane0')     ],
      ['value falsey',s('str'),  r('full'),   'User',     q('falsey'),o('both'),    afterJane(),  false,  a('janeFalsey')],
      ['incl flds 1', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    afterJane(),  false,  a('janeFull')  ],
      ['incl flds s', s('str'),  r('full'),   'User',     q('obj'),   o('server-'), afterJane(),  false,  a('janeFull-') ],
      ['incl flds c', s('str'),  r('full'),   'User',     q('obj'),   o('client-'), afterJane(),  true,   a('janeFull-') ],
      ['_none',       s('str'),  r('full'),   'User',     q('none'),  o('both'),    afterJane(),  false,  a('janeFull-') ],
      // Test join type at top level #2
      // desc,        schema,    resolvers,   recordType, query,      options,      context,      client, result
      ['1 post',      s('S2'),   r('S2'),     'User',     q('S2post'),o('both'),    afterJane(),  false,  a('S2post')    ],
      ['1 comment',   s('S2'),   r('S2'),     'User',     q('S2comm'),o('both'),    afterJane(),  false,  a('S2comm')    ],
      ['l both',      s('S2'),   r('S2'),     'User',     q('S2both'),o('both'),    afterJane(),  false,  a('S2both')    ],
      ['1 post args', s('S2'),   r('S2'),     'User',     q('S2parm'),o('both'),    afterJane(),  false,  a('S2parm')    ],
      ['1 post cont', s('S2'),   r('S2'),     'User',     q('S2parm'),o('prop+'),   afterJane(),  false,  a('S2cont')    ],
      // Test join type at level #3
      // desc,        schema,    resolvers,   recordType, query,      options,      ontext,      client, result
      ['2 all',       s('S3'),   r('S3'),     'User',     q('S3all'), o('both'),    afterJane(),  false,  a('S3all')     ],
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
            parse, runTime, schema, resolvers, recordType, query, options
          })(context);

          if (!isObject(result)) {
            assert(false, `Unexpected success. Expected ${result}.`);
          } else {
            //inspector('result=', result);
            //inspector('actual=', newContext.data || newContext.result);
            assert.deepEqual(newContext.data || newContext.result, result, 'unexpected result');
          }
        } catch(err) {
          if (err.message.substr(0, 19) === 'Unexpected success.') {
            throw err;
          }

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

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

// schemas
function s(typ) {
  const SDL1 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  fullName: String!
}`;

  const S2 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  posts: [Post]
  comments: [Comment]
}
type Post {
  _id: ID
  body: String
}
type Comment {
  _id: ID
  comment: String
}`;


  const S3 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  posts: [Post]
  comments: [Comment]
}
type Post {
  _id: ID
  body: String
  author: User
}
type Comment {
  _id: ID
  comment: String
  author: User
}`;

  const C0 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  fullName: String
}`;

  const C1 = `
type User {
  _id: ID
  firstName: String
  lastName: String
  fullName: [String]
}`;

  switch (typ) {
    case 'str':
      return SDL1;
    case 'cnv0':
      return C0;
    case 'cnv1':
      return C1;
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

    case 'S2':
      return S2;
    case 'S3':
      return S3;
    default:
      throw new Error(`Invalid typ ${typ} for "s" function.`);
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

      case 'array2':
        return {
          User: {
            fullName: () => [{ fullName: 'foo' }, { fullName: 'foo' }],
          }
        };
      case 'undefin':
        return {
          User: {
            fullName: () => undefined,
          }
        };
      case 'array1':
        return {
          User: {
            fullName: parent => [`${parent.first} ${parent.last}`],
          }
        };

      case 'S2':
        return {
          User: {
            // posts: [Post]
            posts:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return [
                  { _id: '1001', body: 'foo body' },
                  { _id: (args.params || content.foo || {})._id || '1002', body: 'bar body' },
                ];
              },
            // comments: [Comment]
            comments:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return [
                  { _id: '2001', comment: 'foo comment' },
                  { _id: '2002', comment: 'bar comment' },
                ];
              },
          },
          Post: {}
        };

      case 'S3':
        return {
          User: {
            // posts: [Post]
            posts:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return [
                  { _id: '1001', body: 'foo body' },
                  { _id: (args.params || {})._id || '1002', body: 'bar body' },
                ];
              },
            // comments: [Comment]
            comments:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return [
                  { _id: '2001', comment: 'foo comment' },
                  { _id: '2002', comment: 'bar comment' },
                ];
              },
          },
          Post: {
            // author: User
            author:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return { _id: '3001', first: 'Jane', last: 'Doe' };
              },
          },
          Comment: {
            // author: User
            author:
              (parent, args, content, ast) => { // eslint-disable-line no-unused-vars
                return { _id: '4001', first: 'Jane', last: 'Doe' };
              },
          }
        };
      default:
        throw new Error(`Invalid typ ${typ} for "r" function.`);
    }
  };
}

// query
function q(typ) {
  switch (typ) {
    /* eslint-disable */
    case 'obj':
      return        { fullName: {}                                    }   ;
    case 'none':
      return        { fullName: {},                        _none: {}  }   ;
    case 'value1':
      return        { fullName: 1,  first: 1,    last: 1              }   ;
    case 'value0':
      return        { fullName: 0,  first: 1,    last: 0              }   ;
    case 'falsey':
      return        { fullName: '', first: null, last: 1              }   ;
    case 'fcn':
      return () => ({ fullName: {}                                    }  );
    case 'err1':
      return undefined;

    case 'S2post':
      return { posts: {}               }   ;
    case 'S2comm':
      return {            comments: {} }   ;
    case 'S2both':
      return { posts: {}, comments: {} }   ;
    case 'S2parm':
      return {
        posts: {
          _args: { params: { _id: '9999' } }
        }
      };
    case 'S2cont':
      return {
        posts: {}
      };

    case 'S3all':
      return {
        posts: {
          author: {}
        },
        comments: {
          author: {}
        }
      };

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
    default:
      throw new Error(`Invalid typ ${typ} for "q" function.`);
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
    case 'server-':
      return { inclAllFieldsServer: false };
    case 'client-':
      return { inclAllFieldsClient: false };
    case 'loop':
      return { skipHookWhen: () => false  };
    case 'prop-':
      return {
        inclAllFieldsServer: true,
        inclAllFieldsClient: true,
        extraAuthProps: 1,
      };
    case 'prop+':
      return {
        inclAllFieldsServer: true,
        inclAllFieldsClient: true,
        extraAuthProps: ['foo']
      };
    default:
      throw new Error(`Invalid typ ${typ} for "o" function.`);
  }
}

// results
function a(typ) {
  switch (typ) {
    /* eslint-disable */
    case 'janeNull' :
      return { first: 'Jane', last: 'Doe', fullName: null         };
    case 'janeFull' :
      return { first: 'Jane', last: 'Doe', fullName: 'Jane Doe'   };
    case 'janeArray' :
      return { first: 'Jane', last: 'Doe', fullName: ['Jane Doe'] };
    case 'janeArray0' :
      return { first: 'Jane', last: 'Doe', fullName: []           };
    case 'janeFull-' :
      return {                             fullName: 'Jane Doe'   };
    case 'janeMess' :
      return { first: 'foo',  last: 'Doe', fullName: 'Jane Doe'   };
    case 'jane0' :
      return { first: 'Jane'                                      };
    case 'janeFalsey' :
      return {                last: 'Doe'                         };

    case 'S2post' :
      return {
        first: 'Jane',
        last: 'Doe',
        posts: [
          { _id: '1001', body: 'foo body' },
          { _id: '1002', body: 'bar body' },
        ]
      };
    case 'S2parm' :
      return {
        first: 'Jane',
        last: 'Doe',
        posts: [
          { _id: '1001', body: 'foo body' },
          { _id: '9999', body: 'bar body' },
        ]
      };
    case 'S2comm' :
      return {
        first: 'Jane',
        last: 'Doe',
        comments: [
          { _id: '2001', comment: 'foo comment' },
          { _id: '2002', comment: 'bar comment' },
        ]
      };
    case 'S2cont' :
      return {
        first: 'Jane',
        last: 'Doe',
        posts: [
          { _id: '1001', body: 'foo body' },
          { _id: '9999', body: 'bar body' },
        ]
      };
    case 'S2both' :
      return {
        first: 'Jane',
        last: 'Doe',
        posts: [
          { _id: '1001', body: 'foo body' },
          { _id: '1002', body: 'bar body' },
        ],
        comments: [
          { _id: '2001', comment: 'foo comment' },
          { _id: '2002', comment: 'bar comment' },
        ]
      };

    case 'S3all' :
      return {
        first: 'Jane',
        last: 'Doe',
        posts: [
          { _id: '1001',
            body: 'foo body',
            author: { _id: '3001', first: 'Jane', last: 'Doe' }
          },
          {
            _id: '1002',
            body: 'bar body',
            author: { _id: '3001', first: 'Jane', last: 'Doe' }
          }
        ],
        comments: [
          { _id: '2001',
            comment: 'foo comment',
            author: { _id: '4001', first: 'Jane', last: 'Doe' }
          },
          {
            _id: '2002',
            comment: 'bar comment',
            author: { _id: '4001', first: 'Jane', last: 'Doe' }
          }
        ]
      }

    default:
      throw new Error(`Invalid typ ${typ} for "a" function.`);
  }
  /* eslint-enable */
}
