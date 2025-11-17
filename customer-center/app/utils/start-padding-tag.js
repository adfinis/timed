/**
 * Add padding to all values in template literals.
 * Uses `String.prototype.padStart()` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart).
 *
 * @param {Integer} amount Amount of padding to apply
 * @param {String} [padding='0'] which character to use for padding.
 *
 * @return {Function} Tag for template literal.
 */
export default function startPaddingTag(amount, padding = "0") {
  /**
   * Tag function for template literal.
   *
   * @param {String[]} strings Split up plain strings from the literal.
   * @param {String[]} [...values] All values in the literal.
   *
   * @return {String} String with padding applied.
   */
  return (strings, ...values) => {
    let newString = "";
    values = values.map(String);
    strings.forEach((string, index) => {
      newString += string;
      if (values[index]) {
        newString += values[index].toString().padStart(amount, padding);
      }
    });
    return newString;
  };
}
