import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ScopesScopeProjectsProjectHostCatalogsHostCatalogHostSetsRoute extends Route {
  // =services

  @service intl;
  @service notify;

  // =methods

  /**
   * Loads all host-sets under the current host catalog and it's parent scope.
   * @return {Promise{[HostSetModel]}}
   */
  async model() {
    this.store.unloadAll('host-set');
    const { id: host_catalog_id } =
      this.modelFor('scopes.scope.projects.project.host-catalogs.host-catalog');
    return this.store.query('host-set', { host_catalog_id });
  }

  // =actions

  /**
   * Rollback changes on a host set.
   * @param {HostSetModel} hostSet
   */
  @action
  cancel(hostSet) {
    const { isNew } = hostSet;
    hostSet.rollbackAttributes();
    if (isNew) this.transitionTo('scopes.scope.projects.project.host-catalogs.host-catalog.host-sets');
  }

  /**
   * Handle save of a host set.
   * @param {HostSetModel} hostSet
   * @param {Event} e
   */
  @action
  async save(hostSet) {
    try {
      const { isNew } = hostSet;
      await hostSet.save();
      this.notify.success(
        this.intl.t(isNew ? 'notify.create-success' : 'notify.save-success')
      );
      this.transitionTo('scopes.scope.projects.project.host-catalogs.host-catalog.host-sets.host-set', hostSet);
    } catch (error) {
      // TODO: replace with translated strings
      this.notify.error(error.message, { closeAfter: null });
    }
  }

  /**
   * Delete host set in current scope and redirect to index.
   * @param {HostSetModel} hostSet
   */
  @action
  async delete(hostSet) {
    try {
      await hostSet.destroyRecord();
      this.notify.success(this.intl.t('notify.delete-success'));
      this.transitionTo('scopes.scope.projects.project.host-catalogs.host-catalog.host-sets');
    } catch (error) {
      // TODO: replace with translated strings
      this.notify.error(error.message, { closeAfter: null });
    }
  }
}
