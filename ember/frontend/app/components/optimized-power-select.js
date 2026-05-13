import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class OptimizedPowerSelectComponent extends Component {
  get extra() {
    return this.args.extra ?? {};
  }

  @action
  onFocus({ actions, isOpen }) {
    if (!isOpen) {
      actions.open();
    }
  }

  @action
  onKeydown(select, e) {
    if (!select.isOpen) {
      return;
    }

    // this implementation is heavily inspired by the enter key handling of EPS
    // https://github.com/cibernox/ember-power-select/blob/6e3d5781a105515b915d407d571698c57290f674/addon/components/power-select.ts#L519
    if (e.key === "Tab" && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }

    if (!["ArrowUp", "ArrowDown"].includes(e.key)) {
      return;
    }

    const first = select.results.at(0);
    const last = select.results.at(-1);

    if (
      (e.key === "ArrowUp" && select.highlighted !== first) ||
      (e.key === "ArrowDown" && select.highlighted !== last)
    ) {
      return;
    }

    const item = e.key === "ArrowUp" ? last : first;
    e.preventDefault();
    select.actions.highlight(item);
    select.actions.scrollTo(item);
    return false;
  }
}
