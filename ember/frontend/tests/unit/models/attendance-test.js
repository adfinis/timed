import { setupTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module("Unit | Model | attendance", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner.lookup("service:store").modelFor("attendance");

    assert.ok(model);
  });

  test("calculates the duration", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .createRecord("attendance", {
        from: DateTime.fromObject({ hour: 8, minute: 0, second: 0 }),
        to: DateTime.fromObject({ hour: 17, minute: 0, second: 0 }),
      });

    assert.strictEqual(model.get("duration").as("hours"), 9);
  });

  test("calculates the duration when the end time is 00:00", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .createRecord("attendance", {
        from: DateTime.fromObject({ hour: 0, minute: 0, second: 0 }),
        to: DateTime.fromObject({ hour: 0, minute: 0, second: 0 }),
      });

    assert.strictEqual(model.get("duration").as("hours"), 24);
  });
});
