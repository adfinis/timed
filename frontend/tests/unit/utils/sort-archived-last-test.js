import { module, test } from "qunit";

import sortArchivedLast from "timed/utils/sort-archived-last";

const obj = (archived) => ({
  id: crypto.randomUUID(),
  name: crypto.randomUUID().slice(0, 10),
  archived,
});

module("Unit | Utility | sort-archived-last", function () {
  test("it works", function (assert) {
    const objs = Array(20)
      .fill(0)
      .map((_, i) => obj(i % 2 === 0));

    const result = objs.toSorted(sortArchivedLast((o) => o.name));
    assert.ok(result.slice(10).every((o) => o.archived));
    assert.ok(result.slice(0, 10).every((o) => !o.archived));
  });
});
