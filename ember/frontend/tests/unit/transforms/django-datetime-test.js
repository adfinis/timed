import { setupTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { MODES } from "timed/transforms/luxon-dt";

module("Unit | Transform | django datetime", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    const datetime = DateTime.fromObject({
      year: 2017,
      month: 3,
      day: 11,
      hour: 15,
      minute: 30,
      second: 50,
      millisecond: 11,
    });

    const result = transform.serialize(datetime, { t: MODES.datetime });

    assert.strictEqual(result, datetime.toISO());
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    const datetime = DateTime.fromObject({
      year: 2017,
      month: 3,
      day: 11,
      hour: 15,
      minute: 30,
      second: 50,
      millisecond: 11,
    }).toUTC();

    assert.notOk(transform.deserialize("", { t: MODES.datetime }));
    assert.notOk(transform.deserialize(null, { t: MODES.datetime }));

    const result = transform
      .deserialize(datetime.toISO(), { t: MODES.datetime })
      .toUTC();

    assert.strictEqual(result.toISO(), datetime.toISO());
  });
});
