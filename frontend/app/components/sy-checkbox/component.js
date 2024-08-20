import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";

/**
 * Component for an adcssy styled checkbox
 *
 * @class SyCheckboxComponent
 * @extends Ember.Component
 * @public
 */
export default class SyCheckbox extends Component {
  constructor(...args) {
    super(...args);

    this.checkboxElementId = guidFor(this);
  }
}
