import Route from '@ember/routing/route';

export default class ScopesScopeRolesRoleRoute extends Route {
  // =methods

  /**
   * Load a role in current scope.
   * @param {object} params
   * @param {string} params.role_id
   * @return {RoleModel}
   */
  model({ role_id }) {
    const { id: scopeID } = this.modelFor('scopes.scope');
    return this.store.findRecord('role', role_id, {
      reload: true,
      adapterOptions: { scopeID },
    });
  }
}
