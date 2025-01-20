import Service, { service } from "@ember/service";

export default class DocsService extends Service {
  timedDocsURL = "https://timed.dev/docs/";
  @service router;

  docsUrlMatch = {
    // index.name: DocsUrl
    "index.attendances": "tracking/attendances",
    "index.reports": "tracking/timesheet",
    "analysis.index": "analysis",
    statistics: "statistics",
    projects: "projects",
    "users.index": "users",
    "users.edit.index": "users",
    "index.activities.index": "tracking/activities",
  };

  get docsEndpoint() {
    return this.timedDocsURL + this.getDocsURL;
  }

  get getDocsURL() {
    for (const timedRouterName of Object.keys(this.docsUrlMatch)) {
      if (this.router.currentRouteName === timedRouterName) {
        return this.docsUrlMatch[timedRouterName];
      }
    }
    return "";
  }
}
