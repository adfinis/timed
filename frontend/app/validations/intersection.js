/**
 * Given `changes` and `content` from a changeset validator, return wether a given `relation` has been changed.
 * @param {string} relation
 * @returns {(changes: Record<string, unknown>, content: Record<string, unknown>) => boolean}
 */
const relationChanged = (relation) => (changes, content) =>
  Object.keys(changes).includes(relation) &&
  (changes[relation]?.get("id") || null) !==
    (content[relation]?.get("id") || null);

const customerChanged = relationChanged("customer");
const projectChanged = relationChanged("project");

const validateVerified = (key, newValue, oldValue, changes, content) => {
  if (!newValue) {
    // when verified is false, it is valid
    return true;
  }

  // the task can be null when verifying multiple reports, therefore we
  // also validate against a change in customer/project
  if (
    (changes.task?.id && content.task?.id !== changes.task?.id) ||
    customerChanged(changes, content) ||
    projectChanged(changes, content)
  ) {
    return "Cannot verify and move report(s) at the same time.";
  }

  return true;
};

const validateIntersectionTask = (
  key,
  newValue,
  oldValue,
  changes,
  content,
) => {
  const hasTask = !!(newValue && newValue.id);

  // different customer -> different project -> different task
  // a report belongs to a task, therefore when customer/project are changed
  // task is no longer optional
  return (
    hasTask ||
    (!hasTask &&
      !customerChanged(changes, content) &&
      !projectChanged(changes, content)) ||
    "Task must not be empty"
  );
};

export default {
  verified: validateVerified,
  task: validateIntersectionTask,
};
