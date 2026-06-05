import Service from "@ember/service";
import { debounceTask } from "ember-lifeline";

export default class AnalysisScrollService extends Service {
  #canRestoreScroll = false;
  #scrollTop = null;
  #scrollElement = null;

  set canRestoreScroll(value) {
    this.#canRestoreScroll = value;
  }

  get canRestoreScroll() {
    return this.#canRestoreScroll && this.#scrollTop !== null;
  }

  set scrollTop(value) {
    this.#scrollTop = value;
  }

  get scrollTop() {
    return this.#scrollTop;
  }

  get scrollElement() {
    return document.getElementsByClassName(this.#scrollElement)[0] ?? null;
  }

  set scrollElement(selector) {
    this.#scrollElement = selector;
  }

  storeScrollElement(selector) {
    this.scrollElement = selector;
  }

  storeScrollPosition() {
    this.scrollTop = this.scrollElement?.scrollTop;
  }

  restoreScrollPosition() {
    debounceTask(this, "_restore", this.scrollTop, 200);
  }

  _restore(height) {
    this.scrollElement?.scrollTo({
      top: height,
      left: 0,
      behavior: "smooth",
    });
  }
}
