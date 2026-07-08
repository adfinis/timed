import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import { tracked } from "tracked-built-ins";

import Checkbox from "timed/components/checkbox";
import Modal from "timed/components/modal";

export default class TableColumnPicker extends Component {
  @tracked isModalVisible = false;
  @service userSettings;
  @service notify;

  get tableName() {
    return this.args.tableName;
  }

  columns = tracked(this.userSettings.getTableColumns(this.tableName));

  @action
  toggleColumn(column) {
    column.isVisible = !column.isVisible;
    this.columns = [...this.columns];
  }

  @action
  save() {
    try {
      for (const column of this.columns) {
        this.userSettings.updateColumnVisibility(
          this.tableName,
          column.label,
          column.isVisible,
        );
      }
      this.isModalVisible = !this.isModalVisible;
    } catch {
      this.notify.error("Could not update the table column configuration.");
    }
  }
  <template>
    <button
      type="button"
      title="Toggle table column visibility"
      class="btn btn-default"
      {{on "click" (toggle "isModalVisible" this)}}
      ...attributes
    >
      <FaIcon @icon="gear" @prefix="fas" @size="sm" />
    </button>
    {{#if this.isModalVisible}}
      <Modal
        @visible={{this.isModalVisible}}
        @onClose={{toggle "isModalVisible" this}}
        class="md:w-auto"
        as |modal|
      >
        <div class="sm:min-w-[32rem]">
          <modal.header>
            <h3>Toggle Table Columns</h3>
          </modal.header>
          <modal.body class="grid gap-2">
            {{#each this.columns as |column|}}
              <Checkbox
                @checked={{column.isVisible}}
                @onChange={{fn this.toggleColumn column}}
              >
                {{column.label}}
              </Checkbox>
            {{/each}}
          </modal.body>
          <modal.footer class="flex justify-end">
            <button
              class="btn btn-primary"
              type="button"
              {{on "click" this.save}}
            >
              Save
            </button>
          </modal.footer>
        </div>
      </Modal>
    {{/if}}
  </template>
}
