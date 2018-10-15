
/* eslint-disable no-unused-vars */
// Define GraphQL resolvers using Feathers services and BatchLoaders. (Can be re-generated.)
const { getByDot, setByDot } = require('feathers-hooks-common');
// !code: imports // !end
// !code: init // !end

let moduleExports = function batchLoaderResolvers(app, options) {
  // eslint-disable-next-line
  let { convertArgsToParams, convertArgsToFeathers, extractAllItems, extractFirstItem,
    feathersBatchLoader: { feathersBatchLoader } } = options;

  // !<DEFAULT> code: max-batch-size
  let defaultPaginate = app.get('paginate');
  let maxBatchSize = defaultPaginate && typeof defaultPaginate.max === 'number' ?
    defaultPaginate.max : undefined;
  // !end

  // !<DEFAULT> code: extra_auth_props
  const convertArgs = convertArgsToFeathers([]);
  // !end

  // !<DEFAULT> code: services
  let comments = app.service('/comments');
  let likes = app.service('/likes');
  let posts = app.service('/posts');
  let relationships = app.service('/relationships');
  let users = app.service('/users');
  // !end

  // !<DEFAULT> code: get-result
  // Given a fieldName in the parent record, return the result from a BatchLoader
  // The result will be an object (or null), or an array of objects (possibly empty).
  function getResult(batchLoaderName, fieldName, isArray) {
    const contentByDot = `batchLoaders.${batchLoaderName}`;

    // `content.app = app` is the Feathers app object.
    // `content.batchLoaders = {}` is where the BatchLoaders for a request are stored.
    return (parent, args, content, ast) => {
      let batchLoader = getByDot(content, contentByDot);

      if (!batchLoader) {
        batchLoader = getBatchLoader(batchLoaderName, parent, args, content, ast);
        setByDot(content, contentByDot, batchLoader);
      }

      const returns1 = batchLoader.load(parent[fieldName]);
      return !isArray ? returns1 : returns1.then(result => result || []);
    };
  }
  // !end

  // A transient BatchLoader can be created only when (one of) its resolver has been called,
  // as the BatchLoader loading function may require data from the 'args' passed to the resolver.
  // Note that each resolver's 'args' are static throughout a GraphQL call.
  function getBatchLoader(dataLoaderName, parent, args, content, ast) {
    let feathersParams;

    switch (dataLoaderName) {
    /* Persistent BatchLoaders. Stored in `content.batchLoaders._persisted`. */
    // !<DEFAULT> code: bl-persisted
    // case '_persisted.user.one.id': // service user, returns one object, key is field id
    // !end

    /* Transient BatchLoaders shared among resolvers. Stored in `content.batchLoaders._shared`. */
    // !<DEFAULT> code: bl-shared
    // *.*: User
    // case '_shared.user.one.id': // service user, returns one object, key is field id
    // !end

    /* Transient BatchLoaders used by only one resolver. Stored in `content.batchLoaders`. */

    // Comment.author: User!
    // !<DEFAULT> code: bl-Comment-author
    case 'Comment.author':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return users.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Comment.likes: [Like!]
    // !<DEFAULT> code: bl-Comment-likes
    case 'Comment.likes':
      return feathersBatchLoader(dataLoaderName, '[!]', 'commentId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { commentId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return likes.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Like.author: User!
    // !<DEFAULT> code: bl-Like-author
    case 'Like.author':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return users.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Like.comment: Comment!
    // !<DEFAULT> code: bl-Like-comment
    case 'Like.comment':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return comments.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Post.author: User!
    // !<DEFAULT> code: bl-Post-author
    case 'Post.author':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return users.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Post.comments: [Comment!]
    // !<DEFAULT> code: bl-Post-comments
    case 'Post.comments':
      return feathersBatchLoader(dataLoaderName, '[!]', 'postId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { postId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return comments.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Relationship.follower: User!
    // !<DEFAULT> code: bl-Relationship-follower
    case 'Relationship.follower':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return users.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // Relationship.followee: User!
    // !<DEFAULT> code: bl-Relationship-followee
    case 'Relationship.followee':
      return feathersBatchLoader(dataLoaderName, '!', '_id',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { _id: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return users.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // User.posts(query: JSON, params: JSON, key: JSON): [Post!]
    // !<DEFAULT> code: bl-User-posts
    case 'User.posts':
      return feathersBatchLoader(dataLoaderName, '[!]', 'authorId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { authorId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return posts.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // User.comments: [Comment!]
    // !<DEFAULT> code: bl-User-comments
    case 'User.comments':
      return feathersBatchLoader(dataLoaderName, '[!]', 'authorId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { authorId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return comments.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // User.followed_by: [Relationship!]
    // !<DEFAULT> code: bl-User-followed_by
    case 'User.followed_by':
      return feathersBatchLoader(dataLoaderName, '[!]', 'followeeId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { followeeId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return relationships.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // User.following: [Relationship!]
    // !<DEFAULT> code: bl-User-following
    case 'User.following':
      return feathersBatchLoader(dataLoaderName, '[!]', 'followerId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { followerId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return relationships.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    // User.likes: [Like!]
    // !<DEFAULT> code: bl-User-likes
    case 'User.likes':
      return feathersBatchLoader(dataLoaderName, '[!]', 'authorId',
        keys => {
          feathersParams = convertArgs(args, content, null, {
            query: { authorId: { $in: keys }, $sort: undefined },
            _populate: 'skip', paginate: false
          });
          return likes.find(feathersParams);
        },
        maxBatchSize // Max #keys in a BatchLoader func call.
      );
      // !end

    /* Throw on unknown BatchLoader name. */
    default:
      // !<DEFAULT> code: bl-default
      throw new Error(`GraphQL query requires BatchLoader named '${dataLoaderName}' but no definition exists for it.`);
      // !end
    }
  }

  let returns = {

    Comment: {

      // author: User!
      // !<DEFAULT> code: resolver-Comment-author
      author: getResult('Comment.author', 'authorId'),
      // !end

      // likes: [Like!]
      // !<DEFAULT> code: resolver-Comment-likes
      likes: getResult('Comment.likes', '_id', true),
      // !end
    },

    Like: {

      // author: User!
      // !<DEFAULT> code: resolver-Like-author
      author: getResult('Like.author', 'authorId'),
      // !end

      // comment: Comment!
      // !<DEFAULT> code: resolver-Like-comment
      comment: getResult('Like.comment', 'commentId'),
      // !end
    },

    Post: {

      // author: User!
      // !<DEFAULT> code: resolver-Post-author
      author: getResult('Post.author', 'authorId'),
      // !end

      // comments: [Comment!]
      // !<DEFAULT> code: resolver-Post-comments
      comments: getResult('Post.comments', '_id', true),
      // !end
    },

    Relationship: {

      // follower: User!
      // !<DEFAULT> code: resolver-Relationship-follower
      follower: getResult('Relationship.follower', 'followerId'),
      // !end

      // followee: User!
      // !<DEFAULT> code: resolver-Relationship-followee
      followee: getResult('Relationship.followee', 'followeeId'),
      // !end
    },

    User: {

      // fullName: String!
      // !<DEFAULT> code: resolver-User-fullName-non
      fullName: (parent, args, content, ast) => { throw Error('GraphQL fieldName User.fullName is not calculated.'); },
      // !end

      // posts(query: JSON, params: JSON, key: JSON): [Post!]
      // !<DEFAULT> code: resolver-User-posts
      posts: getResult('User.posts', '_id', true),
      // !end

      // comments: [Comment!]
      // !<DEFAULT> code: resolver-User-comments
      comments: getResult('User.comments', '_id', true),
      // !end

      // followed_by: [Relationship!]
      // !<DEFAULT> code: resolver-User-followed_by
      followed_by: getResult('User.followed_by', '_id', true),
      // !end

      // following: [Relationship!]
      // !<DEFAULT> code: resolver-User-following
      following: getResult('User.following', '_id', true),
      // !end

      // likes: [Like!]
      // !<DEFAULT> code: resolver-User-likes
      likes: getResult('User.likes', '_id', true),
      // !end
    },

    // !code: resolver_field_more // !end
    Query: {

      // !<DEFAULT> code: query-Comment
      // getComment(query: JSON, params: JSON, key: JSON): Comment
      getComment(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return comments.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findComment(query: JSON, params: JSON): [Comment!]
      findComment(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return comments.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end

      // !<DEFAULT> code: query-Like
      // getLike(query: JSON, params: JSON, key: JSON): Like
      getLike(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return likes.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findLike(query: JSON, params: JSON): [Like!]
      findLike(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return likes.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end

      // !<DEFAULT> code: query-Post
      // getPost(query: JSON, params: JSON, key: JSON): Post
      getPost(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return posts.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findPost(query: JSON, params: JSON): [Post!]
      findPost(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return posts.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end

      // !<DEFAULT> code: query-Relationship
      // getRelationship(query: JSON, params: JSON, key: JSON): Relationship
      getRelationship(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return relationships.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findRelationship(query: JSON, params: JSON): [Relationship!]
      findRelationship(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return relationships.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end

      // !<DEFAULT> code: query-User
      // getUser(query: JSON, params: JSON, key: JSON): User
      getUser(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return users.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findUser(query: JSON, params: JSON): [User!]
      findUser(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return users.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end
      // !code: resolver_query_more // !end
    },
  };

  // !code: func_return // !end
  return returns;
};

// !code: more // !end

// !code: exports // !end
module.exports = moduleExports;

function paginate(content) {
  return result => {
    content.pagination = !result.data ? undefined : {
      total: result.total,
      limit: result.limit,
      skip: result.skip,
    };

    return result;
  };
}

// !code: funcs // !end
// !code: end // !end
