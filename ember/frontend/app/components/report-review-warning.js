import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class ReportReviewWarning extends Component {
  @service currentUser;

  @service unverifiedReports;

  @service rejectedReports;

  get class() {
    return `text-primary hover:text-foreground-primary hover:bg-primary-light p-2 gap-1 grid-cols-[auto,minmax(0,1fr)] grid items-center h-full ${
      this.args.class ?? ""
    }`;
  }
}
