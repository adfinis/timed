import EmberRouter from "@ember/routing/router";

import config from "customer-center/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

const resetNamespace = true;

// eslint-disable-next-line array-callback-return
Router.map(function () {
  this.route("login");
  this.route("info");
  this.route("contact");

  this.route("protected", { path: "" }, function () {
    this.route("index", { resetNamespace, path: "/" });
    this.route("subscriptions", { resetNamespace, path: "" }, function () {
      this.route("own");
      this.route("list");
      this.route("confirm");
      this.route("detail", { path: "/detail/:project_id" }, function () {
        this.route("orders");
      });
      this.route("reload", { path: "/reload/:project_id" });
    });
  });

  this.route("notfound", { path: "/*path" });
});
