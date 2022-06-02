import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { loading } from 'ember-loading';

export default class DummyRoute extends Route {
  @service router;

  @tracked type;

  @action
  toggleRadio(type) {
    console.log({ type });
    this.type = type;
  }

  @action
  @loading
  next() {
    console.log(this.type, 'next val');
    switch (this.type) {
      case 'quick':
        break;
      case 'manual':
        this.router.transitionTo('scopes.scope.new', 'global');
        break;
    }
  }
}
