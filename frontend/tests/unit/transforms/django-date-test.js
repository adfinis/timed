import { setupTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { MODES } from "timed/transforms/luxon-dt";

module("Unit | Transform | django date", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    const result = transform.serialize(
      DateTime.fromObject({ year: 2017, month: 3, day: 11 }),
      { t: MODES.date },
    );

    assert.strictEqual(result, "2017-03-11");
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    assert.notOk(transform.deserialize("", { t: MODES.date }));
    assert.notOk(transform.deserialize(null, { t: MODES.date }));

    const result = transform.deserialize("2017-03-11", { t: MODES.date });

    assert.strictEqual(result.year, 2017);
    assert.strictEqual(result.month, 3);
    assert.strictEqual(result.day, 11);
  });
});
