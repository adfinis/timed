/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper } from "@ember/component/helper";

export function reportCommentLengthClass([commentContent]) {
  const lines = (commentContent || "").split("\n").length;
  if (lines <= 1) {
    return "content-line-1";
  } else if (lines >= 4) {
    return "content-line-4";
  }
  return `content-line-${lines}`;
}

export default helper(reportCommentLengthClass);
