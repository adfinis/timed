import { isTesting, macroCondition } from "@embroider/macros";
import VerticalCollectionComponent from "@html-next/vertical-collection/components/vertical-collection/component";

export default class VerticalCollection extends VerticalCollectionComponent {
  constructor(...args) {
    super(...args);

    if (macroCondition(isTesting())) {
      this.renderAll = true;
    }
  }
}
