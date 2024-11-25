import Component from "@glimmer/component";
import moment from "moment";
import humanizeDuration from "timed/utils/humanize-duration";

// TODO: take this from tailwind.config.js
const FONT_SANS = ['"Source Sans 3"', "sans-serif"];
const FONT_MONO = ['"Source Code Pro"', "monospace"];

const cssvar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name);

export default class WorktimeBalanceChart extends Component {
  type = "line";

  get data() {
    if (!this.args.worktimeBalances) {
      return [];
    }

    return {
      labels: this.args.worktimeBalances.map((b) => b.date),
      datasets: [
        {
          data: this.args.worktimeBalances.map(({ balance }) =>
            Number.parseFloat(balance.asHours().toFixed(2)),
          ),
        },
      ],
    };
  }

  get options() {
    return {
      tension: 0,
      // lineTension: 0,
      legend: { display: false },
      layout: { padding: 10 },
      elements: {
        line: {
          tension: 0,
          borderColor: cssvar("--primary"),
          backgroundColor: "transparent",
          borderWidth: 2,
        },
        point: {
          borderColor: cssvar("--tertiary"),
          backgroundColor: `rgb(${cssvar("--background")})`,
          hoverBackgroundColor: cssvar("--background-muted"),
          hoverBorderColor: cssvar("--primary"),
          borderWidth: 2,
          hoverBorderWidth: 2,
          radius: 3.5,
          hoverRadius: 3.5,
          hitRadius: 10,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              callback(value) {
                return [value.format("DD"), value.format("dd").toUpperCase()];
              },
              fontFamily: FONT_MONO,
              fontColor: `rgb(${cssvar("--foreground-muted")})`,
              fontSize: 18,
            },
            gridLines: {
              drawBorder: false,
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              display: false,
            },
            gridLines: {
              zeroLineColor: `rgb(${cssvar("--foreground-muted")})`,
              color: `rgb(${cssvar("--foreground-muted")})`,
              drawBorder: false,
              drawTicks: false,
              borderDash: [5, 5],
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: cssvar("--background-muted"),
        titleFontColor: cssvar("--foreground"),
        bodyFontColor: cssvar("--foreground"),
        displayColors: false,
        cornerRadius: 2,
        bodyFontFamily: FONT_SANS,
        bodyFontSize: 16,
        titleFontFamily: FONT_SANS,
        titleFontSize: 18,
        titleFontStyle: "normal",
        titleMarginBottom: 10,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          title([{ index }], { labels }) {
            return labels[index].format("DD.MM.YYYY");
          },
          label({ yLabel: hours }) {
            return humanizeDuration(moment.duration({ hours }));
          },
        },
      },
    };
  }
}
