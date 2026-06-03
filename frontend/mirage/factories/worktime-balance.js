import { DateTime } from "luxon";
import { Factory } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => DateTime.now(),
  balance: () => randomDuration(),
});
