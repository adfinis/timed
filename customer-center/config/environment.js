"use strict";

const { name } = require("../package");

function env(key, fallback) {
  return process.env[key] ?? fallback;
}

module.exports = function (environment) {
  const ENV = {
    environment,
    modulePrefix: name,

    rootURL: "/",
    locationType: "auto",

    auth: {
      adminRole: env("AUTH_ROLE_ADMIN", "/sg-cc-admin"),
      employeeRole: env("AUTH_ROLE_EMPLOYEE", "/adfinis-users"),
      customerRole: env("AUTH_ROLE_CUSTOMER", "/access-cc"),
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
      hostStaging: env("TIMED_STAGING_HOST", "http://localhost:8000"),
      hostProd: env("TIMED_PROD_HOST", "http://localhost:8000"),
      // Define alertTime in hours.
      // When total time comes close to alertTime, text color changes.
      alertTime: 5,
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
    // Whether Stage or Prod, the OIDC host and client will stay the same
    ENV["ember-simple-auth-oidc"].host = "sso-client-host";
    ENV["ember-simple-auth-oidc"].clientId = "sso-client-id";
  }

  return ENV;
};
