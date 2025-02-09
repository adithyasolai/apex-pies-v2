import React from "react";
import Plot from "react-plotly.js";
import { ApexPiePlotLogicalFields, useApexPiePlot } from "./useApexPiePlot";

// const dummyPlotConfig = {
//   'data': [{
//     values: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
//     type: 'pie',
//     marker: {
//       colors: new Array(20).fill("#ADD8E6")
//     }
//   }],
//   'layout': {
//     paper_bgcolor: 'rgba(0,0,0,0)',
//     plot_bgcolor: 'rgba(0,0,0,0)',
//     showlegend: false
//   }
// }

const dummyPlotConfig = {
  data: [
    {
      values: [25, 25, 25, 25],
      labels: ["Banking", "Energy", "Health Care", "Technology"],
      type: "pie",
      marker: {
        colors: new Array(4).fill("#ADD8E6"),
      },
    },
  ],
  layout: {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: true,
    legend: {
      x: 0.5,
      y: -0.1,
      xanchor: "center",
      yanchor: "top",
      orientation: "h"
    }
  }
};

export interface ApexPiePlotDisplayProps {
  pieNum: number;
  active: boolean;
}

export const PiePlot = ({ pieNum, active }: ApexPiePlotDisplayProps) => {
  const { plotConfig, loading }: ApexPiePlotLogicalFields =
    useApexPiePlot({ pieNum, active });

  if (loading) {
    return <h2 className="text-center pb-5">loading ...</h2>;
  }

  return (
    <Plot
      data={active ? plotConfig.current["data"] : dummyPlotConfig["data"]}
      layout={active ? plotConfig.current["layout"] : dummyPlotConfig["layout"]}
      useResizeHandler={true}
      style={{
        width: "100%",
        height: "100%",
        ...(active ? {} : { opacity: "10%" }),
      }}
    />
  );
};
