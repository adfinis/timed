import EmberApp from "ember-strict-application-resolver";
import EmberRouter from "@ember/routing/router";
import PageTitleService from "ember-page-title/services/page-title";
import NotifyService from "ember-notify";
import NotifyMessage from "ember-notify/components/ember-notify/message";
import KeyboardService from "ember-keyboard/services/keyboard";
import uiCoreRegistry from "#src/registry.ts";
import { setConfig } from "ember-basic-dropdown/config";
import "#src/styles/app.css";

class Router extends EmberRouter {
  location = "history";
  rootURL = "/";
}

setConfig({ rootElement: "#things", destination: "#things-2" });

console.log(`kb svc: `, KeyboardService)
console.log(`notify svc: `, NotifyService)

export class App extends EmberApp {
  /**
   * Any services or anything from the addon that needs to be in the app-tree registry
   * will need to be manually specified here.
   *
   * Techniques to avoid needing this:
   * - private services
   * - require the consuming app import and configure themselves
   *   (which is what we're emulating here)
   */
  modules = {
    "./router": Router,
    "./services/page-title": PageTitleService,
    "./services/notify": NotifyService,
    "./services/keyboard": KeyboardService,
    "./components/ember-notify/message": NotifyMessage,
    /**
     * NOTE: this glob will import everything matching the glob,
     *     and includes non-services in the services directory.
     */
    ...import.meta.glob("./services/**/*", { eager: true }),
    /**
     * These imports are not magic, but we do require that all entries in the
     * modules object match a ./[type]/[name] pattern.
     *
     * See: https://rfcs.emberjs.com/id/1132-default-strict-resolver
     */
    ...import.meta.glob("./templates/**/*", { eager: true }),
    ...uiCoreRegistry(),
  };
}

Router.map(function () {
  this.route("table");
  this.route("button");
  this.route("card");
  this.route("modal");
  this.route("form");
  this.route("nav-tabs", function () {
    this.route("other");
  });
});
