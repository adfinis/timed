import {
  parseStringDuration,
  DAY_DURATION_MIN,
  DAY_DURATION_MAX,
} from "#src/utils/day-duration.ts";
import { module, test } from "qunit";
import { Duration } from "luxon";

module("Unit | Utility | Day Duration", function () {
  test("parsing day duration from string works", function (assert) {
    assert.ok(parseStringDuration("23:59").equals(DAY_DURATION_MAX));
    assert.ok(parseStringDuration("00").equals(DAY_DURATION_MIN));
    assert.ok(parseStringDuration("00:").equals(DAY_DURATION_MIN));
    assert.ok(parseStringDuration("0000").equals(DAY_DURATION_MIN));

    assert.deepEqual(parseStringDuration("120").as("minutes"), 60 + 20);

    assert.deepEqual(parseStringDuration("10").as("hours"), 10);
    assert.deepEqual(parseStringDuration("15").as("hours"), 15);
    assert.deepEqual(parseStringDuration(":15").as("minutes"), 15);

    assert.deepEqual(parseStringDuration("2").as("hours"), 2);
    assert.deepEqual(parseStringDuration("2:").as("hours"), 2);

    assert.ok(
      parseStringDuration("1016").equals(
        Duration.fromObject({ hours: 10, minutes: 16 }),
      ),
    );
  });
});
