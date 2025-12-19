import type { TOC } from '@ember/component/template-only';
import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked, cached } from '@glimmer/tracking';

type Task = {
  id: number;
  customerId: number;
  projectId: number;
  name: string;
};

type Project = Omit<Task, 'projectId'>;
type Customer = Omit<Project, 'customerId' | 'tasks'>;

type Mapping = {
  customer: Customer;
  project: Project;
  task: Task;
};

interface PlaceholderSignature {
  Args: {
    placeholder: string;
  };
}

type InitialValues =
  | { customer?: Customer; project?: never; task?: never }
  | { customer?: never; project?: Project; task?: never }
  | { customer?: never; project?: never; task?: Task }
  | { customer?: never; project?: never; task?: never };

export interface TaskSelectionSignature {
  Args: {
    showTasksAsRecent?: boolean;
    onChange: <K extends keyof Mapping>(
      name: K,
      value: Nullable<Mapping[K]>,
    ) => void;
  } & InitialValues;
  Blocks: {
    default: [];
  };
  Element: null;
}

const N_CUSTOMERS = 200;
const N_PROJECTS_PER_CUSTOMER = 50;
const N_TASKS_PER_PROJECT = 20;

export const CUSTOMERS: Customer[] = Array(N_CUSTOMERS)
  .fill(0)
  .map((_, i) => ({ id: i + 1, name: `customer ${i + 1}` }));

export const PROJECTS: Project[] = CUSTOMERS.flatMap((c) => {
  const base = (c.id - 1) * N_PROJECTS_PER_CUSTOMER + 1;
  return Array(N_PROJECTS_PER_CUSTOMER)
    .fill(0)
    .map((_, j) => ({
      id: base + j,
      name: `project: ${base + j}`,
      customerId: c.id,
    }));
});

export const TASKS: Task[] = PROJECTS.flatMap((p) => {
  const base = (p.id - 1) * N_TASKS_PER_PROJECT + 1;
  return Array(N_TASKS_PER_PROJECT)
    .fill(0)
    .map((_, j) => ({
      id: base + j,
      name: `task: ${base + j}`,
      customerId: p.customerId,
      projectId: p.id,
    }));
});

const Placeholder = <template>
  <span class="text-foreground-muted">{{@placeholder}}</span>
</template> satisfies TOC<PlaceholderSignature>;

export default class TaskSelection extends Component<TaskSelectionSignature> {
  recents = Array(10)
    .fill(0)
    .map(
      () =>
        TASKS[
          ~~(
            Math.random() *
            N_TASKS_PER_PROJECT *
            N_PROJECTS_PER_CUSTOMER *
            N_CUSTOMERS
          )
        ]!,
    );

  @cached
  get options(): (Task | Customer)[] {
    if (this.args.showTasksAsRecent) {
      return [...this.recents, ...CUSTOMERS];
    }
    return CUSTOMERS;
  }

  @cached
  get projects() {
    if (!this.customer) {
      return null;
    }
    return PROJECTS.filter((p) => this.customer!.id === p.customerId);
  }

  @cached
  get tasks() {
    if (!this.project) {
      return null;
    }
    return TASKS.filter((t) => this.project!.id === t.projectId);
  }

  @cached
  get task() {
    return this._task;
  }

  @cached
  get project() {
    const task = this.task;
    return task
      ? PROJECTS.find((p) => p.id === task.projectId)!
      : this._project;
  }

  @cached
  get customer() {
    const task = this.task;
    if (task) return CUSTOMERS.find((c) => c.id === task.customerId)!;
    const project = this.project;
    if (project) return CUSTOMERS.find((c) => c.id === project.customerId)!;
    return this._customer;
  }

  @tracked _customer = null as Nullable<Customer>;
  @tracked _project = null as Nullable<Project>;
  @tracked _task = null as Nullable<Task>;

  constructor(
    ...args: ConstructorParameters<typeof Component<TaskSelectionSignature>>
  ) {
    super(...args);

    const { task, project, customer } = this.args;

    if (task) {
      this._task = task;
      return;
    }
    if (project) {
      this._project = project;
      return;
    }
    if (customer) {
      this._customer = customer;
    }
  }

  #clear = (scope: keyof Mapping) => {
    if (scope === 'task') return;
    this._task = null;
    if (scope === 'project') return;
    this._project = null;
  };

  #update = <K extends keyof Mapping>(name: K, value: Nullable<Mapping[K]>) => {
    const k = `_${name}` as const;
    if (this[k]?.id === value?.id) return;
    this.#clear(name);
    this[k] = value as this[typeof k];
    this.args.onChange(name, value);
  };

  isTask = (value: (typeof this.options)[number] | null) =>
    !!value && 'projectId' in value;

  onCustomer = (value: (typeof this.options)[number] | null) => {
    if (this.args.showTasksAsRecent && this.isTask(value)) {
      this.#update('task', value);
      return;
    }
    this.#update('customer', value);
  };

  onProject = (value: typeof this._project) => {
    this.#update('project', value);
  };

  onTask = (value: typeof this._task) => {
    this.#update('task', value);
  };

  <template>
    {{#let
      (component
        PowerSelect
        placeholderComponent=Placeholder
        allowClear=true
        renderInPlace=true
        searchField="name"
        searchEnabled=true
      )
      as |Select|
    }}
      <Select
        @selected={{this.customer}}
        @options={{this.options}}
        @onChange={{this.onCustomer}}
        @placeholder="Customer"
        @labelText="Customer"
        as |cust|
      >
        <div data-test-customer>
          {{#if (this.isTask cust)}}
            {{#let cust as |task|}}
              {{task.customerId}}
              >
              {{task.projectId}}
              >
              {{task.name}}
            {{/let}}
          {{else}}
            {{cust.name}}
          {{/if}}
        </div>
      </Select>
      <Select
        @selected={{this.project}}
        @options={{this.projects}}
        @onChange={{this.onProject}}
        @placeholder="Project"
        @labelText="Project"
        as |proj|
      >
        <div data-test-project>{{proj.name}}</div>
      </Select>
      <Select
        @selected={{this.task}}
        @onChange={{this.onTask}}
        @options={{this.tasks}}
        @placeholder="Task"
        @labelText="Task"
        as |task|
      >
        <div data-test-task>{{task.customerId}}</div>
      </Select>
    {{/let}}
  </template>
}
