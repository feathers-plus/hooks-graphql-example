
const { parse } = require('graphql');
const schemaDefinitionLanguage = require('../../services/graphql/graphql.schemas');
const serviceResolvers = require('../../services/graphql/service.resolvers');

const fgraphqlHooks = {
  inclAllFields: fgraphql({
    parse,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query: () => ({ // query or func returning query
      fullName: {
        _args: {},
      },
      posts: {
        _args: {},
        author: {},
        comments: {},
      },
      comments: {
        _args: {},
        author: {},
        likes: {},
      },
      followed_by: {
        _args: {},
        follower: {},
        followee: {},
      },
      following: {
        _args: {},
        follower: {},
        followee: {},
      },
      likes: {
        _args: {},
        author: {},
        comment: {},
      },
    }),
    options: {},
  }),
  inclSelectedFields: fgraphql({
    parse,
    schema: schemaDefinitionLanguage,
    resolvers: serviceResolvers,
    recordType: 'User',
    query: () => ({ // query or func returning query
      id: 1,
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      fullName: {
        _args: {},
      },
      posts: {
        _args: {},
        id: 1,
        _id: 1,
        authorId: 1,
        body: 1,
        draft: 1,
        author: {},
        comments: {},
      },
      comments: {
        _args: {},
        id: 1,
        _id: 1,
        authorId: 1,
        postId: 1,
        body: 1,
        archived: 1,
        author: {},
        likes: {},
      },
      followed_by: {
        _args: {},
        id: 1,
        _id: 1,
        followerId: 1,
        followeeId: 1,
        follower: {},
        followee: {},
      },
      following: {
        _args: {},
        id: 1,
        _id: 1,
        followerId: 1,
        followeeId: 1,
        follower: {},
        followee: {},
      },
      likes: {
        _args: {},
        id: 1,
        _id: 1,
        authorId: 1,
        commentId: 1,
        author: {},
        comment: {},
      },
    }),
    options: {
      inclAllFieldsServer: false,
      inclAllFieldsClient: false,
    },
  })
};

