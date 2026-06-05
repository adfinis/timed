import { service } from "@ember/service";
import Component from "@glimmer/component";
import ListItem from "timed/components/topnav/list-item";
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import luxonFormat from "timed/helpers/luxon-format";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";

export default class ReportReviewWarning extends Component {
  @service currentUser;

  @service unverifiedReports;

  @service rejectedReports;

  get class() {
    return `text-primary hover:text-foreground-primary hover:bg-primary-light p-2 gap-1 grid-cols-[auto,minmax(0,1fr)] grid items-center h-full ${
      this.args.class ?? ""
    }`;
  }
  <template>
    {{#if this.unverifiedReports.hasReports}}
      <ListItem
        class="nav-top-list-item h-full"
        title="You have reports to verify"
      >
        <LinkTo
          @route="analysis.index"
          class="{{this.class}}"
          @query={{hash
            fromDate=null
            toDate=(luxonFormat
              this.unverifiedReports.reportsToDate "yyyy-MM-dd"
            )
            reviewer=this.currentUser.user.id
            editable=1
            rejected=null
            verified=0
            customer=null
            project=null
            task=null
            user=null
            billingType=null
            costCenter=null
            review=null
            notBillable=null
          }}
        >
          <FaIcon @icon="exclamation-triangle" @prefix="fas" />
          {{this.unverifiedReports.amountReports}}
        </LinkTo>
      </ListItem>
    {{/if}}
    {{#if this.rejectedReports.hasReports}}
      <ListItem
        class="nav-top-list-item h-full"
        title="You have rejected reports"
      >
        <LinkTo
          class="{{this.class}}"
          @route="analysis.index"
          @query={{hash
            fromDate=null
            toDate=null
            user=this.currentUser.user.id
            editable=1
            rejected=1
            verified=0
            customer=null
            project=null
            task=null
            reviewer=null
            billingType=null
            costCenter=null
            review=null
            notBillable=null
          }}
        >
          <FaIcon @icon="circle-xmark" />
          {{this.rejectedReports.amountReports}}
        </LinkTo>
      </ListItem>
    {{/if}}
  </template>
}
