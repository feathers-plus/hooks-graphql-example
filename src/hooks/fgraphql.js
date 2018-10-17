
/* eslint no-console: 0 */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const makeDebug = require('debug');
const runTime = require('@feathers-plus/graphql/lib/run-time');
const { getItems, replaceItems } = require('feathers-hooks-common');
const { parse } = require('graphql');

const debug = makeDebug('fgraphql');

module.exports = function (options1 = {}) {
  debug('init call');
  let { schema, query } = options1;
  const { resolvers, recordType } = options1;
  let ourResolvers;

  const options = Object.assign({}, {
    skipHookWhen: context => !!(context.params || {}).graphql,
    queryIsProperGraphQL: false,
    inclAllFieldsServer: true,
    inclAllFieldsClient: true,
  }, options1.options || {});

  schema = isFunction(schema) ? schema() : schema;

  if (!isObject(schema) && !isString(schema)) {
    throw new Error(`Resolved schema is typeof ${query} rather than string or object. (fgraphql)`);
  }

  const feathersSdl = isObject(schema) ? schema : convertSdlToFeathersSchemaObject(schema);
  debug('schema now in internal form');

  // Return the actual hook.
  return async (context) => {
    const ifSkip = options.skipHookWhen(context);
    debug(`hook called. type ${context.type} method ${context.method} ifSkip ${ifSkip}`);
    if (ifSkip) return context;

    query = isFunction(query) ? query(context) : query;

    if (!isObject(query)) {
      throw new Error(`Query is typeof ${query} rather than object. (fgraphql)`);
    }

    const topQueryProps = Object.keys(query);
    if (options.queryIsProperGraphQL && topQueryProps.length !== 1) {
      throw new Error('Only 1 type prop allowed at query root when proper GraphQL. (fgraphql)');
    }

    if (!ourResolvers) {
      ourResolvers = resolvers(context.app, runTime);
      debug(`ourResolvers have types ${Object.keys(ourResolvers)}`);
    }

    if (!ourResolvers[recordType]) {
      throw new Error(`recordType ${recordType} not found in resolvers. (fgraphql)`);
    }

    options.inclAllFields = context.params.provider ?
      options.inclAllFieldsClient : options.inclAllFieldsServer;
    debug(`inclAllField ${options.inclAllFields}`);

    const store = {
      feathersSdl,
      ourResolvers,
      options,
    };

    const fields = options.queryIsProperGraphQL ? query[topQueryProps[0]] : query;
    const recs = getItems(context);

    await processRecords(recs, recordType, fields, store);

    replaceItems(context, recs);
    return context;
  };
};

async function processRecords(recs, type, fields, store, depth = 0) {
  recs = isArray(recs) ? recs : [recs];
  debug(`processRecords depth ${depth} #recs ${recs.length} type ${type}`);

  if (!isObject(store.ourResolvers[type])) {
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

    // for every field, resolver
    for (let i = 0, ilen = fieldNames.length; i < ilen; i++) {
      const fieldName = fieldNames[i];
      debug(`.type ${type} rec# ${j} field# ${i} name ${fieldName}`);

      if (fieldName !== '_args') {
        includes.push(fieldName);

        if (store.ourResolvers[type][fieldName]) {
          debug('has resolver');
          await resolverExists();
        } else {
          debug('no resolver');
          includesHasRecFields = true;
        }
      }

      // eslint-disable-next-line no-inner-declarations
      async function resolverExists() {
        if (!isFunction(store.ourResolvers[type][fieldName])) {
          throw new Error(`Resolver for Type ${type} field ${fieldName} is typeof ${typeof type} not function. (fgraphql)`);
        }

        const args = fields[fieldName]._args; // undefined is OK
        if (args) debug(`resolver args ${JSON.stringify(args)}`);

        rec[fieldName] = await store.ourResolvers[type][fieldName](rec, args || {}, {});
        debug(`resolver returned ${isArray(rec[fieldName]) ? `${rec[fieldName].length} recs` : 'one obj'}`);

        const nextType = store.feathersSdl[type][fieldName].typeof;
        debug(`.type ${type} rec# ${j} field# ${i} name ${fieldName} next type ${nextType}`);

        if (store.ourResolvers[nextType] && isObject(fields[fieldName])) { // ignore String, etc.
          await processRecords(rec[fieldName], nextType, fields[fieldName], store, depth + 1);
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
  const graphQLSchemaObj = parse(schemaDefinitionLanguage);
  //inspector('graphQLSchemaObj', graphQLSchemaObj)
  return convertDocument(graphQLSchemaObj);
}

function convertDocument(ast) {
  const result = {};

  if (ast.kind !== 'Document' || !isArray(ast.definitions)) {
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

  if (definition.kind !== 'ObjectTypeDefinition' || !isArray(definition.fields)) {
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
  if (!isObject(nameObj) || !isString(nameObj.value)) {
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
  converted.inputValues = field.arguments && field.arguments.length !== 0;

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

function isString(str) {
  return typeof str === 'string';
}

function isFunction(func) {
  return typeof func === 'function';
}

function isArray(array) {
  return Array.isArray(array);
}

const { inspect } = require('util');
function inspector(desc,obj) {
  console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 7 }));
}