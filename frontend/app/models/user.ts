import { service } from "@ember/service";
import type { SyncHasMany, AsyncHasMany } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, hasMany } from "@ember-data/model";
import type StoreService from "@ember-data/store";
import moment from "moment";
import type AbsenceBalance from "timed/models/absence-balance";
import type Employment from "timed/models/employment";
import type WorktimeBalance from "timed/models/worktime-balance";
/**
 * The user model
 *
 * @class User
 * @extends DS.Model
 * @public
 */
export default class User extends Model {
  @service declare store: StoreService;
  /**
   * The username
   *
   * @property {String} username
   * @public
   */
  @attr("string")
  declare username?: string;

  /**
   * The first name
   *
   * @property {String} firstName
   * @public
   */
  @attr("string")
  declare firstName?: string;

  /**
   * The last name
   *
   * @property {String} lastName
   * @public
   */
  @attr("string")
  declare lastName?: string;

  /**
   * The email address
   *
   * @property {String} email
   * @public
   */
  @attr("string")
  declare email?: string;

  /**
   * Defines if the user is a superuser
   *
   * @property {Boolean} isSuperuser
   * @public
   */
  @attr("boolean")
  declare isSuperuser?: boolean;

  /**
   * Whether a user is active
   *
   * @property {Boolean} isActive
   * @public
   */
  @attr("boolean")
  declare isActive?: boolean;

  /**
   * Whether the user is a reviewer in a project
   *
   * @property {Boolean} isReviewer
   * @public
   */
  @attr("boolean")
  declare isReviewer?: boolean;

  /**
   * Whether the user is an accountant
   */
  @attr("boolean", { defaultValue: false })
  declare isAccountant: boolean;

  /**
   * Whether the user completed the app tour
   *
   * @property {Boolean} tourDone
   * @public
   */
  @attr("boolean")
  declare tourDone?: boolean;

  /**
   * The users supervisors
   *
   * @property {User[]} supervisors
   * @public
   */
  @hasMany("user", { inverse: "supervisees", async: false })
  declare supervisors: SyncHasMany<User>;

  /**
   * The users supervisees
   *
   * @property {User[]} supervisees
   * @public
   */
  @hasMany("user", { inverse: "supervisors", async: false })
  declare supervisees: SyncHasMany<User>;

  /**
   * The users employments
   *
   * @property {Employment[]} employments
   * @public
   */
  @hasMany("employment", { async: true, inverse: "user" })
  declare employments: AsyncHasMany<Employment>;

  /**
   * The users worktime balances
   *
   * @property {WorktimeBalance[]} worktimeBalances
   * @public
   */
  @hasMany("worktime-balance", { async: true, inverse: "user" })
  declare worktimeBalances: AsyncHasMany<WorktimeBalance>;

  /**
   * The users absence balances
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  @hasMany("absence-balance", { async: true, inverse: "user" })
  declare absenceBalances: AsyncHasMany<AbsenceBalance>;

  /**
   * The full name
   *
   * Consists of the first and last name
   *
   * @property {String} fullName
   * @public
   */
  get fullName() {
    if (!this.firstName && !this.lastName) {
      return "";
    }

    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * The long name
   *
   * Consists of the full name and the username. If no full name is given, only
   * the username is returned
   *
   * @property {String} longName
   * @public
   */
  get longName() {
    return this.fullName
      ? `${this.fullName} (${this.username})`
      : this.username;
  }

  /**
   * The active employment
   *
   * An employment is active as soon as it doesn't have a to date
   *
   * @property {Employment} activeEmployment
   * @public
   */
  get activeEmployment() {
    return (
      this.store.peekAll("employment").find((e) => {
        return (
          e.get("user.id") === this.id &&
          (!e.get("end") || e.get("end").isSameOrAfter(moment.now(), "day"))
        );
      }) || null
    );
  }

  /**
   * The current worktime balance
   *
   * @property {WorktimeBalance} currentWorktimeBalance
   * @public
   */
  get currentWorktimeBalance() {
    return (
      this.store.peekAll("worktime-balance").find((balance) => {
        return (
          balance.get("user.id") === this.id &&
          balance.get("date").isSame(moment(), "day")
        );
      }) || null
    );
  }

  toJSON() {
    const { data } = this.serialize();
    return {
      ...data,
      id: this.id,
    };
  }
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    user: User;
  }
}
