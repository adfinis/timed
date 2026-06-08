import { DateTime } from "luxon";
import { Factory, trait } from "miragejs";

export default Factory.extend({
  date: () => DateTime.now().toISODate(),

  morning: trait({
    fromTime: "08:00:00",
    toTime: "11:30:00",
  }),

  afternoon: trait({
    fromTime: "12:00:00",
    toTime: "17:00:00",
  }),
});
