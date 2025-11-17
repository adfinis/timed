import Controller from "@ember/controller";
import { inject as service } from "@ember/service";

import config from "customer-center/config/environment";

export default class ErrorController extends Controller {
  @service intl;

  /** Don't show internals in production. */
  showStack = config.environment !== "production";

  breadcrumbs = [{ label: this.intl.t("page.error.title") }];
}
