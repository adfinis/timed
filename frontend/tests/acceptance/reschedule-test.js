import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import moment from 'moment'
import { Response } from 'ember-cli-mirage'

describe('Acceptance | reschedule', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 6)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it("can't visit /reschedule on mobile", async function() {
    setBreakpoint('mo')

    await visit('/reschedule')

    expect(currentURL()).to.equal('/')
  })

  it('can visit /reschedule', async function() {
    await visit('/reschedule')

    expect(currentURL()).to.equal('/reschedule')
  })

  it('can not visit /reschedule as non staff user', async function() {
    let nonStaffUser = server.create('user', { isStaff: false })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: nonStaffUser.id })

    await visit('/reschedule')

    expect(currentURL()).to.equal('/')
  })

  it('can search and edit a report', async function() {
    await visit('/reschedule')
    await userSelect('[data-test-filter-user]')
    await click('[data-test-filter-apply]')

    expect(find('[data-test-reschedule-report]').length).to.equal(6)

    await fillIn(
      '[data-test-reschedule-report-id="1"] .form-group:eq(6) input',
      'Changed'
    )

    expect(
      find(`${'[data-test-reschedule-report-id="1"]'} button:disabled`).length
    ).to.not.be.ok

    await click('[data-test-reschedule-report-id="1"] button')

    expect(find('[data-test-reschedule-report-id="1"] button:disabled').length)
      .to.be.ok
  })

  it('can filter by interval', async function() {
    await visit('/reschedule')

    expect(currentURL()).to.not.contain('from_date')
    expect(currentURL()).to.not.contain('to_date')

    click('[data-test-filter-from-date] input')

    await click(
      `[data-date=${moment()
        .subtract(2, 'day')
        .format('YYYY-MM-DD')}]`
    )

    click('[data-test-filter-to-date] input')

    await click(
      `[data-date=${moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD')}]`
    )

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('from_date')
    expect(currentURL()).to.contain('to_date')
  })

  it('can filter by customer', async function() {
    await visit('/reschedule')

    await selectChoose(`.customer-select`, '.ember-power-select-option', 1)

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('customer')
  })

  it('can filter by project', async function() {
    await visit('/reschedule')

    await selectChoose(`.customer-select`, '.ember-power-select-option', 1)
    await selectChoose(`.project-select`, '.ember-power-select-option', 1)

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('customer')
    expect(currentURL()).to.contain('project')
  })

  it('can filter by task', async function() {
    await visit('/reschedule')

    taskSelect()

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('customer')
    expect(currentURL()).to.contain('project')
    expect(currentURL()).to.contain('task')
  })

  it('can filter by user', async function() {
    await visit('/reschedule')

    userSelect('[data-test-filter-user]')

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('user')
  })

  it('can filter by reviewer', async function() {
    await visit('/reschedule')

    userSelect('[data-test-filter-reviewer]')

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('reviewer')
  })

  it('can filter by billing type', async function() {
    server.createList('billing-type', 5)

    await visit('/reschedule')

    let options = find('[data-test-filter-billing-type] select option')

    expect(options).to.have.length(6)

    let [, { value }] = options

    await fillIn('[data-test-filter-billing-type] select', value)

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('billing_type')
  })

  it('shows proper empty state messages', async function() {
    server.get('/reports', () => new Response(200, {}, { data: [] }))

    await visit('/reschedule')

    await click('[data-test-filter-apply]')

    expect(find('[data-test-filter-results]').length).to.equal(0)

    expect(find('div.text-center').text()).to.contain('filter parameters')

    await visit('/reschedule')

    userSelect('[data-test-filter-user]')

    await click('[data-test-filter-apply]')

    expect(find('[data-test-filter-results]').length).to.equal(0)

    expect(find('div.text-center').text()).to.contain('any results')
  })

  it('can take initial customer', async function() {
    await visit('/reschedule?customer=1')

    expect(
      find('[data-test-filter-customer] .ember-power-select-selected-item')
        .text()
        .trim()
    ).to.be.ok
  })

  it('can take initial project', async function() {
    await visit('/reschedule?project=1')

    expect(
      find('[data-test-filter-project] .ember-power-select-selected-item')
        .text()
        .trim()
    ).to.be.ok
  })

  it('can take initial task', async function() {
    await visit('/reschedule?task=1')

    expect(
      find('[data-test-filter-task] .ember-power-select-selected-item')
        .text()
        .trim()
    ).to.be.ok
  })

  it('can take initial user', async function() {
    await visit('/reschedule?user=1')

    expect(
      find('[data-test-filter-user] .ember-power-select-selected-item')
        .text()
        .trim()
    ).to.be.ok
  })

  it('can verify a page', async function() {
    await visit('/reschedule?user=1')

    expect(
      find(
        '[data-test-reschedule-report] .form-group:nth-child(10) input:checked'
      )
    ).to.have.length(0)

    await click('[data-test-verify-page]')

    expect(
      find(
        '[data-test-reschedule-report] .form-group:nth-child(10) input:checked'
      )
    ).to.have.length(6)
  })

  it('resets filters when leaving the page', async function() {
    await visit('/reschedule?user=1&not_billable=1')

    await click('a[href="/me"]')

    expect(currentURL()).to.not.contain('reschedule')

    await click('a[href="/reschedule"]')

    expect(currentURL()).to.equal('/reschedule')
  })

  it('does not reset page size when leaving the page', async function() {
    await visit('/reschedule?page_size=100')

    await click('a[href="/me"]')

    expect(currentURL()).to.not.contain('reschedule')

    await click('a[href^="/reschedule"]')

    expect(currentURL()).to.equal('/reschedule?page_size=100')
  })
})
