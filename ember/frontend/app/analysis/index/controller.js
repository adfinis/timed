import { action } from "@ember/object";
import { service } from "@ember/service";
import { waitForFetch } from "@ember/test-waiters";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import download from "downloadjs";
import {
  animationFrame,
  dropTask,
  enqueueTask,
  task,
  hash,
} from "ember-concurrency";
import { DateTime, Duration } from "luxon";

import config from "../../config/environment";

import QPController from "timed/controllers/qpcontroller";
import parseDjangoDuration from "timed/utils/parse-django-duration";
import parseFileName from "timed/utils/parse-filename";
import {
  underscoreQueryParams,
  serializeQueryParams,
  queryParamsState,
} from "timed/utils/query-params";
import { cleanParams, toQueryString } from "timed/utils/url";

export default class AnalysisController extends QPController {
  queryParams = [
    "customer",
    "comment",
    "costCenter",
    "project",
    "task",
    "user",
    "reviewer",
    "billingType",
    "fromDate",
    "toDate",
    "review",
    "notBillable",
    "verified",
    "billed",
    "ordering",
    "editable",
    "rejected",
  ];

  exportLinks = config.APP.REPORTEXPORTS;
  exportLimit = config.APP.EXPORT_LIMIT;

  @service session;
  @service currentUser;
  @service store;
  @service router;
  @service notify;
  @service abilities;
  @service scrollRestorer;

  @tracked _scrollOffset = 0;
  @tracked _shouldLoadMore = false;
  @tracked _canLoadMore = true;
  @tracked _lastPage = 0;
  @tracked totalTime = Duration.fromMillis(0);
  @tracked totalItems = 0;
  @tracked selectedReportIds = [];
  @tracked _dataCache = [];

  @tracked user;
  @tracked reviewer;
  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked rejected;
  @tracked editable;
  @tracked billingType;
  @tracked fromDate;
  @tracked toDate;
  @tracked review;
  @tracked notBillable;
  @tracked verified;
  @tracked billed;
  @tracked costCenter;
  @tracked ordering = "-date";
  @tracked comment;

  get billingTypes() {
    return this.store.peekAll("billing-type");
  }

  get costCenters() {
    return this.store.peekAll("cost-center");
  }

  get selectedCustomer() {
    return this.customer && this.store.peekRecord("customer", this.customer);
  }

  get selectedProject() {
    return this.project && this.store.peekRecord("project", this.project);
  }

  get selectedTask() {
    return this.task && this.store.peekRecord("task", this.task);
  }

  get selectedUser() {
    return this.user && this.store.peekRecord("user", this.user);
  }

  get selectedReviewer() {
    return this.reviewer && this.store.peekRecord("user", this.reviewer);
  }

  get exportLimitExceeded() {
    return this.totalItems > this.exportLimit;
  }

  get exportLimitMessage() {
    return `The export limit is ${this.exportLimit}. Please use filters to reduce the amount of reports.`;
  }

  get isAccountant() {
    return this.currentUser.user.isAccountant;
  }

  get appliedFilters() {
    return Object.keys(queryParamsState(this)).filter((key) => {
      return key !== "ordering" && queryParamsState(this)?.[key]?.changed;
    });
  }

  get jwt() {
    return this.session.data.authenticated.access_token;
  }

  @action
  updateParam(key, value) {
    this[key] = ["toDate", "fromDate"].includes(key)
      ? value.toISODate()
      : value;
    this._reset();
  }

  @action
  setModelFilter(key, value) {
    this[key] = value && value.id;
    this._reset();
  }

  @action
  setModelFilterOnChange(key, event) {
    this[key] = event.target.value ? event.target.value : undefined;
    this._reset();
  }

  @action
  reset() {
    this.resetQueryParams({ except: ["ordering"] });
  }

  _reset() {
    this.data.cancelAll();
    this.loadNext.cancelAll();

    this._lastPage = 0;
    this._canLoadMore = true;
    this._shouldLoadMore = false;
    this._dataCache = [];
    this.selectedReportIds = [];
    this.totalTime = Duration.fromMillis(0);
    this.totalItems = 0;

    this.data.perform();
  }

  prefetchData = task(async () => {
    const {
      customer: customerId,
      project: projectId,
      task: taskId,
      user: userId,
      reviewer: reviewerId,
    } = this.allQueryParams;

    return await hash({
      customer: customerId && this.store.findRecord("customer", customerId),
      project: projectId && this.store.findRecord("project", projectId),
      task: taskId && this.store.findRecord("task", taskId),
      user: userId && this.store.findRecord("user", userId),
      reviewer: reviewerId && this.store.findRecord("user", reviewerId),
      billingTypes: this.store.findAll("billing-type"),
      costCenters: this.store.findAll("cost-center"),
    });
  });

