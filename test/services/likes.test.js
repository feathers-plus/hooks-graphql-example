const assert = require('assert');
const app = require('../../src/app');

describe('\'likes\' service', () => {
  it('registered the service', () => {
    const service = app.service('likes');

    assert.ok(service, 'Registered the service');
  });
});
