"use strict";

const { name } = require("../package");

module.exports = function (environment) {
  const ENV = {
    environment,
    modulePrefix: name,

    rootURL: "/",
    locationType: "auto",

    auth: {
      roles: {
        admin: "/cc-admin",
        employee: "/employee",
        customer: "/customer",
      },
    },

    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    moment: {
      includeLocales: ["de"],
    },

    "@sentry/ember": {
      disablePerformance: true,
      sentry: { environment },
    },

    APP: {
      API_HOST: "https://timed.localhost",
      // Define alertTime in hours.
      // When total time comes close to alertTime, text color changes.
      ALERT_TIME: 5,
    },

    "ember-simple-auth-oidc": {
      host: "/auth/realms/timed/protocol/openid-connect",
      clientId: "timed-public",
      authEndpoint: "/auth",
      tokenEndpoint: "/token",
      endSessionEndpoint: "/logout",
      userinfoEndpoint: "/userinfo",
      afterLogoutUri: "/",
    },
  };

  if (environment === "development") {
    ENV["ember-simple-auth-oidc"].host =
      "http://timed.local/auth/realms/timed/protocol/openid-connect";
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

    // If performance is enabled, the tests fail with:
    // Failed to execute 'measure' on 'Performance'
    // -> Performance is currently disabled by default as we need to adjust
    //    the response headers from Timed to use this feature. As we will
    //    probably do that I keep this setting here.
    ENV["@sentry/ember"].disablePerformance = true;
  }

  if (environment === "production") {
    ENV["ember-simple-auth-oidc"].host = "oidc-client-host";
    ENV["ember-simple-auth-oidc"].clientId = "oidc-client-id";

    ENV.auth.roles.admin = "auth-admin-role";
    ENV.auth.roles.employee = "auth-employee-role";
    ENV.auth.roles.customer = "auth-customer-role";

    ENV.APP.API_HOST = "timed-api-host";
  }

  return ENV;
};
