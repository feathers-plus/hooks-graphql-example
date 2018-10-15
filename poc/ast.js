
const { parse } = require('graphql');
const { inspect } = require('util');

const userSchema = getUserSchema();

const ast = parse(userSchema);
inspector('ast', ast);
convertAstSchemaToQlSchema(ast);
console.log('5');

function convertAstSchemaToQlSchema(ast) {
  const qlSchema = {};

  if (ast.kind !== 'Document' || !Array.isArray(ast.definitions)) {
    throw new Error('AST is not a valid GraphQL schema.');
  }

  ast.definitions.forEach((defn, d) => {
    if (defn.kind !== 'ObjectTypeDefinition' || typeof defn.name !== 'object' || !Array.isArray(defn.fields)) {
      throw new Error(`Type ${d} is not a valid ObjectTypeDefinition`);
    }

    const typeName = defn.name.value;

    if (typeName === 'Query') return ast;


    ast[typeName] = {};
    console.log('.', typeName);

    defn.fields.forEach((field, f) => {
      let fieldType;
      let nullable;
      let join;

      if (field.kind !== 'FieldDefinition' || typeof field.name !== 'object' || typeof field.type !== 'object') {
        throw new Error(`Type ${typeName} field ${f} is not a valid FieldDefinition`);
      }

      const fieldName = field.name.value;
      //inspector(fieldName, field);

      switch (field.type.kind) {
      case 'NamedType':
        ast[typeName][fieldName] = { name: field.type.name.value, nullable: true, join: false };
        break;
      case 'NonNullType':
        ast[typeName][fieldName] = { name: field.type.type.name.value, nullable: false, join: false };
        break;
      case 'ListType':
        join = true;

        if (field.type.type.kind === 'NonNullType') {
          ast[typeName][fieldName] = { name: field.type.type.type.name.value, nullable: false, join: true };
        } else {
          ast[typeName][fieldName] = { name: field.type.name.value, nullable: true, join: true };
        }
        break;

      }


      if (!ast[typeName][fieldName]) throw new Error('undefined thing')

      console.log('..', fieldName, ast[typeName][fieldName]);
    });
  });
}


function inspector(desc, obj) {
  console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 9 }));
}

function getUserSchema() {
  return `
type User {
  id: ID
  _id: ID
  uuid: Int!
  email: String!
  firstName: String!
  lastName: String!
  comments: [Comment!]
  followed_by: [Relationship!]
  following: [Relationship!]
  fullName: String!
  likes: [Like!]
  posts(query: JSON, params: JSON, key: JSON): [Post!]
}

type Comment {
  id: ID
  _id: ID
  uuid: Int!
  authorUuid: Int!
  postUuid: Int
  body: String
  archived: Int
  author: User!
  likes: [Like!]
}
 
type Like {
  id: ID
  _id: ID
  uuid: Int
  authorUuid: Int
  commentUuid: Int
  author: User!
  comment: Comment!
}
 
type Post {
  id: ID
  _id: ID
  uuid: Int
  authorUuid: Int
  body: String
  draft: Int
  author: User!
  comments: [Comment!]
}
 
type Relationship {
  id: ID
  _id: ID
  uuid: Int
  followerUuid: Int
  followeeUuid: Int
  follower: User!
  followee: User!
}
 
type Query {
  getComment(key: JSON, query: JSON, params: JSON): Comment
  findComment(query: JSON, params: JSON): [Comment]!
  getLike(key: JSON, query: JSON, params: JSON): Like
  findLike(query: JSON, params: JSON): [Like]!
  getPost(key: JSON, query: JSON, params: JSON): Post
  findPost(query: JSON, params: JSON): [Post]!
  getRelationship(key: JSON, query: JSON, params: JSON): Relationship
  findRelationship(query: JSON, params: JSON): [Relationship]!
  getUser(key: JSON, query: JSON, params: JSON): User
  findUser(query: JSON, params: JSON): [User]!
}
`;
}