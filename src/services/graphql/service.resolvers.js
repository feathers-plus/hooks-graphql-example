
/* eslint-disable no-unused-vars, indent */
// Define GraphQL resolvers using only Feathers services. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let moduleExports = function serviceResolvers(app, options) {
  const {convertArgsToFeathers, extractAllItems, extractFirstItem} = options;
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

  let returns = {

    Comment: {

      // author: User!
      author:
        // !<DEFAULT> code: resolver-Comment-author
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.authorId }, paginate: false
          });
          return users.find(feathersParams).then(extractFirstItem);
        },
        // !end

      // likes: [Like!]
      likes:
        // !<DEFAULT> code: resolver-Comment-likes
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { commentId: parent._id, $sort: undefined }, paginate: false
          });
          return likes.find(feathersParams).then(extractAllItems);
        },
        // !end
    },

    Like: {

      // author: User!
      author:
        // !<DEFAULT> code: resolver-Like-author
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.authorId }, paginate: false
          });
          return users.find(feathersParams).then(extractFirstItem);
        },
        // !end

      // comment: Comment!
      comment:
        // !<DEFAULT> code: resolver-Like-comment
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.commentId }, paginate: false
          });
          return comments.find(feathersParams).then(extractFirstItem);
        },
        // !end
    },

    Post: {

      // author: User!
      author:
        // !code: resolver-Post-author
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.authorId }, paginate: false
          });
          return users.find(feathersParams)
            .then(recs => {
              console.log('..POST AUTHOR parent', parent);
              console.log('..POST AUTHOR feathersParams', feathersParams);
              console.log('..POST AUTHOR Post.author recs=', recs);
              return recs;
            })
            .then(extractFirstItem);
        },
        // !end

      // comments: [Comment!]
      comments:
        // !<DEFAULT> code: resolver-Post-comments
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { postId: parent._id, $sort: undefined }, paginate: false
          });
          return comments.find(feathersParams).then(extractAllItems);
        },
        // !end
    },

    Relationship: {

      // follower: User!
      follower:
        // !<DEFAULT> code: resolver-Relationship-follower
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.followerId }, paginate: false
          });
          return users.find(feathersParams).then(extractFirstItem);
        },
        // !end

      // followee: User!
      followee:
        // !<DEFAULT> code: resolver-Relationship-followee
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.followeeId }, paginate: false
          });
          return users.find(feathersParams).then(extractFirstItem);
        },
        // !end
    },

    User: {

      // fullName: String!
      fullName:
        // !code: resolver-User-fullName-non
        (parent, args, content, ast) => `${parent.firstName} ${parent.lastName}`,
        // !end

      // posts(query: JSON, params: JSON, key: JSON): [Post!]
      posts:
        // !<DEFAULT> code: resolver-User-posts
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { authorId: parent._id, $sort: undefined }, paginate: false
          });
          return posts.find(feathersParams).then(extractAllItems);
        },
        // !end

      // comments: [Comment!]
      comments:
        // !<DEFAULT> code: resolver-User-comments
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { authorId: parent._id, $sort: undefined }, paginate: false
          });
          return comments.find(feathersParams).then(extractAllItems);
        },
        // !end

      // followed_by: [Relationship!]
      followed_by:
        // !<DEFAULT> code: resolver-User-followed_by
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { followeeId: parent._id, $sort: undefined }, paginate: false
          });
          return relationships.find(feathersParams).then(extractAllItems);
        },
        // !end

      // following: [Relationship!]
      following:
        // !<DEFAULT> code: resolver-User-following
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { followerId: parent._id, $sort: undefined }, paginate: false
          });
          return relationships.find(feathersParams).then(extractAllItems);
        },
        // !end

      // likes: [Like!]
      likes:
        // !<DEFAULT> code: resolver-User-likes
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { authorId: parent._id, $sort: undefined }, paginate: false
          });
          return likes.find(feathersParams).then(extractAllItems);
        },
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
