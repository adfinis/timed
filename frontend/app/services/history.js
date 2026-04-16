import { action } from "@ember/object";
import Service from "@ember/service";

export default class HistoryService extends Service {
  #target = new EventTarget();

  @action
  show(report, e) {
    e.stopPropagation();
    const ev = new CustomEvent("show", { detail: { report } });
    this.#target.dispatchEvent(ev);
  }

  @action
  close() {
    const ev = new CustomEvent("close");
    this.#target.dispatchEvent(ev);
  }

  @action
  addEventListener(name, callback) {
    this.#target.addEventListener(name, callback);
  }

  @action
  removeEventListener(name, callback) {
    this.#target.removeEventListener(name, callback);
  }
}
