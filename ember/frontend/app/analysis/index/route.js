import Route from "@ember/routing/route";
import { runTask } from "ember-lifeline";

export default class AnalysisIndexRoute extends Route {
  queryParams = {
    rejected: {
      refreshModel: true,
    },
    verified: {
      refreshModel: true,
    },
  };

  model() {
    /* eslint-disable-next-line ember/no-controller-access-in-routes */
    const controller = this.controllerFor("analysis.index");
    const skipReset = controller.skipResetOnSetup;
    runTask(
      this,
      () => {
        if (!skipReset) {
          controller._reset();
        }
      },
      1,
    );
  }

  setupController(controller) {
    controller.prefetchData.perform();
  }
}
