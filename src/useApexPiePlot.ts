import { useAuth } from "./contexts/AuthContext";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { fetchSavedPieData } from "./apexClient";

// TODO: Make more custom types for the format of the `data` map and `layout` map.
export interface PlotConfig {
  data: any;
  layout: any;
}

export interface ApexPiePlotLogicalFields {
  plotConfig: RefObject<PlotConfig>;
  loading: boolean;
}

export interface ApexPiePlotLogicProps {
  pieNum: number;
  active: boolean;
}

export const useApexPiePlot = ({
  pieNum,
  active,
}: ApexPiePlotLogicProps): ApexPiePlotLogicalFields => {
  const { currentUser } = useAuth();
  const uid = useRef<string>(currentUser["uid"]);
  const pieNumRef: RefObject<number> = useRef(pieNum);

  const pie = useRef(null);
  const pieRows = useRef<Array<any>>([]);

  const plotConfig = useRef<PlotConfig>({ data: null, layout: null });

  const [loading, setLoading] = useState<boolean>(true);

  // retrieves Pie data from a previously-saved Pie, and then
  // constructs config values needed to render the Pie via Plotly
  const constructPlotConfigs = useCallback(async () => {
    try {
      // fetch saved pie data from backend
      const json = await fetchSavedPieData({
        uid: uid.current,
        pieNum: pieNumRef.current,
      });
      pie.current = json.pie;
      pieRows.current = json.pieRows;

      // simplify pie chart with just sector slices only
      var sector_data_dict = {};
      pieRows.current.forEach((row) => {
        var currSector = row["Sector"];
        var currPct = row["Percentage"];
        var currColor = row["Color"];

        if (currSector in sector_data_dict) {
          sector_data_dict[currSector][0] += currPct;
        } else {
          sector_data_dict[currSector] = new Array(2);
          sector_data_dict[currSector][0] = currPct;
          sector_data_dict[currSector][1] = currColor;
        }
      });

      // create exact ordering of Sector keys
      var sector_list = Object.keys(sector_data_dict);
      var colors = new Array(sector_list.length);
      var percentages = new Array(sector_list.length);

      sector_list.forEach((sector, index) => {
        percentages[index] = sector_data_dict[sector][0];
        colors[index] = sector_data_dict[sector][1];
      });

      // construct plot configs
      var data = [
        {
          values: percentages,
          labels: sector_list,
          type: "pie",
          // customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]),
          // hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
          marker: {
            colors: colors,
          },
          hoverinfo: "none",
        },
      ];

      var layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: true,
        legend: {
          x: 0.5,
          y: -0.1,
          xanchor: "center",
          yanchor: "top",
          orientation: "h",
        },
      };

      plotConfig.current = {
        data: data,
        layout: layout,
      };

      // Remove the loading screen so that the page can finally be rendered.
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Putting the fetchPieData() function as a dependency here is what
  // makes TS compiler/linter force us to wrap that function in a
  // useCallback() above.
  useEffect(() => {
    if (!active) {
      return;
    }

    constructPlotConfigs();
  }, [constructPlotConfigs, active]); // this triggers a re-render of the return Components every time this Pie is the active on in the carousel

  return {
    plotConfig,
    loading,
  };
};
