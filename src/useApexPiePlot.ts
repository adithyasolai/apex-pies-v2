import apiEndpointsProd from "./resources/api-endpoints.json";
import apiEndpointsDev from "./resources/api-endpoints-dev.json";
import { useAuth } from "./contexts/AuthContext";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { ApexApiEndpoints } from "./apexInterfaces";

// TODO: Make more custom types for the format of the `data` map and `layout` map.
export interface PlotConfig {
  data: any;
  layout: any;
}

export interface ApexPiePlotLogicalFields {
  plotConfig: RefObject<PlotConfig>;
  loading: boolean;
}

const apiEndpoints: ApexApiEndpoints = process.env.REACT_APP_DEV_MODE
  ? apiEndpointsDev
  : apiEndpointsProd;

export interface ApexPiePlotLogicProps {
  pieNum: number;
  active: boolean;
}

export const useApexPiePlot = ({
  pieNum, active
}: ApexPiePlotLogicProps): ApexPiePlotLogicalFields => {
  const { currentUser } = useAuth();
  const uid = useRef<string>(currentUser["uid"]);
  const pieNumRef: RefObject<number> = useRef(pieNum);

  const fetchSavedPieEndpoint: string = apiEndpoints["fetchSavedPieEndpoint"];

  const pie = useRef(null);
  const pieRows = useRef<Array<any>>([]);

  const plotConfig = useRef<PlotConfig>({ data: null, layout: null });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchPieData = useCallback(async () => {
    try {
      // Send request to backend server to fetch the Pie & Plotly information
      // for the current userId. Wait for the request to give a response.
      const response = await fetch(fetchSavedPieEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid.current,
          pieNum: pieNumRef.current.toString(),
        }),
      });

      // extract plot data from backend
      const json = await response.json();
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
      // construct plot configs as soon as results from backend come
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
      // var data = [{
      //   values: pie.current['Percentage'],
      //   labels: pie.current['Ticker'],
      //   type: 'pie',
      //   customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]),
      //   hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
      //   marker: {
      //     colors: pie.current['Color']
      //   }
      // }]

      var layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        // showlegend: false
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
  }, [fetchSavedPieEndpoint]);

  // Putting the fetchPieData() function as a dependency here is what
  // makes TS compiler/linter force us to wrap that function in a 
  // useCallback() above.
  useEffect(() => {
    if (!active) {
      return;
    }

    fetchPieData();
  }, [fetchPieData, active]); // this triggers a re-render of the return Components every time this Pie is the active on in the carousel

  return {
    plotConfig,
    loading,
  };
};
