import { DateTime } from "luxon";

import absenceType from "timed/mirage/factories/absence-type";
const NUMBER_REGEX = /^\d+$/;

const fromRow = (row, users, absenceTypes) => {
  if (!row) return [null, "???"];
  if (row.length === 4) return [null, "Invalid row"];
  const [username, comment, rawType, rawDate, rawCount] = row;

  const date = DateTime.fromISO(rawDate);
  if (date.invalid) return [null, `Invalid Date: ${rawDate}`];
  if (!NUMBER_REGEX.exec(rawCount)) {
    return [null, `Invalid Anzahl: ${rawCount}`];
  }
  const days = parseInt(rawCount);
  const type = absenceTypes.find((at) => at.name === rawType);
  if (!type) return [null, `Invalid Absence Type: ${rawType}`];

  const user = users.find((u) => u.username === username);
  if (!user) return [null, `Invalid Username: ${username}`];

  return [
    {
      user,
      comment,
      absenceType: type,
      date,
      days,
    },
    null,
  ];
};

export { fromRow };
