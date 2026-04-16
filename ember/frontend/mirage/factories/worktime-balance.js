import { Factory } from "miragejs";
import moment from "moment";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => moment(),
  balance: () => randomDuration(),
});
