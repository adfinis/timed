import Controller from "@ember/controller";
import { service } from "@ember/service";
import { task } from "ember-concurrency";
import moment from "moment";

export default class EditUser extends Controller {
  @service store;

  absences = task(async () => {
    return await this.store.query("absence", {
      user: this.user.id,
      ordering: "-date",

      from_date: moment({
        day: 1,
        month: 0,
        year: this.year,
      }).format("YYYY-MM-DD"),
      include: "absence_type",
    });
  });

  employments = task(
    async () =>
      await this.store.query("employment", {
        user: this.user.id,
        ordering: "-start_date",
        include: "location",
      }),
  );
}