  data = enqueueTask(async () => {
    const params = underscoreQueryParams(
      serializeQueryParams(this.allQueryParams, queryParamsState(this)),
    );

    if (this._canLoadMore) {
      const data = await this.store.query("report", {
        page: {
          number: this._lastPage + 1,
          size: 20,
        },
        ...params,
        include: "task,task.project,task.project.customer,user",
      });

      const assignees = await this.fetchAssignees.perform(data);

      const mappedReports = data.map((report) => {
        report.set(
          "taskAssignees",
          assignees.taskAssignees.filter(
            (taskAssignee) =>
              report.get("task.id") === taskAssignee.get("task.id"),
          ),
        );
        report.set(
          "projectAssignees",
          assignees.projectAssignees.filter(
            (projectAssignee) =>
              report.get("task.project.id") ===
              projectAssignee.get("project.id"),
          ),
        );
        report.set(
          "customerAssignees",
          assignees.customerAssignees.filter(
            (customerAssignee) =>
              report.get("task.project.customer.id") ===
              customerAssignee.get("customer.id"),
          ),
        );
        return report;
      });

      const meta = await data.meta;
      const pagination = meta.pagination;

      this.totalTime = parseDjangoDuration(meta["total-time"]);
      this.totalItems = parseInt(pagination.count);
      this._canLoadMore = pagination.pages !== pagination.page;
      this._lastPage = pagination.page;

      this._dataCache = [...this._dataCache, ...mappedReports];
    }

    return this._dataCache;
  });

  fetchAssignees = task(async (data) => {
    const projectIds = [
      ...new Set(data.map((report) => report.get("task.project.id"))),
    ].join(",");
    const taskIds = [
      ...new Set(data.map((report) => report.get("task.id"))),
    ].join(",");
    const customerIds = [
      ...new Set(data.map((report) => report.get("task.project.customer.id"))),
    ].join(",");

    const projectAssignees = projectIds.length
      ? await this.store.query("project-assignee", {
          is_reviewer: 1,
          projects: projectIds,
          include: "project,user",
        })
      : [];
    const taskAssignees = taskIds.length
      ? await this.store.query("task-assignee", {
          is_reviewer: 1,
          tasks: taskIds,
          include: "task,user",
        })
      : [];
    const customerAssignees = customerIds.length
      ? await this.store.query("customer-assignee", {
          is_reviewer: 1,
          customers: customerIds,
          include: "customer,user",
        })
      : [];

    return { projectAssignees, taskAssignees, customerAssignees };
  });

  loadNext = dropTask(async () => {
    this._shouldLoadMore = true;

    while (this._shouldLoadMore && this._canLoadMore) {
      // eslint-disable-next-line no-await-in-loop
      await this.data.perform();

      // eslint-disable-next-line no-await-in-loop
      await animationFrame();
    }
  });

  download = task(async ({ url = null, params = {} }) => {
    try {
      this.url = url;
      this.params = params;

      const queryString = toQueryString(
        underscoreQueryParams(
          cleanParams({
            ...params,
            ...serializeQueryParams(
              this.allQueryParams,
              queryParamsState(this),
            ),
          }),
        ),
      );

      const res = await waitForFetch(
        fetch(`${url}?${queryString}`, {
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
        }),
      );

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const file = await res.blob();

      const filename = parseFileName(res.headers.get("content-disposition"));

      // ignore since we can't really test this..
      if (macroCondition(isTesting())) {
        return;
      }
      download(file, filename, file.type);

      this.notify.success("File was downloaded");
    } catch {
      this.notify.error(
        "Error while downloading, try again or try reducing results",
      );
    }
  });

  @action
  edit(selectedIds = [], event) {
    this.scrollRestorer.storeScrollElement("analysis-scrollable-container");
    this.scrollRestorer.storeScrollPosition();
    const ids = event ? selectedIds : [];
    this.router.transitionTo("analysis.edit", {
      queryParams: {
        ...(ids && ids.length ? { id: ids } : {}),
        ...serializeQueryParams(this.allQueryParams, queryParamsState(this)),
      },
    });
  }

  @action
  selectRow(report) {
    const selected = this.selectedReportIds;

    if (selected.includes(report.id)) {
      this.selectedReportIds = selected.filter((id) => id !== report.id);
    } else {
      this.selectedReportIds = [...selected, report.id];
    }
  }

  dateFromString(str) {
    return DateTime.fromISO(str);
  }

  @action
  async restoreScrollPosition() {
    await this.loadNext.last;
    await this.data.last;
    if (this.scrollRestorer.canRestoreScroll) {
      this.scrollRestorer.restoreScrollPosition();
    }
  }
}
