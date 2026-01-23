import Component from "@glimmer/component";
import Layout from "../components/layout.gts";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { not } from "ember-truth-helpers";
import Modal from "#src/components/modal.gts";
import { Duration } from "luxon";
import Table from "#src/components/table.gts";
import { ReportDurationpicker } from "#src/components/durationpicker.gts";
import Checkbox from "#src/components/checkbox.gts";

type _Report = {
  customer: string;
  project: string;
  task: string;
  comment: string;
  duration: Duration;
  needsReview: boolean;
  notBillable: boolean;
};

class Report {
  @tracked declare customer: string;
  @tracked declare project: string;
  @tracked declare task: string;
  @tracked declare comment: string;
  @tracked declare duration: Duration;
  @tracked declare needsReview: boolean;
  @tracked declare notBillable: boolean;

  constructor(obj: _Report) {
    Object.assign(this, obj);
  }
}

export default class IndexTemplate extends Component {
  @tracked visible = false;

  report1 = new Report({
    customer: "customer",
    project: "big project",
    task: "technical work",
    comment: "implement X [#2313]",
    duration: Duration.fromObject({ minutes: 30 }),
    needsReview: false,
    notBillable: false,
  });

  report2 = new Report({
    customer: "$COMPANY",
    project: "small project",
    task: "mainteance",
    comment: "upgrade to new LTS version",
    duration: Duration.fromObject({ hours: 2, minutes: 15 }),
    needsReview: false,
    notBillable: false,
  });

  report3 = new Report({
    customer: "$CUSTOMER",
    project: "the project",
    task: "travel time",
    comment: "Zurich -> Berne -> Zurich",
    duration: Duration.fromObject({ hours: 2, minutes: 15 }),
    needsReview: false,
    notBillable: false,
  });

  reports = [this.report1, this.report2, this.report3];

  yes = () => {
    this.visible = false;
    alert("whoa");
  };

  set = <K extends keyof Report>(key: K, report: Report) => {
    return (value: Report[K]) => {
      report[key] = value;
    };
  };

  <template>
    <Layout>
      <:header>
        <h1 class="mb-5">Tracking</h1>
      </:header>

      <:main>

        <Table @striped={{true}} @last={{true}} as |t|>
          <t.thead class="collapse">
            <t.trh>
              <t.th>customer</t.th>
              <t.th>project</t.th>
              <t.th>task</t.th>
              <t.th class="w-1/4">comment</t.th>
              <t.th class="min-w-32">duration</t.th>
              <t.th>remaining effort</t.th>
              <t.th>flags</t.th>
            </t.trh>
          </t.thead>

          <t.tbody>
            {{#each this.reports as |r|}}
              <t.tr>
                <t.td>{{r.customer}}</t.td>
                <t.td>{{r.project}}</t.td>
                <t.td>{{r.task}}</t.td>
                <t.td>{{r.comment}}</t.td>
                <t.td><ReportDurationpicker
                    @onChange={{this.set "duration" r}}
                    @value={{r.duration}}
                    maxlength="5"
                  /></t.td>
                <t.td />
                <t.td>
                  <div class="grid">
                    <Checkbox
                      @onChange={{this.set "notBillable" r}}
                      @label="not billable"
                      @checked={{r.notBillable}}
                    />
                    <Checkbox
                      @onChange={{this.set "needsReview" r}}
                      @label="needs review"
                      @checked={{r.needsReview}}
                    />
                  </div>
                </t.td>
              </t.tr>
            {{/each}}
          </t.tbody>

        </Table>

        <button
          class="btn btn-primary mt-2"
          type="button"
          {{on "click" (fn (mut this.visible) (not this.visible))}}
        >reschedule</button>
        <Modal
          @visible={{this.visible}}
          @onClose={{fn (mut this.visible) false}}
          class="sm:min-w-[32rem] md:w-auto"
          as |m|
        >
          <m.header><h3>Modal</h3></m.header>
          <m.body>body</m.body>
          <m.footer class="flex justify-between">
            <button
              class="btn btn-danger"
              type="button"
              {{on "click" (fn (mut this.visible) false)}}
            >
              cancel
            </button>

            <button
              class="btn btn-primary"
              type="button"
              {{on "click" this.yes}}
            >
              ship it
            </button>
          </m.footer>
        </Modal>
      </:main>

    </Layout>
  </template>
}
