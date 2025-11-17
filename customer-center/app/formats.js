export default {
  time: {
    hhmmss: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    },
  },
  date: {
    hhmmss: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    },
  },
  number: {
    compact: { notation: "compact" },
    CHF: {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    EUR: {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
};
