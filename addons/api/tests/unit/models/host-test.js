import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | host', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    assert.expect(1);
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('host', {});
    assert.ok(model);
  });

  test('it contains attributes', function (assert) {
    assert.expect(1);
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('host', {
      type: 'static',
      attributes: {
        address: '127.0.0.1',
      },
    });
    assert.equal(model.attributes.address, '127.0.0.1');
  });

  test('it has isStatic and returns the expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelA = store.createRecord('host', { type: 'static' });
    const modelB = store.createRecord('host', { type: 'plugin' });
    assert.equal(typeof modelA.isStatic, 'boolean');
    assert.true(modelA.isStatic);
    assert.false(modelB.isStatic);
  });

  test('it has isPlugin and returns the expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelPlugin = store.createRecord('host', { type: 'plugin' });
    const modelStatic = store.createRecord('host', { type: 'static' });
    assert.equal(typeof modelPlugin.isPlugin, 'boolean');
    assert.true(modelPlugin.isPlugin);
    assert.false(modelStatic.isPlugin);
  });

  test('it has isAWS and returns the expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelAws = store.createRecord('host', {
      type: 'plugin',
      plugin: { name: 'aws' },
    });
    const modelRandom = store.createRecord('host', {
      plugin: { name: 'random' },
    });
    assert.equal(typeof modelAws.isAWS, 'boolean');
    assert.true(modelAws.isAWS);
    assert.false(modelRandom.isAWS);
  });

  test('it has isAzure and returns the expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelAzure = store.createRecord('host', {
      type: 'plugin',
      plugin: { name: 'azure' },
    });
    const modelRandom = store.createRecord('host', {
      plugin: { name: 'random' },
    });
    assert.equal(typeof modelAzure.isAzure, 'boolean');
    assert.true(modelAzure.isAzure);
    assert.false(modelRandom.isAzure);
  });

  test('get compositeType returns expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelPlugin = store.createRecord('host', {
      type: 'plugin',
      plugin: { name: 'Test name' },
    });
    const modelStatic = store.createRecord('host', {
      type: 'static',
    });
    assert.equal(typeof modelPlugin.compositeType, 'string');
    assert.equal(modelPlugin.compositeType, 'Test name');
    assert.equal(modelStatic.compositeType, 'static');
  });

  test('set compositeType sets expected values', async function (assert) {
    assert.expect(3);
    const store = this.owner.lookup('service:store');
    const modelPlugin = store.createRecord('host', {
      compositeType: 'aws',
    });
    const modelStatic = store.createRecord('host', {
      compositeType: 'static',
    });

    assert.equal(modelPlugin.type, 'plugin');
    assert.equal(modelPlugin.plugin.name, 'aws');
    assert.equal(modelStatic.type, 'static');
  });
});
