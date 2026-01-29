import {
  clampDuration,
  durationAsString,
  durationAsStringWithSeconds,
  normalizeStringDuration,
  normalizeStringDayDuration,
  parseDurationFromString,
  roundDuration,
} from "#src/utils/duration.ts";
import { Duration } from "luxon";

import { module, test } from "qunit";

module("Unit | Utility | duration", function () {
  test("rounding works", function (assert) {
    const base = Duration.fromObject({ minutes: 10 });
    const dirty = Duration.fromObject({ minutes: 22 });
    const result = roundDuration(base)(dirty);

    assert.deepEqual(result.as("minutes"), 20);
  });

  test("clamping works", function (assert) {
    const min = Duration.fromObject({ minutes: 13 });
    const max = Duration.fromObject({ hours: 7, minutes: 11 });

    const clamp = clampDuration(min, max);

    assert.deepEqual(clamp(Duration.fromMillis(0)).as("minutes"), 13);
    assert.deepEqual(
      clamp(Duration.fromObject({ years: 10 })).as("minutes"),
      max.as("minutes"),
    );

    const duration = Duration.fromObject({ hours: 2, minutes: 15 });
    assert.deepEqual(clamp(duration).as("minutes"), duration.as("minutes"));
  });

  test("normalizing strings to day duration works", function (assert) {
    assert.deepEqual(normalizeStringDayDuration(""), "");
    assert.deepEqual(normalizeStringDayDuration("aa"), "");
    assert.deepEqual(normalizeStringDayDuration("1:abc"), "1:");
    assert.deepEqual(normalizeStringDayDuration("1:::"), "1:");
    assert.deepEqual(normalizeStringDayDuration("00001:::"), "0000");
    assert.deepEqual(normalizeStringDayDuration("120"), "120");
    assert.deepEqual(normalizeStringDayDuration("1"), "1");
  });

  test("normalizing strings works", function (assert) {
    assert.deepEqual(normalizeStringDuration(""), "");
    assert.deepEqual(normalizeStringDuration("aa"), "");
    assert.deepEqual(normalizeStringDuration("1:abc"), "1:");
    assert.deepEqual(normalizeStringDuration("1:::"), "1:");
    assert.deepEqual(normalizeStringDuration("00001:::"), "00001:");
    assert.deepEqual(normalizeStringDuration("120"), "120");
    assert.deepEqual(normalizeStringDuration("1"), "1");
    assert.deepEqual(normalizeStringDuration("150:45"), "150:45");
  });

  test("converting duration to string with works", function (assert) {
    assert.deepEqual(
      durationAsStringWithSeconds(Duration.fromMillis(0)),
      "00:00:00",
    );
    assert.deepEqual(
      durationAsStringWithSeconds(
        Duration.fromObject({ hours: 12, minutes: 1, seconds: 8 }),
      ),
      "12:01:08",
    );

    assert.deepEqual(
      durationAsStringWithSeconds(
        Duration.fromObject({ hours: -421, minutes: -1, seconds: -8 }),
      ),
      "-421:01:08",
    );
  });

  test("converting duration to string works", function (assert) {
    assert.deepEqual(durationAsString(Duration.fromMillis(0)), "00:00");
    assert.deepEqual(
      durationAsString(Duration.fromObject({ minutes: 12 })),
      "00:12",
    );

    assert.deepEqual(
      durationAsString(
        Duration.fromObject({ minutes: -46, hours: -7 }).rescale(),
      ),
      "-07:46",
    );

    assert.deepEqual(
      durationAsString(Duration.fromObject({ hours: 123, minutes: 1 })),
      "123:01",
    );

    assert.deepEqual(
      durationAsString(
        Duration.fromObject({ hours: 123, minutes: 1 }).rescale(),
      ),
      "123:01",
    );
    assert.deepEqual(
      durationAsString(parseDurationFromString("-1200:45")),
      "-1200:45",
    );
  });

  test("parsing duration from string works", function (assert) {
    assert.deepEqual(parseDurationFromString("").as("milliseconds"), 0);
    assert.deepEqual(parseDurationFromString("1200").as("hours"), 12);
    assert.deepEqual(
      parseDurationFromString("13:40").as("minutes"),
      13 * 60 + 40,
    );
    assert.deepEqual(
      parseDurationFromString("-123:50").as("minutes"),
      -(123 * 60 + 50),
    );
    assert.deepEqual(parseDurationFromString("12345:00").as("hours"), 12345);
    assert.deepEqual(
      parseDurationFromString("-1200:45").as("minutes"),
      -(1200 * 60 + 45),
    );
  });
});
