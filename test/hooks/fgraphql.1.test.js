
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
      // desc,                      context,       method,   provider,  args,            result
      ['before::create',            beforeJohn(),  'create', null,      ['first'],       { last: 'Doe' }                        ],
      ['after::find with paginate', afterPage(),   'find',   null,      ['last'],        [{ first: 'John' }, { first: 'Jane' }] ],
      ['after::find no paginate',   afterBoth(),   'find',   null,      ['last'],        [{ first: 'John' }, { first: 'Jane' }] ],
      ['after',                     afterJane(),   'create', null,      ['last'],        { first: 'Jane'}                       ],
      ['call internally on server', afterJane(),   'create', undefined, ['last'],        { first: 'Jane'}                       ],
      ['not throw field missing',   beforeJohn(),  'create', 'rest',    ['first', 'xx'], { last: 'Doe' }                        ],
      ['not throw field undefined', beforeUndef(), 'create', 'rest',    ['first'],       { first: undefined, last: 'Doe' }      ], // ???
      ['not throw field null',      beforeNull(),  'create', 'rest',    ['first'],       { last: 'Doe' }                        ],
    ];
    /* eslint-enable */

    //decisionTable.forEach(([desc, context, method, provider, args, result]) => {
    it('test', async () => {
      const recs = await fgraphql({
        schema: s('str'),
        resolvers: r('name'),
        recordType: 'User',
        query: q(1),
        options: o('both'),
      })(afterJane());

      console.log(recs);
    });
    //});
  });
});

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
  }
}

function r(typ) {
  return function resolvers (app, options) { // eslint-disable-line no-unused-vars
    const {convertArgsToFeathers, extractAllItems, extractFirstItem} = options;  // eslint-disable-line no-unused-vars
    const convertArgs = convertArgsToFeathers([]);  // eslint-disable-line no-unused-vars
    //  let comments = app.service('/comments');

    switch (typ) {
    case 'name':
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

function q(typ) {
  switch (typ) {
  case 1:
    return {
      User: {
        fullName: {},
      }
    };
  case 2:
    return () => ({
      User: {
        fullName: {},
      }
    });
  case '9':
    return {
      User: {
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
      }
    };
  }
}

function o(typ) {
  switch (typ) {
  case 'both':
    return {
      inclAllFieldsServer: true,
      inclAllFieldsClient: true,
    };
  case 'server':
    return {
      inclAllFieldsServer: true,
      inclAllFieldsClient: false,
    };
  case 'client':
    return {
      inclAllFieldsServer: false,
      inclAllFieldsClient: true,
    };
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
