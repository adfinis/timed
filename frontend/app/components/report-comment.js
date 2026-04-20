import Component from "@glimmer/component";

const HEIGHT_MAP = {
  1: "content-line-1",
  2: "content-line-2",
  3: "content-line-3",
};

export default class ReportCommentTextarea extends Component {
  get tooltip() {
    const parts = [];
    if (this.args.customerVisible) {
      parts.push("This project's comments are visible to the customer");
      parts.push("===================================================");
      parts.push("");
    }
    parts.push(this.args.value);
    return parts.join("\n");
  }

  get heightClass() {
    const lines = (this.args.value || "").split("\n").length;
    return HEIGHT_MAP[lines] || "content-line-4";
  }
}
