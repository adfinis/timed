import { faker } from "@faker-js/faker";
import { Duration } from "luxon";

import DjangoDurationTransform from "timed/transforms/django-duration";

export function randomDuration(precision = 15, seconds = false, maxHours = 2) {
  const h = faker.number.int({ max: maxHours });
  const m = Math.abs(
    Math.ceil(faker.number.int({ min: 0, max: 60 }) / precision) * precision,
  );
  const s = Math.abs(seconds ? faker.number.int({ max: 59, min: 0 }) : 0);

  return DjangoDurationTransform.create().serialize(
    Duration.fromObject({ hours: h, minutes: m, seconds: s }),
  );
}
