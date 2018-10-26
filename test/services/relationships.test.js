const assert = require('assert');
const app = require('../../src/app');

describe('\'relationships\' service', () => {
  it('registered the service', () => {
    const service = app.service('relationships');

    assert.ok(service, 'Registered the service');
  });
});
