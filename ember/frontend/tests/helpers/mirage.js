import { setupMirage as upstreamSetupMirage } from "ember-mirage/test-support";

import makeServer from "timed/mirage/config";

export function setupMirage(hooks, options = {}) {
  const { config, ...rest } = options;

  return upstreamSetupMirage(hooks, {
    createServer: makeServer,
    ...rest,
    config: {
      environment: "test",
      ...config,
    },
  });
}
