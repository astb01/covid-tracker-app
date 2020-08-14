import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

import "./LineGraph.css";

const COVID_HISTORY_ENDPOINT =
  "https://disease.sh/v3/covid-19/historical/all?lastdays=120";

const LineGraph = ({ caseType = "cases" }) => {
  const [data, setData] = useState({});

  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0.0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            parser: "MM/DD/YY",
            tooltipformat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  const buildGraphData = (data, caseType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data[caseType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);
      }

      lastDataPoint = data[caseType][date];
    }

    return chartData;
  };

  const fetchHistoricalData = async () => {
    const response = await fetch(COVID_HISTORY_ENDPOINT);
    const responseData = await response.json();

    const chartData = buildGraphData(responseData, caseType);
    setData(chartData);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [caseType]);

  return (
    <div className="lineGraph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#d9c3c3",
                borderColor: "#782424",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
