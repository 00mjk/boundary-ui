import JSONSerializer from '@ember-data/serializer/json';

export default class FragmentCredentialStoreAttributesSerializer extends JSONSerializer {
  /**
   * If an attribute is annotated as readOnly in the model, don't serialize it.
   * Otherwise delegate to default attribute serializer.
   *
   * @override
   * @method serializeAttribute
   * @param {Snapshot} snapshot
   * @param {Object} json
   * @param {String} key
   * @param {Object} attribute
   */
  serializeAttribute(snapshot, json, key, attribute) {
    const { type, options } = attribute;
    let value = super.serializeAttribute(...arguments);
    // Convert empty strings to null.
    if (type === 'string' && json[key] === '') json[key] = null;
    // Do not serialize read-only attributes.
    if (options.readOnly) delete json[key];
    // Token cannot be unset.  If it's falsy, it must be removed.
    if (key === 'token' && !json[key]) delete json[key];
    // Client certificate key cannot be unset when certificate is set.
    // If it's falsy, it must be removed.
    if (
      key === 'client_certificate_key' &&
      !json[key] &&
      json['client_certificate']
    )
      delete json[key];
    return value;
  }
}
