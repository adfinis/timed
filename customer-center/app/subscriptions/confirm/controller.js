import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import UIkit from "uikit";

export default class SubscriptionsConfirmController extends Controller {
  @service account;
  @service intl;
  @service notify;
  @service timed;

  breadcrumbs = [{ label: this.intl.t("page.subscriptions.confirm.title") }];

  get orders() {
    return this.model;
  }

  @action async accept(order) {
    const project = order.project.get("name");
    const customer = order.project.get("customer.name");

    try {
      await UIkit.modal.confirm(
        this.intl.t("page.subscriptions.confirm.prompt.accept", {
          duration: order.duration.locale(this.account.language).humanize({
            h: Infinity,
          }),
          customer,
          project,
        })
      );
    } catch (error) {
      return;
    }

    try {
      await this.timed.acceptSubscriptionOrder(order);

      this.notify.success(
        this.intl.t("page.subscriptions.confirm.accepted", {
          customer,
          project,
        })
      );
    } catch (error) {
      this.notify.fromError(error);
    }
  }

  @action async deny(order) {
    const project = order.project.get("name");
    const customer = order.project.get("customer.name");

    try {
      await UIkit.modal.confirm(
        this.intl.t("page.subscriptions.confirm.prompt.deny", {
          duration: order.duration.locale(this.account.language).humanize({
            h: Infinity,
          }),
          customer,
          project,
        })
      );
    } catch (error) {
      return;
    }

    try {
      await this.timed.denySubscriptionOrder(order);

      this.notify.success(
        this.intl.t("page.subscriptions.confirm.denied", { customer, project })
      );
    } catch (error) {
      this.notify.fromError(error);
    }
  }
}
