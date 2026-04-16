import { action } from "@ember/object";
import Component from "@glimmer/component";
import moment from "moment";

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
    switch (expr) {
      case "This Week":
        this.args.onUpdateFromDate(moment().day(1));
        this.args.onUpdateToDate(null);
        break;
      case "This Month":
        this.args.onUpdateFromDate(moment().date(1));
        this.args.onUpdateToDate(null);
        break;
      case "This Year":
        this.args.onUpdateFromDate(moment().dayOfYear(1));
        this.args.onUpdateToDate(null);
        break;
      case "Last Week":
        this.args.onUpdateFromDate(moment().subtract(1, "week").day(1));
        this.args.onUpdateToDate(moment().subtract(1, "week").day(7));
        break;
      case "Last Month":
        this.args.onUpdateFromDate(
          moment().subtract(1, "month").startOf("month"),
        );
        this.args.onUpdateToDate(moment().subtract(1, "month").endOf("month"));
        break;
      case "Last Year":
        this.args.onUpdateFromDate(
          moment().subtract(1, "year").startOf("year"),
        );
        this.args.onUpdateToDate(moment().subtract(1, "year").endOf("year"));
        break;
    }
  }
}
