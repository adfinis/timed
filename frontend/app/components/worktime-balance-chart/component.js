import Component from "@glimmer/component";
import moment from "moment";
import humanizeDuration from "timed/utils/humanize-duration";

const FONT_FAMILY = "Source Sans Pro";

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
            Number.parseFloat(balance.asHours().toFixed(2))
          ),
        },
      ],
    };
  }

  get options() {
    return {
      lineTension: 0,
      legend: { display: false },
      layout: { padding: 10 },
      elements: {
        line: {
          borderColor: "rgb(91, 142, 219)",
          backgroundColor: "transparent",
          borderWidth: 2,
        },
        point: {
          borderColor: "rgb(91, 142, 219)",
          backgroundColor: "rgb(255, 255, 255)",
          hoverBackgroundColor: "rgb(0,0,0)",
          borderWidth: 2,
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
              fontFamily: FONT_FAMILY,
              fontColor: "rgb(180, 180, 180)",
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
              drawBorder: false,
              drawTicks: false,
              borderDash: [5, 5],
            },
          },
        ],
      },
      tooltips: {
        displayColors: false,
        cornerRadius: 4,
        bodyFontFamily: FONT_FAMILY,
        bodyFontSize: 12,
        titleFontFamily: FONT_FAMILY,
        titleFontSize: 14,
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
