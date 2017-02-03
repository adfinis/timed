import FormatDurationHelper from 'timed/helpers/format-duration'
import { later }            from 'ember-runloop'
import moment               from 'moment'
import Ember                from 'ember'

const { testing } = Ember

export default FormatDurationHelper.extend({
  compute([ startTime, elapsed = moment.duration() ]) {
    let runtime = moment.duration(moment().diff(startTime)).add(elapsed)

    if (!testing) {
      /* istanbul ignore next */
      later(this, () => {
        this.recompute()
      }, 1000)
    }

    return this._super([ runtime ])
  }
})
