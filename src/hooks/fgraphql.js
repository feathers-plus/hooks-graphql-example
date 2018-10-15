
/* eslint no-console: 0 */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const runTime = require('@feathers-plus/graphql/lib/run-time');
const { getItems, replaceItems } = require('feathers-hooks-common');
const { inspect } = require('util');
const serviceResolvers = require('../services/graphql/service.resolvers');

let resolvers;

//console.log('graphql. app', typeof app);
//console.log('graphql. serviceResolvers', typeof serviceResolvers);
//console.log('graphql. runTime', typeof runTime, Object.keys(runTime));

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  const { query } = options;

  if (!isObject(query)) {
    throw new Error(`Query is typeof ${query} rather than object. (fgraphql)`);
  }

  if (Object.keys(query).length !== 1) {
    throw new Error(`Only 1 type allowed at query root, not ${Object.keys(query).length}. (fgraphql)`);
  }

  // Return the actual hook.
  return async (context) => {
    if (context.params.graphql) return context;
    console.log('++++++ hook called. context.params.graphql=', context.params.graphql);
    if (!resolvers) {
      resolvers = serviceResolvers(context.app, runTime);
      //console.log('fgraphql. resolvers', typeof resolvers, Object.keys(resolvers));
    }

    const type = Object.keys(query)[0];
    const fields = query[type];

    //console.log('fgraphql. type', type);
    //console.log('fgraphql. fields', fields);

    const records = getItems(context);

    await joinRecords(records, resolvers, type, fields);
    inspector('\n\nfgraphql. records', records);

    replaceItems(context, records);
    return context;
  };
};

async function joinRecords(recs, resolvers, type, fields, depth = 0) {
  console.log(`\n===== depth ${depth} type ${type} fields`, fields);
  console.log('.. recs', recs);
  console.log('.. resolvers', resolvers);


  recs = Array.isArray(recs) ? recs : [recs];

  if (!isObject(resolvers[type])) {
    //console.log('.. resolvers.type', type, resolvers[type]);
    throw new Error(`Resolvers for Type ${type} are typeof ${typeof type} not object. (fgraphql)`);
  }

  if (!isObject(fields)) {
    throw new Error(`Fields at Type ${type} are typeof ${typeof fields} not object. (fgraphql)`);
  }

  // for every record
  for (let j = 0, jlen = recs.length; j < jlen; j++) {
    console.log('..record#', j);
    const rec = recs[j];
    const fieldNames = Object.keys(fields);

    // for every joined field
    for (let i = 0, ilen = fieldNames.length; i < ilen; i++) {
      console.log('..field name#', i, fieldNames[i]);
      const fieldName = fieldNames[i];

      if (typeof resolvers[type][fieldName] !== 'function') {
        throw new Error(`Resolver for Type ${type} field ${fieldName} is typeof ${typeof type} not function. (fgraphql)`);
      }

      console.log(`..call resolver ${type} ${fieldName}`);
      rec[fieldName] = await resolvers[type][fieldName](rec, {}, {});
      console.log(`..rec ${j} added field ${i} ${fieldName} containing`, rec[fieldName]);
      //if (depth) throw new Error('stop');

      const newType = {
        fullName: null,
        posts: 'Post',
        author: 'User',
        comments: 'Comment',
        comment: 'Comment',
        followed_by: 'Relationship',
        following: 'Relationship',
        follower: 'User',
        followee: 'User',
        likes: 'Like',

      };

      if (newType[fieldName]) {
        //console.log(`..was type ${type} `);
        await joinRecords(rec[fieldName], resolvers, newType[fieldName], fields[fieldName], depth + 1);
      }
    }
  }
}

// Throw to reject the service call, or on an unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function inspector(desc, obj) {
  console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 9 }));
}
