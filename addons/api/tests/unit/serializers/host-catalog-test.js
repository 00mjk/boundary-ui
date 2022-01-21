import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | host catalog', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('host-catalog');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('host-catalog', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it serializes a static host-catalog as expected', async function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-catalog');
    const record = store.createRecord('host-catalog', {
      name: 'static',
      description: 'this is a static host-catalog',
      type: 'static',
    });
    const snapshot = record._createSnapshot();
    const serializedRecord = serializer.serialize(snapshot);
    const expectedResult = {
      name: 'static',
      description: 'this is a static host-catalog',
      type: 'static',
    };
    assert.deepEqual(serializedRecord, expectedResult);
  });

  test('it serializes an AWS plugin as expected, ignoring Azure fields', async function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-catalog');
    const record = store.createRecord('host-catalog', {
      compositeType: 'aws',
      name: 'AWS',
      description: 'this is a Aws plugin host-catalog',
      disable_credential_rotation: true,
      // these are AWS fields and should be included
      region: 'spain',
      access_key_id: 'foobars',
      secret_access_key: 'testing',
      // these are Azure fields and should be excluded
      tenant_id: 'a1b2c3',
      client_id: 'a1b2c3',
      subscription_id: 'a1b2c3',
      secret_id: 'a1b2c3',
      secret_value: 'a1b2c3',
    });
    const snapshot = record._createSnapshot();
    const serializedRecord = serializer.serialize(snapshot);
    const expectedResult = {
      name: 'AWS',
      description: 'this is a Aws plugin host-catalog',
      type: 'plugin',
      attributes: {
        disable_credential_rotation: true,
        region: 'spain',
        access_key_id: 'foobars',
        secret_access_key: 'testing',
      },
    };
    assert.deepEqual(serializedRecord, expectedResult);
  });

  test('it serializes an Azure plugin as expected, ignoring AWS fields', async function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-catalog');
    const record = store.createRecord('host-catalog', {
      compositeType: 'azure',
      name: 'Azure',
      description: 'this is a Azure plugin host-catalog',
      disable_credential_rotation: true,
      // these are AWS fields and should be included
      region: 'spain',
      access_key_id: 'foobars',
      secret_access_key: 'testing',
      // these are Azure fields and should be excluded
      tenant_id: 'a1b2c3',
      client_id: 'a1b2c3',
      subscription_id: 'a1b2c3',
      secret_id: 'a1b2c3',
      secret_value: 'a1b2c3',
    });
    const snapshot = record._createSnapshot();
    const serializedRecord = serializer.serialize(snapshot);
    const expectedResult = {
      name: 'Azure',
      description: 'this is a Azure plugin host-catalog',
      type: 'plugin',
      attributes: {
        disable_credential_rotation: true,
        tenant_id: 'a1b2c3',
        client_id: 'a1b2c3',
        subscription_id: 'a1b2c3',
        secret_id: 'a1b2c3',
        secret_value: 'a1b2c3',
      },
    };
    assert.deepEqual(serializedRecord, expectedResult);
  });

  test('it serializes aws correctly on update', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-catalog');
    store.push({
      data: {
        id: '1',
        type: 'host-catalog',
        attributes: {
          type: 'plugin',
          name: 'aws',
          description: 'test description',
          plugin: {
            name: 'aws',
          },
          region: 'andorra',
          access_key_id: 'foobars',
          secret_access_key: 'testing',
        },
      },
    });
    const record = store.peekRecord('host-catalog', '1');
    const snapshot = record._createSnapshot();
    const expectedResult = {
      type: 'plugin',
      name: 'aws',
      description: 'test description',
      attributes: {
        disable_credential_rotation: false,
        region: 'andorra',
        access_key_id: 'foobars',
        secret_access_key: 'testing',
      },
    };
    const serializedRecord = serializer.serialize(snapshot);
    assert.deepEqual(serializedRecord, expectedResult);
  });

  test('it serializes azure correctly on update', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-catalog');
    store.push({
      data: {
        id: '2',
        type: 'host-catalog',
        attributes: {
          type: 'plugin',
          name: 'azure',
          description: 'test description',
          plugin: {
            name: 'azure',
          },
          tenant_id: 'a1b2c3',
          client_id: 'foobars12',
          subscription_id: 'barsfoo21',
          // these are Azure read-only fields and should NOT be included on update
          secret_id: 'secretBar12',
          secret_value: 'secretValue21',
        },
      },
    });
    const record = store.peekRecord('host-catalog', '2');
    const snapshot = record._createSnapshot();
    const expectedResult = {
      type: 'plugin',
      name: 'azure',
      description: 'test description',
      attributes: {
        disable_credential_rotation: false,
        tenant_id: 'a1b2c3',
        client_id: 'foobars12',
        subscription_id: 'barsfoo21',
      },
    };
    const serializedRecord = serializer.serialize(snapshot);
    assert.deepEqual(serializedRecord, expectedResult);
  });
});
