import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";
import moment from "moment";

export default class FormatDurationHelper extends Helper {
  @service intl;

  compute(params) {
    const [duration] = params;
    const hours = Math.trunc(duration.as("hours"));

    // We dont want to show the minutes as minus
    const minutes =
      hours === 0
        ? duration.minutes()
        : moment.duration(Math.abs(duration)).minutes();

    const hoursString = this.intl.t("helper.format-duration.hours", {
      count: hours,
    });

    const minutesString = this.intl.t("helper.format-duration.minutes", {
      count: minutes,
    });

    return [hoursString, minutesString].filter(Boolean).join(" ") || 0;
  }
}
