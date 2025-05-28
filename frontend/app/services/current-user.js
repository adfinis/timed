import Service, { service } from "@ember/service";
import { task } from "ember-concurrency";
import moment from "moment";

export default class CurrentUserService extends Service {
  @service session;
  @service fetch;
  @service store;
  @service router;

  async load() {
    if (!this.session.isAuthenticated) {
      return;
    }
    const user = await this.fetch.fetch(
      `/api/v1/users/me?${new URLSearchParams({
        include: "supervisors,supervisees",
      })}`,
      {
        method: "GET",
      },
    );

    await this.store.pushPayload("user", user);

    const usermodel = await this.store.peekRecord("user", user.data.id);

    // Fetch current employment
    const employment = await this.store.query("employment", {
      user: usermodel.id,
      date: moment().format("YYYY-MM-DD"),
      include: "location",
    });

    if (!employment.length) {
      this.router.transitionTo("no-access");
    }

    this.user = usermodel;
  }

  worktimeBalance = task(async (user) => {
    const worktimeBalance = await this.store.query("worktime-balance", {
      user,
      last_reported_date: 1,
    });

    const entry = worktimeBalance[0];
    return entry?.balance?.asHours();
  });
}
