import Application from "@ember/application";
import * as Sentry from "@sentry/ember";
import loadInitializers from "ember-load-initializers";
import { registerDateLibrary } from "ember-power-calendar";
import DateUtils from "ember-power-calendar-moment";
import Resolver from "ember-resolver";
import fastRedact from "fast-redact";
import config from "timed/config/environment";

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
  const sentryConfig = config["@sentry/ember"].sentry;
  Sentry.init({
    ...sentryConfig,
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

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
