import React, { useEffect } from "react";
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
  },
};

export interface ApexPiePlotDisplayProps {
  pieNum: number;
  active: boolean
}

const PiePlot = ({pieNum, active}: ApexPiePlotDisplayProps) => {
  const {
    fetchPieData,
    plotConfig,
    loading
  }: ApexPiePlotLogicalFields = useApexPiePlot({pieNum});

  useEffect(() => {
    if (!active) {
      return;
    }

    fetchPieData();
  }, [fetchPieData, active]); // this triggers a re-render of the return Components every time this Pie is the active on in the carousel

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
        ...(active ? {} : { opacity: "10%" })
      }}
    
    />
  );
};

export default PiePlot;
