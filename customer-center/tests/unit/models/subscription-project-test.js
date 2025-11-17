import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

import ENV from "customer-center/config/environment";

module("Unit | Model | timed subscription project", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const model = store.createRecord("subscription-project", {});
    assert.ok(model);
  });

  test("it works", function (assert) {
    const store = this.owner.lookup("service:store");

    const model = store.createRecord("subscription-project", {
      name: "Project #1",
      purchasedTime: moment.duration(4, "hours"),
      spentTime: moment.duration(2, "hours"),
      orders: [
        store.createRecord("subscription-order", {
          acknowledged: true,
          duration: moment.duration(5, "hours"),
        }),
        store.createRecord("subscription-order", {
          acknowledged: false,
          duration: moment.duration(5, "hours"),
        }),
        store.createRecord("subscription-order", {
          acknowledged: false,
          duration: moment.duration(5, "hours"),
        }),
      ],
    });

    assert.strictEqual(model.totalTime.as("hours"), 2);
    assert.strictEqual(model.unconfirmedTime.as("hours"), 10);
    assert.strictEqual(model.percentage, 0.5);
  });

  test("it warns when time is almost up", function (assert) {
    const store = this.owner.lookup("service:store");

    const model_warn = store.createRecord("subscription-project", {
      name: "Project #1",
      purchasedTime: moment.duration(ENV.APP.alertTime, "hours"),
      spentTime: moment.duration(0, "hours"),
    });

    assert.true(model_warn.isTimeAlmostConsumed);

    const model_ok = store.createRecord("subscription-project", {
      name: "Project #2",
      purchasedTime: moment.duration(ENV.APP.alertTime + 1, "hours"),
      spentTime: moment.duration(0, "hours"),
    });

    assert.false(model_ok.isTimeAlmostConsumed);
  });
});
