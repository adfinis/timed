import { Model, belongsTo, hasMany } from "miragejs";

export default {
  absence: Model.extend({
    absenceType: belongsTo("absence-type", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  absenceBalance: Model.extend({
    absenceCredits: hasMany("absence-credit", { inverse: null }),
    absenceType: belongsTo("absence-type", { inverse: "absenceBalances" }),
    user: belongsTo("user", { inverse: "absenceBalances" }),
  }),
  absenceCredit: Model.extend({
    absenceType: belongsTo("absence-type", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  absenceType: Model.extend({
    absenceBalances: hasMany("absence-balance", { inverse: "absenceType" }),
  }),
  activity: Model.extend({
    task: belongsTo("task", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  attendance: Model.extend({
    user: belongsTo("user", { inverse: null }),
  }),
  billingType: Model.extend({}),
  costCenter: Model.extend({}),
  customer: Model.extend({
    assignees: hasMany("customer-assignee", { inverse: null }),
    projects: hasMany("project", { inverse: "customer" }),
  }),
  customerAssignee: Model.extend({
    customer: belongsTo("customer", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  customerStatistic: Model.extend({
    customer: belongsTo("customer", { inverse: null }),
  }),
  employment: Model.extend({
    location: belongsTo("location", { inverse: null }),
    user: belongsTo("user", { inverse: "employments" }),
  }),
  location: Model.extend({}),
  monthStatistic: Model.extend({}),
  overtimeCredit: Model.extend({
    user: belongsTo("user", { inverse: null }),
  }),
  project: Model.extend({
    assignees: hasMany("project-assignee", { inverse: null }),
    billingType: belongsTo("billing-type", { inverse: null }),
    customer: belongsTo("customer", { inverse: "projects" }),
    tasks: hasMany("task", { inverse: "project" }),
  }),
  projectAssignee: Model.extend({
    project: belongsTo("project", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  projectStatistic: Model.extend({
    customer: belongsTo("customer", { inverse: null }),
  }),
  publicHoliday: Model.extend({
    location: belongsTo("location", { inverse: null }),
  }),
  report: Model.extend({
    task: belongsTo("task", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
    verifiedBy: belongsTo("user", { inverse: null }),
  }),
  reportIntersection: Model.extend({
    customer: belongsTo("customer", { inverse: null }),
    project: belongsTo("project", { inverse: null }),
    task: belongsTo("task", { inverse: null }),
    user: belongsTo("user", { inverse: null }),
  }),
  task: Model.extend({
    assignees: hasMany("task-assignee", { inverse: "task" }),
    project: belongsTo("project", { inverse: "tasks" }),
  }),
  taskAssignee: Model.extend({
    task: belongsTo("task", { inverse: "assignees" }),
    user: belongsTo("user", { inverse: null }),
  }),
  taskStatistic: Model.extend({
    task: belongsTo("task", { inverse: null }),
  }),
  user: Model.extend({
    absenceBalances: hasMany("absence-balance", { inverse: "user" }),
    employments: hasMany("employment", { inverse: "user" }),
    supervisees: hasMany("user", { inverse: "supervisors" }),
    supervisors: hasMany("user", { inverse: "supervisees" }),
    worktimeBalances: hasMany("worktime-balance", { inverse: "user" }),
  }),
  userStatistic: Model.extend({
    user: belongsTo("user", { inverse: null }),
  }),
  worktimeBalance: Model.extend({
    user: belongsTo("user", { inverse: "worktimeBalances" }),
  }),
  yearStatistic: Model.extend({}),
};
