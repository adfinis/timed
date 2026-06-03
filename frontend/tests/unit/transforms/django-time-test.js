import { setupTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { MODES } from "timed/transforms/luxon-dt";

module("Unit | Transform | django time", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    const result = transform.serialize(
      DateTime.fromObject({
        hour: 12,
        minute: 12,
        second: 12,
      }),
      { t: MODES.time },
    );

    assert.strictEqual(result, "12:12:12");

    const result2 = transform.serialize(
      DateTime.fromObject({
        hour: 8,
        minute: 8,
        second: 8,
      }),
      { t: MODES.time },
    );

    assert.strictEqual(result2, "08:08:08");
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:luxon-dt");

    const result = transform.deserialize("12:12:12", { t: MODES.time });

    assert.strictEqual(result.hour, 12);
    assert.strictEqual(result.minute, 12);
    assert.strictEqual(result.second, 12);

    const result2 = transform.deserialize("08:08:08", { t: MODES.time });

    assert.strictEqual(result2.hour, 8);
    assert.strictEqual(result2.minute, 8);
    assert.strictEqual(result2.second, 8);
  });
});
