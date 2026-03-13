import { module, test } from "qunit";

import sortArchivedLast from "timed/utils/sort-archived-last";

const obj = (o) => ({
  id: crypto.randomUUID(),
  name: crypto.randomUUID().slice(0, 10),
  ...o,
});

const isSorted = (arr, compareFn) =>
  arr.toSorted(compareFn).every((el, idx) => el === arr[idx]);

const compareFn = (a, b) => (a.name > b.name ? 1 : -1);

module("Unit | Utility | sort-archived-last", function () {
  test("it works", function (assert) {
    const objs = Array(20)
      .fill(0)
      .map((_, i) => obj({ archived: i % 2 === 0 }));

    const result = objs.toSorted(sortArchivedLast(compareFn));
    const [archived, notArchived] = [result.slice(10), result.slice(0, 10)];

    assert.ok(archived.every((o) => o.archived));
    assert.ok(notArchived.every((o) => !o.archived));
    assert.ok(isSorted(archived, compareFn));
    assert.ok(isSorted(notArchived, compareFn));
  });

  test("it allows custom getters", function (assert) {
    const objs = Array(20)
      .fill(0)
      .map((_, i) => obj({ foo: i % 2 === 0 }));

    const result = objs.toSorted(sortArchivedLast(compareFn, (o) => o.foo));
    const [archived, notArchived] = [result.slice(10), result.slice(0, 10)];

    assert.ok(archived.every((o) => o.foo));
    assert.ok(notArchived.every((o) => !o.foo));
    assert.ok(isSorted(archived, compareFn));
    assert.ok(isSorted(notArchived, compareFn));
  });
});
