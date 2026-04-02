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
  } else if (lines === 2) {
    return "content-line-2";
  } else if (lines === 3) {
    return "content-line-3";
  }
  return "content-line-4";
}

export default helper(reportCommentLengthClass);
