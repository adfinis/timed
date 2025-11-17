import { helper } from "@ember/component/helper";
import moment from "moment";

import startPaddingTag from "customer-center/utils/start-padding-tag";

export function formatDurationShort(params) {
  let duration = Array.isArray(params) ? params[0] : params;

  //remove "-" from negative numbers
  const negative = duration < 0;

  duration = moment.duration(Math.abs(duration));

  const str = startPaddingTag(2)`${Math.trunc(
    duration.asHours()
  )}:${duration.minutes()}`;

  return negative ? `-${str}` : str;
}

export default helper(formatDurationShort);
