import Controller from "@ember/controller";
import { runTask } from "ember-lifeline";

export default class ControllersQPControllerController extends Controller {
  #defaults = {};

  constructor(...args) {
    super(...args);

    // defer until the extending controller has set it's query params
    runTask(this, () => this.storeQPDefaults(), 1);
  }

  storeQPDefaults() {
    this.queryParams.forEach((qp) => {
      this.#defaults[qp] = this[qp];
    });
  }

  resetQueryParams(options = { except: [] }) {
    this.queryParams.forEach((qp) => {
      if (!options.except.includes(qp)) {
        this[qp] = this.#defaults[qp];
      }
    });
  }

  get allQueryParams() {
    return this.queryParams.reduce(
      (acc, key) =>
        Object.defineProperty(acc, key, {
          value: this[key],
          enumerable: true,
        }),
      {},
    );
  }
}
