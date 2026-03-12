/**
 * Wrap a sorting function to use with e.g. `Array.prototype.toSorted`, so that archvied elements are last
 */
export default function sortArchivedLast(
  sortFn,
  getter = (obj) => obj.archived,
) {
  return (a, b) => {
    if (getter(a) ^ getter(b)) {
      return getter(a) ? 1 : -1;
    }

    return sortFn(a, b);
  };
}
