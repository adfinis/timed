import Controller from "@ember/controller";
import { inject as service } from "@ember/service";

import ENV from "customer-center/config/environment";

export default class SubscriptionsOwnController extends Controller {
  @service account;
  @service intl;

  get projects() {
    return this.model;
  }
}
