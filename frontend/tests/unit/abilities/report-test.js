import EmberObject from "@ember/object";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";
import setupCurrentUser from "timed/tests/helpers/current-user-mock";

module("Unit | Ability | report", function (hooks) {
  setupTest(hooks);
  setupCurrentUser(hooks);

  test("can edit when user is superuser", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ isSuperuser: true });

    assert.true(ability.canEdit);
    assert.false(await ability.canAedit());
  });

  test("can edit when user is superuser and report is verified", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ isSuperuser: true });
    ability.set("model", { verifiedBy: EmberObject.create({ id: 1 }) });

    assert.true(ability.canEdit);
    assert.false(await ability.canAedit());
  });

  test("can edit when user owns report", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ id: 1 });
    ability.set("model", { user: EmberObject.create({ id: 1 }) });

    assert.true(ability.canEdit);
    assert.false(await ability.canAedit());
  });

  test("can edit when user is supervisor of owner", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ id: 1 });
    ability.set("model", {
      user: EmberObject.create({ supervisors: [{ id: 1 }] }),
    });

    assert.false(ability.canEdit);
    assert.true(await ability.canAedit());
  });

  test("can edit when user reviewer of project", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const user = EmberObject.create({ id: 1 });
    const projectAssignee = [{ user }];
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = user;
    ability.set(
      "model",
      EmberObject.create({
        projectAssignees: projectAssignee,
      })
    );

    assert.false(ability.canEdit);
    assert.true(await ability.canAedit());
  });

  test("can not edit when verified", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ id: 1, isSuperuser: false });
    ability.set("model", {
      user: EmberObject.create({ id: 2, supervisors: [{ id: 2 }] }),
      task: { project: { reviewers: [{ id: 2 }] } },
      projectAssignees: [{ id: 2 }],
      verifiedBy: EmberObject.create({ id: 2 }),
    });

    assert.false(ability.canEdit);
    assert.false(await ability.canAedit());
  });

  test("can not edit when not allowed", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ id: 1, isSuperuser: false });
    ability.set("model", {
      user: EmberObject.create({ id: 2, supervisors: [{ id: 2 }] }),
      task: { project: { reviewers: [{ id: 2 }] } },
      projectAssignees: [{ id: 2 }],
    });

    assert.false(ability.canEdit);
    assert.false(await ability.canAedit());
  });

  test("can not edit when report is verified and billed", async function (assert) {
    const ability = this.owner.lookup("ability:report");
    const currentUser = this.owner.lookup("service:currentUser");
    currentUser.user = EmberObject.create({ id: 1, isSuperuser: false });
    ability.set("model", {
      user: EmberObject.create({ id: 1, supervisors: [{ id: 1 }] }),
      projectAssignees: [{ id: 1 }],
      verifiedBy: EmberObject.create({ id: 1 }),
      billed: true,
    });

    assert.false(ability.canEdit);
    assert.false(await ability.canAedit());
  });
});
