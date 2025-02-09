import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { fetchCurrentPie, saveCurrentPie } from "./apexClient";

export interface ApexPieResultsLogicalFields {
  age: number;
  risk: number;
  sector: string;
  loading: boolean;
  saveAllowed: boolean;
  saveInProgress: boolean;
  saveDone: boolean;
  plotConfig: any;
  tableRows: Array<any>;
  handleSaveToProfile: (event: any) => Promise<void>;
}

interface PieResultsLocationState {
  uid?: string;
  age?: number;
  risk?: number;
  sector?: string;
}

export const useApexPieResults = (): ApexPieResultsLogicalFields => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const locationState = location.state as PieResultsLocationState;

  const uid = useRef<string>("");
  const age = useRef<number>(0);
  const risk = useRef<number>(0);
  const sector = useRef<string>("");

  const [loading, setLoading] = useState(true);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [saveAllowed, setSaveAllowed] = useState(Boolean(currentUser));
  const [saveDone, setSaveDone] = useState(false);

  // backend response data
  const pie = useRef(null);
  const pieRows = useRef<Array<any>>([]);

  // data calculated when backend data is received to make render logic faster
  const plotConfig = useRef<any>({});

  // stock data table fields
  const tableRows = useRef<Array<any>>([]);

  // makes a request to backend to create new Pie and retrieves
  // the Pie data to render it.
  const fetchPieData = useCallback(async () => {
    try {
      // fetch current Pie data (that was already constructed after user submitted UserForm)
      const json = await fetchCurrentPie({
        uid: uid.current,
        isGuest: currentUser ? false : true,
      });
      pie.current = json.pie;
      pieRows.current = json.pieRows;

      // construct table row data
      tableRows.current = pieRows.current.map((dict) => {
        const { Sector, Name, Ticker, Percentage } = dict; // Destructure desired fields
        const percentageString = `${Percentage}%`; // Concatenate '%'
        return { Sector, Name, Ticker, percentageString }; // Create a new object with selected fields
      });

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

      // // construct plot configs as soon as results from backend come
      // var data = [{
      //   values: pie.current['Percentage'],
      //   labels: pie.current['Ticker'],
      //   type: 'pie',
      //   customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]),
      //   hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
      //   marker: {
      //     colors: pie.current['Color']
      //   },
      // }]

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
  }, [currentUser]);

  useEffect(() => {
    uid.current = locationState?.uid!;
    age.current = locationState?.age!;
    risk.current = locationState?.risk!;
    sector.current = locationState?.sector!;

    fetchPieData();
  }, [
    currentUser,
    fetchPieData,
    locationState?.age,
    locationState?.risk,
    locationState?.sector,
    locationState?.uid,
  ]);

  const handleSaveToProfile = async (event) => {
    setSaveInProgress(true);

    event.preventDefault();

    // save current Pie to the user's account
    await saveCurrentPie({ uid: uid.current });

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    setSaveInProgress(false);
    setSaveAllowed(false);
    setSaveDone(true);
  };

  return {
    age: age.current,
    risk: risk.current,
    sector: sector.current,
    loading,
    saveAllowed,
    saveInProgress,
    saveDone,
    plotConfig: plotConfig.current,
    tableRows: tableRows.current,
    handleSaveToProfile,
  };
};
