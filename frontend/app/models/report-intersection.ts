import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type Customer from "timed/models/customer";
import type Project from "timed/models/project";
import type Task from "timed/models/task";
import type User from "timed/models/user";

export default class ReportIntersection extends Model {
  @attr("string")
  declare comment?: string;
  @attr("boolean", { allowNull: true, defaultValue: null })
  declare notBillable: boolean | null;
  @attr("boolean", { allowNull: true, defaultValue: false })
  declare rejected: boolean | null;
  @attr("boolean", { allowNull: true, defaultValue: null })
  declare review: boolean | null;
  @attr("boolean", { allowNull: true, defaultValue: null })
  declare billed: boolean | null;
  @attr("boolean", { allowNull: true, defaultValue: null })
  declare verified: boolean | null;

  @belongsTo("customer", { async: true, inverse: null })
  declare customer: AsyncBelongsTo<Customer>;
  @belongsTo("project", { async: true, inverse: null })
  declare project: AsyncBelongsTo<Project>;
  @belongsTo("task", { async: true, inverse: null })
  declare task: AsyncBelongsTo<Task>;
  @belongsTo("user", { async: true, inverse: null })
  declare user: AsyncBelongsTo<User>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "report-intersection": ReportIntersection;
  }
}
