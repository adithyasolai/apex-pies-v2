import { useAuth } from "./contexts/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNumSavedPies, fetchSavedPieData } from "./apexClient";

export interface ApexMyPiesLogicalFields {
  numSaved: number | null; // needs to be optionally null bc render logic changes if null
  activePie: number;
  age: number;
  risk: number;
  sector: string;
  tableRows: Array<any>;
  handleSelect: (selectedIndex: number, e: any) => void;
}

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

  // fetch # of pies saved to user's account from backend,
  // and store this in the component state for other logic
  const storeNumSavedPies = useCallback(async () => {
    try {
      const numSavedResponse = await fetchNumSavedPies({ uid: uid.current });

      setNumSaved(numSavedResponse);
      numSavedRef.current = numSavedResponse;
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Fetch pie data for the current active pie,
  // and then constructs table row data needed for render.
  // TODO: rename this to also explain that the component state is updated too.
  const constructTableConfig = useCallback(async () => {
    try {
      // fetch pie data from backend
      const json = await fetchSavedPieData({
        uid: uid.current,
        pieNum: numSavedRef.current - activePie,
      });

      // Put all the results from the backend server into our State to be rendered.
      pie.current = json.pie;
      pieRows.current = json.pieRows;
      age.current = json.age;
      risk.current = json.risk;
      sector.current = json.primarySector;

      // construct table row data
      setTableRows(
        pieRows.current.map(({ Sector, Name, Ticker, Percentage }) => {
          const percentageString = `${Percentage}%`; // Concatenate '%'
          return { Sector, Name, Ticker, percentageString }; // Create a new object with selected fields
        })
      );
    } catch (err) {
      console.log(err);
    }
  }, [activePie]);

  // When the carousel left/right controls are pressed, update the
  // active pie, which will trigger `fetchSavedPieData()` effect
  // to get the new active Pie's data.
  const handleSelect = (selectedIndex, e) => {
    setActivePie(selectedIndex);
  };

  // This is the TS-equivalent of a useEffect with no dependencies,
  // which means it will run this when the component is first rendered.
  // TS linter/compiler forces us to put the function itself as a dep,
  // which forces us to wrap it in a callback above.
  useEffect(() => {
    storeNumSavedPies();
  }, [storeNumSavedPies]);

  // whenever the total number of saved Pies or the current active pie changes,
  // we want to fetch the current active Pie's data.
  useEffect(() => {
    if (numSaved !== null) {
      constructTableConfig();
    }
  }, [numSaved, activePie, constructTableConfig]);

  return {
    numSaved,
    activePie,
    age: age.current,
    risk: risk.current,
    sector: sector.current,
    tableRows,
    handleSelect,
  };
};
