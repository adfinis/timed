import { action } from "@ember/object";
import Component from "@glimmer/component";
import { DateTime, Info } from "luxon";

const CURRENT_YEAR = DateTime.now().year;

const YEARS_IN_FUTURE = 5;

export default class Calendar extends Component {
  _months = Info.months();

  years = [...new Array(40).keys()].map(
    (i) => `${CURRENT_YEAR + YEARS_IN_FUTURE - i}`,
  );

  get months() {
    return this._months.map((label, idx) => ({ label, n: idx + 1 }));
  }

  fromJSDate(date) {
    return DateTime.fromJSDate(date);
  }

  @action
  changeCenter(unit, calendar, e) {
    const newCenter = DateTime.fromJSDate(calendar.center).set({
      [unit]: parseInt(e.target.value),
    });
    calendar.actions.changeCenter(newCenter.toJSDate());
  }
}
