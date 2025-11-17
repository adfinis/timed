import NotifyService from "ember-notify";

import parseError from "customer-center/utils/parse-error";

export default class ExtrendedNotifyService extends NotifyService {
  fromError(error) {
    this.error(parseError(error));
  }
}
