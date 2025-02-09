import { ApexApiEndpoints } from "./apexInterfaces";
import apiEndpointsProd from "./resources/api-endpoints.json";
import apiEndpointsDev from "./resources/api-endpoints-dev.json";
import { useAuth } from "./contexts/AuthContext";
import { useCallback, useRef, useState } from "react";

export interface ApexMyPiesLogicalFields {
  numSaved: number | null;
  activePie: number;
  age: number;
  risk: number;
  sector: string;
  tableRows: Array<any>;
  fetchPieData: () => Promise<void>;
  fetchSavedPieData: () => Promise<void>;
  handleSelect: (selectedIndex: number, e: any) => void;
}

const apiEndpoints: ApexApiEndpoints = process.env.REACT_APP_DEV_MODE
  ? apiEndpointsDev
  : apiEndpointsProd;

export const useApexMyPies = (): ApexMyPiesLogicalFields => {
  const { currentUser } = useAuth();

  const uid = useRef<string>(currentUser["uid"]);

  // this must start at `null` because we conditionally render the MyPies
  // page differently specifically when this is `null`.
  const [numSaved, setNumSaved] = useState<number | null>(null);
  const numSavedRef = useRef<number>(0);

  const age = useRef<number>(0);
  const risk = useRef<number>(0);
  const sector = useRef<string>("");

  const [activePie, setActivePie] = useState<number>(0);

  // backend response data
  const pie = useRef(null);
  const pieRows = useRef<any>({});

  // stock data table fields
  const [tableRows, setTableRows] = useState<Array<any>>([]);

  // Domain that routes to ELB
  const fetchNumSavedEndpoint = apiEndpoints["fetchNumSavedEndpoint"];
  const fetchSavedPieEndpoint = apiEndpoints["fetchSavedPieEndpoint"];

  const fetchPieData = useCallback(async () => {
    try {
      // Send request to backend server to fetch the Pie & Plotly information
      // for the current userId. Wait for the request to give a response.
      const response = await fetch(fetchNumSavedEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid.current,
        }),
      });

      // need to also wait for data to arrive
      const numSavedResponse = await response.json();

      // Put all the results from the backend server into our State to be rendered.
      // TODO: figure out better logic than a flat 4 limit
      setNumSaved(numSavedResponse);

      numSavedRef.current = numSavedResponse;
    } catch (err) {
      console.log(err);
    }
  }, [fetchNumSavedEndpoint]);

  const fetchSavedPieData = useCallback(async () => {
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
          pieNum: (numSavedRef.current - activePie).toString(),
        }),
      });

      // need to also wait for data to arrive
      const json = await response.json();

      // Put all the results from the backend server into our State to be rendered.
      pie.current = json.pie;
      pieRows.current = json.pieRows;
      age.current = json.age;
      risk.current = json.risk;
      sector.current = json.primarySector;

      // construct table row data
      setTableRows(
        pieRows.current.map((dict) => {
          const { Sector, Name, Ticker, Percentage } = dict; // Destructure desired fields
          const percentageString = `${Percentage}%`; // Concatenate '%'
          return { Sector, Name, Ticker, percentageString }; // Create a new object with selected fields
        })
      );
    } catch (err) {
      console.log(err);
    }
  }, [activePie, fetchSavedPieEndpoint]);

  const handleSelect = (selectedIndex, e) => {
    setActivePie(selectedIndex);
  };

  return {
    numSaved,
    activePie,
    age: age.current,
    risk: risk.current,
    sector: sector.current,
    tableRows,
    fetchPieData,
    fetchSavedPieData,
    handleSelect
  }
}