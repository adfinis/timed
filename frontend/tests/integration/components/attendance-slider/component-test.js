import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

const ATTENDANCE = EmberObject.create({
  from: DateTime.fromObject({ hour: 8, minute: 0, second: 0, millisecond: 0 }),
  to: DateTime.fromObject({ hour: 8, minute: 0, second: 0, millisecond: 0 }),
});

module("Integration | Component | attendance slider", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("attendance", ATTENDANCE);

    await render(hbs`<AttendanceSlider @attendance={{this.attendance}} />`);

    assert.dom(".noUi-connect").exists();
  });

  test("can delete", async function (assert) {
    assert.expect(1);
    this.set("attendance", ATTENDANCE);

    this.set("deleteAction", (attendance) => {
      assert.ok(attendance);
    });

    await render(hbs`<AttendanceSlider
  @attendance={{this.attendance}}
  @onDelete={{this.deleteAction}}
/>`);

    await click(".fa-trash-can");
  });

  test("can handle attendances until 00:00", async function (assert) {
    this.set(
      "attendance",
      EmberObject.create({
        from: DateTime.fromObject({ hour: 0, minute: 0, second: 0 }),
        to: DateTime.fromObject({ hour: 0, minute: 0, second: 0 }),
      }),
    );

    await render(hbs`<AttendanceSlider @attendance={{this.attendance}} />`);

    assert.dom("span").hasText("24:00");
  });
});
