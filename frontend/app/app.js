import Application from "@ember/application";
import { importSync, isDevelopingApp, macroCondition } from "@embroider/macros";
import * as Sentry from "@sentry/ember";
import loadInitializers from "ember-load-initializers";
import { registerDateLibrary } from "ember-power-calendar";
import DateUtils from "ember-power-calendar-moment";
import Resolver from "ember-resolver";
import fastRedact from "fast-redact";

import config from "timed/config/environment";

import "./font-awesome";
import "simplebar";
import "simplebar/dist/simplebar.css";

const redact = fastRedact({
  paths: [
    "user.email",
    "user.family_name",
    "user.given_name",
    "user.address",
    "user.postalCode",
    "user.city",
  ],
  serialize: false,
});

/* istanbul ignore if */
if (config["@sentry/ember"]) {
  Sentry.init({
    ...config["@sentry/ember"],
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    beforeSend(_event, hint) {
      const event = redact(_event);
      // ignore this differentiation in dev environment
      if (event.environment === "production") {
        if (window.location.hostname === "test.timed.adfinis.com") {
          event.environment = "staging";
        }
      }

      const exception = hint.originalException;
      if (
        exception &&
        Array.isArray(exception.errors) &&
        exception.errors.every((e) => e.status === 401)
      ) {
        event.level = "info";
      }

      if (
        config.SENTRY_IGNORE &&
        config.SENTRY_IGNORE.includes(hint.originalException.name)
      ) {
        return null;
      }
      return event;
    },
  });
}

// simplebar setup end

if (macroCondition(isDevelopingApp())) {
  importSync("./deprecation-workflow");
}

registerDateLibrary(DateUtils);

const extendResolver = (resolver) => {
  return class EmberCanResolver extends resolver {
    /**
     * @type {Record<string, string>}
     **/
    pluralizedTypes = {
      ...this.pluralizedTypes,
      ability: "abilities",
    };
  };
};

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = extendResolver(Resolver);
}

loadInitializers(App, config.modulePrefix);
