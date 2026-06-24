import { DateTime } from "luxon";

// human readable string for the date format (to use as e.g. placeholder)
const PRETTY_FORMAT = "DD.MM.YYYY";

// the format for luxon, to result in DD.MM.YYYY
const LUXON_DISPLAY_FORMAT = "dd.MM.yyyy";

// format for luxon, to result in `$WEEKDAY, DD.MM.YYYY`, e.g. `Wednesday, 24.06.2026`
const WEEKDAY_DISPLAY_FORMAT = `EEEE, ${LUXON_DISPLAY_FORMAT}`;

// we're a bit more lenient when parsing
const LUXON_PARSE_FORMAT = "d.M.yyyy";

// parse a DD.MM.YYYY string to a `DateTime` (for validity, check `dt.isValid`, this never returns null)
const fromString = (value: string) =>
  DateTime.fromFormat(value, LUXON_PARSE_FORMAT);

// format a datetime into `DD.MM.YYYY` string
const dateToString = (value: DateTime<true>) =>
  value.toFormat(LUXON_DISPLAY_FORMAT);

export {
  fromString,
  dateToString,
  dateToString as toString,
  PRETTY_FORMAT,
  LUXON_DISPLAY_FORMAT,
  WEEKDAY_DISPLAY_FORMAT,
};
