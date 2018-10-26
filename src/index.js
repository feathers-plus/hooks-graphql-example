
/* eslint-disable no-console */
// Start the server. (Can be re-generated.)
const logger = require('./logger');
const app = require('./app');
const seedData = require('./seed-data');
// !code: imports
const { inspect } = require('util');
// !end
// !code: init // !end

const port = app.get('port');
const server = app.listen(port);
// !code: init2 // !end

process.on('unhandledRejection', (reason, p) => {
  // !<DEFAULT> code: unhandled_rejection_log
  logger.error('Unhandled Rejection at: Promise ', p, reason);
  // !end
  // !code: unhandled_rejection // !end
});

server.on('listening', async () => {
  // !<DEFAULT> code: listening_log
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
  // !end
  // !code: listening // !end
  await seedData(app);
  // !code: listening1
  // const recs = await app.service('users').get('000001', { paginate: false });
  const recs = await app.service('users').find({ query: { _id: '000002' }, paginate: false });
  console.log('.....populated results');
  console.log('');
  inspector('', recs);
  console.log('');
  // !end
});

// !code: funcs
function inspector(desc, obj) {
  if (desc) console.log(desc);
  console.log(inspect(obj, { colors: true, depth: 9 }));
}
// !end
// !code: end // !end
