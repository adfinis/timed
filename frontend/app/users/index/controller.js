import { action, set } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout, hash } from "ember-concurrency";
import moment from "moment";
import { trackedTask } from "reactiveweb/ember-concurrency";

import QPController from "timed/controllers/qpcontroller";

export default class UsersIndexController extends QPController {
  queryParams = ["search", "supervisor", "active", "ordering"];

  @service currentUser;
  @service router;
  @service store;

  @tracked search = "";
  @tracked supervisor = null;
  @tracked active = "1";
  @tracked ordering = "username";

  constructor(...args) {
    super(...args);

    this.prefetchData.perform();
  }

  get selectedSupervisor() {
    return this.supervisor && this.store.peekRecord("user", this.supervisor);
  }

  get fetchData() {
    return this._fetchData ?? {};
  }

  resetFilter = restartableTask(async () => {
    await this.resetQueryParams();
  });

  @action
  viewUserProfile(userId) {
    return this.router.transitionTo("users.edit", userId);
  }

  prefetchData = restartableTask(async () => {
    const supervisorId = this.supervisor;

    return await hash({
      supervisor: supervisorId && this.store.findRecord("user", supervisorId),
    });
  });

  data = restartableTask(async () => {
    await Promise.resolve();
    const date = moment().format("YYYY-MM-DD");

    await this.store.query("employment", { date });
    await this.store.query("worktime-balance", { date });

    return await this.store.query("user", {
      ...this.allQueryParams,
      ...(this.currentUser.user.isSuperuser
        ? {}
        : {
            supervisor: this.currentUser.user.id,
          }),
    });
  });

  setSearchFilter = restartableTask(async (value) => {
    await timeout(500);

    this.search = value;
  });

  setModelFilter = restartableTask(async (key, value) => {
    await set(this, key, value && value.id);
  });

  _fetchData = trackedTask(this, this.data, () => [
    this.supervisor,
    this.search,
    this.ordering,
    this.active,
  ]);
}
