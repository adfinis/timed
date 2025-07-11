/* jshint node: true */
module.exports = function (environment) {
  const ENV = {
    modulePrefix: "timed",
    environment,
    rootURL: "/",
    locationType: "history",
    fontawesome: {
      defaultPrefix: "far", // regular icons
    },
    moment: {
      includeTimezone: "all",
    },
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },

    APP: {
      REPORTEXPORTS: [
        {
          label: "CSV",
          url: "/api/v1/reports/export",
          params: {
            file_type: "csv",
          },
        },
        {
          label: "ODS",
          url: "/api/v1/reports/export",
          params: {
            file_type: "ods",
          },
        },
        {
          label: "XLSX",
          url: "/api/v1/reports/export",
          params: {
            file_type: "xlsx",
          },
        },
        {
          label: "Work report",
          url: "/api/v1/work-reports",
          params: {},
        },
      ],
      EXPORT_LIMIT: 100000,
      OVERTIME_SOFT_LIMIT: process.env.OVERTIME_SOFT_LIMIT || 20,
    },

    "ember-simple-auth-oidc": {
      host: "/auth/realms/timed/protocol/openid-connect",
      clientId: "timed-public",
      authEndpoint: "/auth",
      tokenEndpoint: "/token",
      endSessionEndpoint: "/logout",
      userinfoEndpoint: "/userinfo",
      afterLogoutUri: "/sso-login",
    },
  };

  if (process.env.SENTRY_DSN) {
    ENV["@sentry/ember"] = {
      dsn: process.env.SENTRY_DSN,
      debug: environment !== "production",
      tracesSampleRate: process.env.TRACES_SAMPLE_RATE || 0.01,
      maxBreadcrumbs: 20,
      // Will silence Ember.onError warning without the need of using Ember debugging tools.
      ignoreEmberOnErrorWarning: false,

      // All runloop queue durations will be added as spans.
      minimumRunloopQueueDuration: 0,

      // Will disable automatic instrumentation for components.
      // disableInstrumentComponents: true,

      // All (non-glimmer) component render durations will be added as spans.
      minimumComponentRenderDuration: 0,

      // All component definitions will be added as spans.
      enableComponentDefinition: true,
      sendDefaultPii: process.env.SEND_DEFAULT_PII === "true",
    };
    ENV.SENTRY_IGNORE = ["TransitionAborted"];
  }

  if (environment === "development") {
    ENV["ember-simple-auth-oidc"].host =
      "https://timed.localhost/auth/realms/timed/protocol/openid-connect";
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;

    ENV["ember-tether"] = {
      bodyElementId: "ember-testing",
    };
  }

  if (environment === "production") {
    ENV["ember-simple-auth-oidc"].host = "sso-client-host";
    ENV["ember-simple-auth-oidc"].clientId = "sso-client-id";
  }

  return ENV;
};
