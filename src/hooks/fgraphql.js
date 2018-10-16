
/* eslint no-console: 0 */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const makeDebug = require('debug');
const runTime = require('@feathers-plus/graphql/lib/run-time');
const { getItems, replaceItems } = require('feathers-hooks-common');
const { parse } = require('graphql');
const { inspect } = require('util');

const debug = makeDebug('fgraphql');

module.exports = function (options1 = {}) {
  debug('init call');
  let resolvers;
  let { query, schema, resolvers: makeResolvers } = options1;

  const options = Object.assign({}, {
    inclAllFieldsServer: true,
    inclAllFieldsClient: true,
  }, options1.options || {});

  if (typeof schema !== 'string') {
    throw new Error(`Schema is typeof ${schema} rather than string. (fgraphql)`);
  }

  const feathersSdl = convertSdlToFeathersSchemaObject(schema);
  debug('schema defn Language converted');

  // Return the actual hook.
  return async (context) => {
    if (context.params.graphql) return context;
    debug(`hook called. type ${context.type} method ${context.method}`);

    query = typeof query !== 'function' ? query : query(context);

    if (!resolvers) {
      resolvers = makeResolvers(context.app, runTime);
      debug(`resolvers have types ${Object.keys(resolvers)}`);
    }

    if (!isObject(query)) {
      throw new Error(`Query is typeof ${query} rather than object. (fgraphql)`);
    }

    if (Object.keys(query).length !== 1) {
      throw new Error('Only 1 type prop allowed at query root. (fgraphql)');
    }

    const type = Object.keys(query)[0];
    const fields = query[type];
    const recs = getItems(context);
    options.inclAllFields = context.provider ?
      options.inclAllFieldsClient : options.inclAllFieldsServer;
    debug(`inclAllField ${options.inclAllFields}`);

    const store = {
      feathersSdl,
      resolvers,
      options,
    };

    await joinRecords(recs, type, fields, store);
    inspector('\n\nfgraphql. records', recs);

    replaceItems(context, recs);
    return context;
  };
};

async function joinRecords(recs, type, fields, store, depth = 0) {
  recs = Array.isArray(recs) ? recs : [recs];
  debug(`joinRecords depth ${depth} #recs ${recs.length} type ${type}`);

  if (!isObject(store.resolvers[type])) {
    throw new Error(`Resolvers for Type ${type} are typeof ${typeof type} not object. (fgraphql)`);
  }

  if (!isObject(fields)) {
    throw new Error(`Fields at Type ${type} are typeof ${typeof fields} not object. (fgraphql)`);
  }

  const fieldNames = Object.keys(fields);

  // for every record
  for (let j = 0, jlen = recs.length; j < jlen; j++) {
    debug(`...type ${type} rec# ${j}`);

    const rec = recs[j];
    const includes = [];
    let includesHasRecFields = false;

    // for every joined field
    for (let i = 0, ilen = fieldNames.length; i < ilen; i++) {
      const fieldName = fieldNames[i];
      debug(`.type ${type} rec# ${j} field# ${i} name ${fieldName}`);

      if (fieldName !== '_args') {
        includes.push(fieldName);

        if (store.resolvers[type][fieldName]) {
          debug('has resolver');
          await resolverExists();
        } else {
          debug('no resolver');
          includesHasRecFields = true;
        }
      }

      // eslint-disable-next-line no-inner-declarations
      async function resolverExists() {
        if (typeof store.resolvers[type][fieldName] !== 'function') {
          throw new Error(`Resolver for Type ${type} field ${fieldName} is typeof ${typeof type} not function. (fgraphql)`);
        }

        const args = fields[fieldName]._args; // undefined is OK
        if (args) debug(`resolver args ${JSON.stringify(args)}`);

        rec[fieldName] = await store.resolvers[type][fieldName](rec, args || {}, {});
        debug(`resolver returned ${Array.isArray(rec[fieldName]) ? `${rec[fieldName].length} recs` : 'one obj'}`);

        const nextType = store.feathersSdl[type][fieldName].typeof;
        debug(`.type ${type} rec# ${j} field# ${i} name ${fieldName} next type ${nextType}`);

        if (store.resolvers[nextType] && isObject(fields[fieldName])) { // ignore String, etc.
          await joinRecords(rec[fieldName], nextType, fields[fieldName], store, depth + 1);
        }
      }
    }

    // Retain only record fields selected
    debug(`field names found ${includesHasRecFields} incl names ${includes}`);
    if (includesHasRecFields || !store.options.inclAllFields) {
      // recs[0] may have been created by [rec] so can't replace array elem
      const oldRec = recs[j];
      const oldRecProps = Object.keys(oldRec);

      oldRecProps.forEach(key => {
        if (!includes.includes(key)) {
          delete oldRec[key];
        }
      });
    }
  }
}

function convertSdlToFeathersSchemaObject(schemaDefinitionLanguage) {
  return convertDocument(parse(schemaDefinitionLanguage));
}

function convertDocument(ast) {
  const result = {};

  if (ast.kind !== 'Document' || !Array.isArray(ast.definitions)) {
    throw new Error('Not a valid GraphQL Document.');
  }

  ast.definitions.forEach((definition, definitionIndex) => {
    const [objectName, converted] = convertObjectTypeDefinition(definition, definitionIndex);

    if (objectName) {
      result[objectName] = converted;
    }
  });

  return result;
}

function convertObjectTypeDefinition(definition, definitionIndex) {
  const converted = {};

  if (definition.kind !== 'ObjectTypeDefinition' || !Array.isArray(definition.fields)) {
    throw new Error(`Type# ${definitionIndex} is not a valid ObjectTypeDefinition`);
  }

  const objectTypeName = convertName(definition.name, `Type# ${definitionIndex}`);
  if (objectTypeName === 'Query') return [null, null];

  definition.fields.forEach(field => {
    const [fieldName, fieldDefinition] = convertFieldDefinition(field, `Type ${objectTypeName}`);
    converted[fieldName] = fieldDefinition;
  });

  return [objectTypeName, converted];
}

function convertName(nameObj, errDesc) {
  if (!isObject(nameObj) || typeof nameObj.value !== 'string') {
    throw new Error(`${errDesc} does not have a valid name prop.`);
  }

  return nameObj.value;
}

function convertFieldDefinition(field, errDesc) {
  if (field.kind !== 'FieldDefinition' || !isObject(field.type)) {
    throw new Error(`${errDesc} is not a valid ObjectTypeDefinition`);
  }

  const fieldName = convertName(field.name, errDesc);
  const converted = convertFieldDefinitionType(field.type, errDesc);
  converted.inputValues = !!field.arguments;

  return [fieldName, converted];
}

function convertFieldDefinitionType(fieldDefinitionType, errDesc, converted) {
  converted = converted ||  { nonNullTypeList: false, listType: false, nonNullTypeField: false, typeof: null };

  if (!isObject(fieldDefinitionType)) {
    throw new Error(`${errDesc} is not a valid Fielddefinition "type".`);
  }

  switch (fieldDefinitionType.kind) {
  case 'NamedType':
    converted.typeof = convertName(fieldDefinitionType.name);
    return converted;
  case 'NonNullType':
    if (fieldDefinitionType.type.kind === 'NamedType') {
      converted.nonNullTypeField = true;
    } else {
      converted.nonNullTypeList = true;
    }

    return convertFieldDefinitionType(fieldDefinitionType.type, errDesc, converted);
  case 'ListType':
    converted.listType = true;
    return convertFieldDefinitionType(fieldDefinitionType.type, errDesc, converted);
  }
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function inspector(desc, obj) {
  console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 9 }));
}
