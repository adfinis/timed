import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import OIDCApplicationRouteMixin from "ember-simple-auth-oidc/mixins/oidc-application-route-mixin";

export default class ApplicationRoute extends Route.extend(
  OIDCApplicationRouteMixin
) {
  @service intl;
  @service moment;

  beforeModel() {
    super.beforeModel(...arguments);

    this.moment.setLocale("de");
    this.intl.setLocale("de");
  }
}
