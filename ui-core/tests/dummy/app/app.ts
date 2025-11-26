import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "dummy/config/environment";
import { importSync, isDevelopingApp, macroCondition } from "@embroider/macros";

import "ember-truth-helpers"; // https://github.com/jmurphyau/ember-truth-helpers/issues/206
import "@nullvoxpopuli/ember-composable-helpers"; // same as for ember-truth-helpers

if (macroCondition(isDevelopingApp())) {
  importSync("./deprecation-workflow");
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
