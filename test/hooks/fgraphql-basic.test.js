
/* eslint no-console: 0 */
const { assert } = require('chai');
const { parse } = require('graphql');
const fgraphql = require('../../src/hooks/fgraphql');
const {s, r, q, o, c, a, SDL } = require('../../test-helpers/fgraphql-basic-helpers.js'); // eslint-disable-line no-unused-vars

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
      // desc,        schema,    resolvers,   recordType, query,      options,      content, context,      client, result
      ['schema str',  s('str'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['schema fcn',  s('fcn'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['schema obj',  s('obj'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['query str',   s('str'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['query str+',  s('str'),  r('full'),   'User',     q('obj+'),  o('graph'),   null,    afterJane(),  false,  a('janeFull')  ],
      ['query fcn',   s('str'),  r('full'),   'User',     q('fcn'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['query fcn+',  s('str'),  r('full'),   'User',     q('fcn+'),  o('graph'),   null,    afterJane(),  false,  a('janeFull')  ],
      ['opt server-', s('str'),  r('full'),   'User',     q('obj'),   o('server-'), null,    afterJane(),  false,  a('janeFull-') ],
      ['opt client-', s('str'),  r('full'),   'User',     q('obj'),   o('client-'), null,    afterJane(),  true,   a('janeFull-') ],
      ['before hook', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    null,    beforeJane(), false,  a('janeFull')  ],
      // Test error checking
      // desc,        schema,    resolvers,   recordType, query,      options,      content, context,      client, result
      ['x schema',    s('err1'), r('full'),   'User',     q('obj+'),  o('graph'),   null,    afterJane(),  false,  101            ],
      ['x query',     s('str'),  r('full'),   'User',     q('err1'),  o('both'),    null,    afterJane(),  false,  102            ],
      ['x quer mult', s('str'),  r('full'),   'User',     q('err2'),  o('graph'),   null,    afterJane(),  false,  103            ],
      ['x hook type', s('str'),  r('full'),   'Userxxx',  q('obj'),   o('both'),    null,    afterJane(),  false,  104            ],
      ['x context',   s('str'),  r('full'),   'User',     q('obj+'),  o('both'),    1,       afterJane(),  false,  105            ],
      ['x reso func', s('str'),  r('err1'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  203            ],
      // Test features not available in GraphQL
      // desc,        schema,    resolvers,   recordType, query,      options,      content, context,      client, result
      ['ok findUser', s('str'),  r('full'),   'User',     q('obj+'),  o('graph'),   null,    afterJane(),  false,  a('janeFull')  ],
      ['no findUser', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['chge parent', s('str'),  r('parent'), 'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeMess')  ],
      ['value 1',     s('str'),  r('full'),   'User',     q('value1'),o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['value 0',     s('str'),  r('full'),   'User',     q('value0'),o('both'),    null,    afterJane(),  false,  a('jane0')     ],
      ['value falsey',s('str'),  r('full'),   'User',     q('falsey'),o('both'),    null,    afterJane(),  false,  a('janeFalsey')],
      ['incl flds 1', s('str'),  r('full'),   'User',     q('obj'),   o('both'),    null,    afterJane(),  false,  a('janeFull')  ],
      ['incl flds s', s('str'),  r('full'),   'User',     q('obj'),   o('server-'), null,    afterJane(),  false,  a('janeFull-') ],
      ['incl flds c', s('str'),  r('full'),   'User',     q('obj'),   o('client-'), null,    afterJane(),  true,   a('janeFull-') ],
      ['_none',       s('str'),  r('full'),   'User',     q('none'),  o('both'),    null,    afterJane(),  false,  a('janeFull-') ],
      // Test join type at top level #2
      // desc,        schema,    resolvers,   recordType, query,      options,      content, context,      client, result
      ['1 post',      s('S2'),   r('S2'),     'User',     q('S2post'),o('both'),    null,    afterJane(),  false,  a('S2post')    ],
      ['1 comment',   s('S2'),   r('S2'),     'User',     q('S2comm'),o('both'),    null,    afterJane(),  false,  a('S2comm')    ],
      ['l both',      s('S2'),   r('S2'),     'User',     q('S2both'),o('both'),    null,    afterJane(),  false,  a('S2both')    ],
      ['1 post args', s('S2'),   r('S2'),     'User',     q('S2parm'),o('both'),    null,    afterJane(),  false,  a('S2parm')    ],
      ['1 post cont', s('S2'),   r('S2'),     'User',     q('S2parm'),o('both'),    c('ok'), afterJane(),  false,  a('S2cont')    ],
      // Test join type at level #3
      // desc,        schema,    resolvers,   recordType, query,      options,      content, context,      client, result
      ['2 all',       s('S3'),   r('S3'),     'User',     q('S3all'), o('both'),    null,    afterJane(),  false,  a('S3all')     ],
    ];
    /* eslint-enable */

    decisionTable.forEach(([desc, schema, resolvers, recordType, query, options, resolverContent, context, client, result]) => {
      it(desc, async () => {
        context.params = context.params || {};
        if (client) {
          context.params.provider = 'socketio';
        }

        try {
          const newContext = await fgraphql({
            parse, schema, resolvers, recordType, query, options,
            resolverContent: resolverContent ? resolverContent : undefined
          })(context);

          if (!isObject(result)) {
            assert(false, `Unexpected success. Expected ${result}.`);
          } else {
            inspector('result=', result);
            inspector('actual=', newContext.data || newContext.result);
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

const { inspect } = require('util');
function inspector(desc, obj) {
  console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 9 }));
}
