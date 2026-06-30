import Route from "@ember/routing/route";
import { service } from "@ember/service";
import { runTask } from "ember-lifeline";

export default class AnalysisIndexRoute extends Route {
  @service scrollRestorer;

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

    controller.restoreScrollPosition();
    this.scrollRestorer.storeScrollElement("analysis-scrollable-container");
  }
}
