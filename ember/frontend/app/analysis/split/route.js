import Route from "@ember/routing/route";
import { service } from "@ember/service";

export default class AnalysisSplitRoute extends Route {
  @service store;

  model({ id }) {
    return this.store.findRecord("report", id, {
      include: "task,task.project,task.project.customer",
    });
  }
}
