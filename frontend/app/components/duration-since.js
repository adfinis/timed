/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";
import { Duration, DateTime } from "luxon";

const ZERO_DURATION = Duration.fromMillis(0);

/**
 * The duration since component
 *
 * This component helps to determine the duration from a certain moment until
 * now. Optionally you can provide an already elapsed time to add to the
 * duration.
 *
 * Example:
 * ```htmlbars
 * {{duration-since someStartMoment elapsed=someDuration}}
 * ```
 *
 * @class DurationSinceComponent
 * @extends Ember.Component
 * @public
 */
export default class DurationSinceComponent extends Component {
  constructor(...args) {
    super(...args);
    this.timer.perform();
  }

  /**
   * The moment from which the duration is computed
   *
   * @property {import('luxon').DateTime} from
   * @public
   */
  get from() {
    return this.args.from ?? DateTime.now();
  }

  /**
   * The already elapsed time which is added to the computed duration
   *
   * @property {import('Luxon').Duration)} elapsed
   * @public
   */
  get elapsed() {
    return this.args.elapsed ?? ZERO_DURATION;
  }

  /**
   * The total duration since the from moment plus the elapsed time
   *
   * @property {import('luxon').Duration} duration
   * @public
   */
  @tracked duration = ZERO_DURATION;

  /**
   * Compute the duration
   *
   * @method _compute
   * @private
   */
  _compute() {
    this.duration = DateTime.now().diff(this.from).plus(this.elapsed);
  }

  /**
   * The timer function, which causes the duration to be recomputed every second
   *
   * @proprety {*} timer
   * @public
   */
  timer = task(async () => {
    while (true) {
      this._compute();

      /* istanbul ignore else */
      if (Ember.testing) {
        return;
      }

      /* istanbul ignore next */
      // eslint-disable-next-line no-await-in-loop
      await timeout(1000);
    }
  });
}
