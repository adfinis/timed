/**
 * @module timed
 * @submodule timed-adapters
 * @public
 */
import ApplicationAdapter from "timed/adapters/application";

/**
 * The activity block adapter
 *
 * @class ActivityBlockAdapter
 * @extends ApplicationAdapter
 * @public
 */
export default class ActivityBlockAdapter extends ApplicationAdapter {
  /**
   * Custom url for updating records
   *
   * This causes a reload of the activity so we don't have to do the reload
   * ourselves
   *
   * @method urlForUpdateRecord
   * @return {String} The URL
   * @public
   */
  urlForUpdateRecord(...args) {
    return `${super.urlForUpdateRecord(...args)}?include=activity`;
  }

  /**
   * Custom url for creating records
   *
   * This causes a reload of the activity so we don't have to do the reload
   * ourselves
   *
   * @method urlForCreateRecord
   * @return {String} The URL
   * @public
   */
  urlForCreateRecord(...args) {
    return `${super.urlForCreateRecord(...args)}?include=activity`;
  }
}

declare module "ember-data/types/registries/adapter" {
  export default interface AdapterRegistry {
    "activity-block": ActivityBlockAdapter;
  }
}
