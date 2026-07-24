import Service, { service } from "@ember/service";
import { restartableTask } from "ember-concurrency";

export default class AbsenceTypesService extends Service {
  @service store;

  fetchTask = restartableTask(async () => {
    return await this.store.findAll("absence-type", {
      reload: true,
      backgroundReload: false,
    });
  });

  get data() {
    return this.fetchTask.lastSuccessful?.value ?? [];
  }

  get isLoading() {
    return this.fetchTask.isRunning;
  }

  /**
   * ensure all users have been loaded/fetched
   *
   * the first time this is called, we send a request to fetch all users
   * after a successful load, this returns the existing result without fetching again
   */
  load() {
    if (this.fetchTask.isRunning) {
      return this.fetchTask.last;
    }

    if (this.fetchTask.lastSuccessful) {
      return this.fetchTask.lastSuccessful;
    }

    return this.fetchTask.perform();
  }

  reload() {
    return this.fetchTask.perform();
  }
}
