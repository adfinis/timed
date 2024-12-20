import Route from "@ember/routing/route";
import { service } from "@ember/service";
import moment from "moment";

export default class IndexReportsRoute extends Route {
  @service store;
  @service currentUser;
  @service notify;

  /**
   * Before model hook, fetch all absence types
   *
   * @method beforeModel
   * @return {AbsenceType[]} All absence types
   * @public
   */
  beforeModel(...args) {
    super.beforeModel(...args);

    return this.store.findAll("absence-type");
  }

  async setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.set("rescheduleDate", model);

    if (controller.task) {
      try {
        const task = await this.store.findRecord("task", controller.task, {
          include: "project,project.customer",
        });

        await this.store.createRecord("report", {
          task,
          duration: controller.duration
            ? moment.duration(controller.duration)
            : "",
          date: model,
          comment: controller.comment ?? "",
          user: this.currentUser.user,
          review: controller.review ?? false,
          notBillable: controller.notBillable ?? false,
          remainingEffort: task.mostRecentRemainingEffort,
        });

        controller.task = null;
        controller.comment = null;
        controller.duration = null;
        controller.review = null;
        controller.notBillable = null;

        this.notify.success(
          "Temporary report was created. Please amend it and save it or delete it.",
        );
      } catch {
        /* istanbul ignore next */
        this.notify.error("Could not create report");
      }
    }
    controller.checkForEmptyRecord = true;
  }
}
