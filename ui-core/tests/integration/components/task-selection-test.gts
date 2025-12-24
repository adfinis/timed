import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render } from '@ember/test-helpers';
import TaskSelection, {
  CUSTOMERS,
  PROJECTS,
  TASKS,
} from '#src/components/task-selection.gts';
import { get } from '@ember/helper';

const nop = () => {};

module('Integration | Component | task-selection', function (hooks) {
  setupRenderingTest(hooks);

  test('initial values work', async function (assert) {
    await render(
      <template>
        <TaskSelection @customer={{get CUSTOMERS 0}} @onChange={{nop}} />
      </template>,
    );

    assert.dom('[data-test-customer]').hasText(CUSTOMERS[0]!.name);

    await render(
      <template>
        <TaskSelection @project={{get PROJECTS 0}} @onChange={{nop}} />
      </template>,
    );

    assert.dom('[data-test-project]').hasText(PROJECTS[0]!.name);

    await render(
      <template>
        <TaskSelection @task={{get TASKS 0}} @onChange={{nop}} />
      </template>,
    );

    assert.dom('[data-test-task]').hasText(TASKS[0]!.name);
  });
});
