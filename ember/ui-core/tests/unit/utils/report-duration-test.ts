import {
  parseStringDuration,
  REPORT_DURATION_MIN,
  REPORT_DURATION_MAX,
} from "#src/utils/report-duration.ts";
import { module, test } from "qunit";
import { Duration } from "luxon";

module("Unit | Utility | reportDuration", function () {
  test("parsing report duration from string works", function (assert) {
    assert.ok(parseStringDuration("23:59").equals(REPORT_DURATION_MAX));

    assert.ok(parseStringDuration("00").equals(REPORT_DURATION_MIN));
    assert.ok(parseStringDuration("00:").equals(REPORT_DURATION_MIN));
    assert.ok(parseStringDuration("0000").equals(REPORT_DURATION_MIN));

    assert.deepEqual(parseStringDuration("60").as("minutes"), 60);
    assert.deepEqual(parseStringDuration("90").as("minutes"), 90);
    assert.deepEqual(parseStringDuration("120").as("minutes"), 120);

    assert.deepEqual(parseStringDuration("15").as("minutes"), 15);
    assert.deepEqual(parseStringDuration("15:").as("hours"), 15);

    assert.deepEqual(parseStringDuration("2").as("hours"), 2);
    assert.deepEqual(parseStringDuration("2:").as("hours"), 2);
    assert.deepEqual(parseStringDuration("10").as("hours"), 10);
    assert.deepEqual(parseStringDuration("10:").as("hours"), 10);
    assert.deepEqual(parseStringDuration("1000").as("hours"), 10);
    assert.deepEqual(parseStringDuration("200").as("hours"), 2);
    assert.ok(
      parseStringDuration("1015").equals(
        Duration.fromObject({ hours: 10, minutes: 15 }),
      ),
    );
  });
});
