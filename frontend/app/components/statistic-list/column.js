import Component from "@glimmer/component";
import { DateTime } from "luxon";

export default class StatisticListColumn extends Component {
  dateTimeForMonth(month) {
    return DateTime.fromObject({ month });
  }
}
