import Model, { attr } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

export default class ApiToken extends Model {
  @attr("string", { defaultValue: "" }) name;
  /* the raw token, only present in the response to the creation request */
  @attr("string") token;
  @attr("luxon-dt", { t: m.datetime }) created;
  @attr("luxon-dt", { t: m.datetime }) lastUsedAt;
  @attr("luxon-dt", { t: m.datetime }) expiresAt;
  @attr("boolean", { defaultValue: false }) revoked;
}
