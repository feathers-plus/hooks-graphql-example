
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

module.exports = {s, r, q, o, a, SDL };

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
