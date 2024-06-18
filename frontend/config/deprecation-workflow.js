/* eslint-disable no-undef */
window.deprecationWorkflow = window.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-string.add-package" }, // https://deprecations.emberjs.com/id/ember-string-add-package
    { handler: "silence", matchId: "ensure-safe-component.string" }, // optimized-power-select
  ],
};
