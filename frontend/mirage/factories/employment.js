import { faker } from "@faker-js/faker";
import { Duration } from "luxon";
import { Factory, trait } from "miragejs";

import DjangoDurationTransform from "timed/transforms/django-duration";

export default Factory.extend({
  percentage: faker.helpers.arrayElement([50, 60, 80, 100]),
  // location: association(),
  // user: association(),

  isExternal: false,

  worktimePerDay() {
    const worktime = Duration.fromMillis(
      (Duration.fromObject({ hours: 8, minutes: 30 }).toMillis() / 100) *
        this.percentage,
    );

    return DjangoDurationTransform.create().serialize(worktime);
  },

  start: () => faker.date.past(4),
  end: () => faker.date.past(1),

  active: trait({
    start: () => faker.date.recent(),
    end: null,
  }),

  afterCreate(employment, server) {
    employment.update({ locationId: server.create("location").id });
  },
});
