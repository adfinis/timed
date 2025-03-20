import Service, { service } from "@ember/service";

const docsUrlMatch = {
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

export default class DocsService extends Service {
  timedDocsURL = "https://timed.dev/docs/";
  @service router;

  get docsEndpoint() {
    return this.timedDocsURL + this.getDocsURL;
  }

  get getDocsURL() {
    return docsUrlMatch[this.router.currentRouteName] || "";
  }
}
