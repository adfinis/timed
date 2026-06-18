import Controller from "@ember/controller";
import { service } from "@ember/service";
import { dropTask, restartableTask } from "ember-concurrency";

export default class UsersEditApiTokensIndexController extends Controller {
  @service notify;
  @service store;

  tokens = restartableTask(async () => {
    return await this.store.query("api-token", {});
  });

  delete = dropTask(async (token) => {
    try {
      await token.destroyRecord();

      this.notify.success("API token was deleted");

      this.tokens.perform();
    } catch {
      this.notify.error("Error while deleting the API token");
    }
  });
}
