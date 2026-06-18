import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, dropTask } from "ember-concurrency";

import ApiTokenValidations from "timed/validations/api-token";

export default class UsersEditApiTokensNewController extends Controller {
  @service notify;
  @service store;

  ApiTokenValidations = ApiTokenValidations;

  @tracked createdToken = null;

  token = task(async () => {
    return this.store.createRecord("api-token");
  });

  save = dropTask(async (changeset) => {
    try {
      await changeset.save();

      this.createdToken = this.token.lastSuccessful.value;

      this.notify.success("API token was created");
    } catch {
      this.notify.error("Error while creating the API token");
    }
  });

  @action
  async copyToken() {
    try {
      await navigator.clipboard.writeText(this.createdToken.token);

      this.notify.success("API token copied to clipboard");
    } catch {
      this.notify.error("Could not copy to clipboard");
    }
  }
}
