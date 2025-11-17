import JSONAPIAdapter from "@ember-data/adapter/json-api";
import OIDCAdapterMixin from "ember-simple-auth-oidc/mixins/oidc-adapter-mixin";

import ENV from "customer-center/config/environment";

const BaseAdapter = JSONAPIAdapter.extend(OIDCAdapterMixin);

export default class ApplicationAdapter extends BaseAdapter {
  namespace = "api/v1";
  host = window.location.host.includes("test")
    ? ENV.APP.hostStaging
    : ENV.APP.hostProd;
}
