/** @param {Array<Array<string>>} parsedCSV */
const isValidCSV = (rows) => {
  const nCommas = new Set(rows.map((row) => row.length));
  return nCommas.size === 1; // all rows have the same amount of commas
};

/** @param {string} csv */
const parseCSV = (csv) => {
  const lines = csv.trim().split("\n");
  return lines.map((l) => l.split(","));
};

export { parseCSV, isValidCSV };
