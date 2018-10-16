
/* eslint-disable no-console */
// Start the server. (Can be re-generated.)
const logger = require('./logger');
const app = require('./app');
const seedData = require('./seed-data');
// !code: imports // !end
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
  await app.service('users').find({ query: { $limit: 1 }});
  // !end
});

// !code: funcs // !end
// !code: end // !end
