import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dummy', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:dummy');
    assert.ok(route);
  });
});
