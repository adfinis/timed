import { action } from "@ember/object";
import Component from "@glimmer/component";
import { DateTime } from "luxon";

export default class DateButtonsComponent extends Component {
  choices = [
    "This Week",
    "This Month",
    "This Year",
    "Last Week",
    "Last Month",
    "Last Year",
  ];

  @action
  selectDate(expr) {
    const now = DateTime.now();
    switch (expr) {
      case "This Week":
        this.args.onUpdateFromDate(now.startOf("week"));
        this.args.onUpdateToDate(null);
        break;
      case "This Month":
        this.args.onUpdateFromDate(now.startOf("month"));
        this.args.onUpdateToDate(null);
        break;
      case "This Year":
        this.args.onUpdateFromDate(now.startOf("year"));
        this.args.onUpdateToDate(null);
        break;
      case "Last Week": {
        const lastWeek = now.minus({ weeks: 1 });
        this.args.onUpdateFromDate(lastWeek.startOf("week"));
        this.args.onUpdateToDate(lastWeek.endOf("week"));
        break;
      }
      case "Last Month": {
        const lastMonth = now.minus({ months: 1 });
        this.args.onUpdateFromDate(lastMonth.startOf("month"));
        this.args.onUpdateToDate(lastMonth.endOf("month"));
        break;
      }
      case "Last Year": {
        const lastYear = now.minus({ years: 1 });
        this.args.onUpdateFromDate(lastYear.startOf("year"));
        this.args.onUpdateToDate(lastYear.endOf("year"));
        break;
      }
    }
  }
}
