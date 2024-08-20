import { action } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

const isTouchDevice = !!window && "ontouchstart" in window;

export default class OptimizedPowerSelectOptionsComponent extends Component {
  isTouchDevice = isTouchDevice;

  @tracked trackTouchMove = false;
  @tracked hasMoved = false;

  get isTesting() {
    if (macroCondition(isTesting())) {
      return true;
    }
    return false;
  }

  constructor(...args) {
    super(...args);
    scheduleOnce(
      "actions",
      this.args.select.actions,
      "scrollTo",
      this.args.select.highlighted
    );
  }

  @action
  onEvent(e) {
    if (e.type.startsWith("touch") && !this.isTouchDevice) {
      return;
    }
    const EVENT_TYPE_MAP = {
      mouseup: () =>
        this.findOptionAndPerform(this.args.select.actions.choose, e),
      mouseover: () =>
        this.args.highlightOnHover &&
        this.findOptionAndPerform(this.args.select.actions.highlight, e),
      touchstart: () => {
        this.trackTouchMove = true;
      },
      touchmove: () => {
        if (!this.trackTouchMove) return;
        this.hasMoved = true;
      },
      touchend: () => {
        this.trackTouchMove = false;
        const optionItem = e.target.closest("[data-option-index]");

        if (!optionItem) {
          return;
        }

        e.preventDefault();
        if (this.hasMoved) {
          this.hasMoved = false;
          return;
        }

        if (optionItem.closest("[aria-disabled=true]")) {
          return; // Abort if the item or an ancestor is disabled
        }

        const optionIndex = optionItem.getAttribute("data-option-index");
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      },
    };
    EVENT_TYPE_MAP[e.type]();
  }

  findOptionAndPerform(action, e) {
    const optionItem = e.target.closest("[data-option-index]");
    if (!optionItem) {
      return;
    }
    if (optionItem.closest("[aria-disabled=true]")) {
      return; // Abort if the item or an ancestor is disabled
    }
    const optionIndex = optionItem.getAttribute("data-option-index");
    action(this._optionFromIndex(optionIndex), e);
  }

  _optionFromIndex(index) {
    const parts = index.split(".");
    let option = this.args.options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
}
