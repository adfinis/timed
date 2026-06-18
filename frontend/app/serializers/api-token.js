import ApplicationSerializer from "timed/serializers/application";

export default class ApiTokenSerializer extends ApplicationSerializer {
  attrs = {
    token: { serialize: false },
    created: { serialize: false },
    lastUsedAt: { serialize: false },
    revoked: { serialize: false },
  };
}
