import { action } from "@ember/object";
import Component from "@glimmer/component";
import { task, timeout } from "ember-concurrency";

export default class OptimizedPowerSelectComponent extends Component {
  get extra() {
    return this.args.extra ?? {};
  }

  @task
  *highlightTask(select, item) {
    yield timeout(0);
    select.actions.highlight(item);
    select.actions.scrollTo(item);
  }

  @action
  onFocus({ actions, isOpen }) {
    if (!isOpen) {
      actions.open();
    }
  }

  @action
  onKeydown(select, e) {
    // this implementation is heavily inspired by the enter key handling of EPS
    // https://github.com/cibernox/ember-power-select/blob/6e3d5781a105515b915d407d571698c57290f674/addon/components/power-select.ts#L519
    if (e.keyCode === 9 && select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    } else if (e.keyCode === 40 && select.isOpen) {
      const highlighted = select.results.indexOf(select.highlighted);
      if (highlighted === select.results.length - 1) {
        e.preventDefault();
        this.highlightTask.perform(select, select.results[0]);
      }
    } else if (e.keyCode === 38 && select.isOpen) {
      const highlighted = select.results.indexOf(select.highlighted);
      if (highlighted === 0 || highlighted === -1) {
        e.preventDefault();
        this.highlightTask.perform(
          select,
          select.results[select.results.length - 1],
        );
      }
    }
  }
}
