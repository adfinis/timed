import type RouterService from "@ember/routing/router-service";
import Service, { service } from "@ember/service";
import type StoreService from "@ember-data/store";
import type SessionService from "ember-simple-auth-oidc/services/session";
import moment from "moment";
import type FetchService from "timed/services/fetch";

export default class CurrentUserService extends Service {
  @service declare session: SessionService;
  @service declare fetch: FetchService;
  @service declare store: StoreService;
  @service declare router: RouterService;

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
      }
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
}

declare module "@ember/service" {
  interface Registry {
    "current-user": CurrentUserService;
  }
}
