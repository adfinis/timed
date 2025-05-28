import Service, { service } from "@ember/service";

import config from "timed/config/environment";

export const ROUTE_DOCS_MAPPING = {
  "index.attendances": "/tracking/attendances",
  "index.reports": "/tracking/timesheet",
  "analysis.index": "/analysis",
  statistics: "/statistics",
  projects: "/projects",
  "users.index": "/users",
  "users.edit.index": "/users",
  "index.activities.index": "/tracking/activities",
};

export default class DocsService extends Service {
  @service router;

  get endpoint() {
    return config.docsBaseUrl + this.docsURL;
  }

  get docsURL() {
    return ROUTE_DOCS_MAPPING[this.router.currentRouteName] ?? "";
  }
}
