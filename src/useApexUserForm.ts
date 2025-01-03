import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import * as ApexUtils from "./ApexUtils";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import apiEndpointsProd from "./api-endpoints.json";
import apiEndpointsDev from "./api-endpoints-dev.json";
import uuid from "react-uuid";
import { ApexApiEndpoints } from "./apexInterfaces";

interface User {
  uid: string;
  email: string | null;
}

export interface FormState {
  age: number;
  risk: number;
  sector: string;
  activeSectorImageIndex: number;
  loading: boolean;
}

export interface FormStateSetters {
  setAge: React.Dispatch<React.SetStateAction<number>>;
  setRisk: React.Dispatch<React.SetStateAction<number>>;
}

const apiEndpoints: ApexApiEndpoints = process.env.REACT_APP_DEV_MODE
  ? apiEndpointsDev
  : apiEndpointsProd;

export const useApexUserForm = () => {
  const { currentUser } = useAuth() as { currentUser: User | null };
  const [age, setAge] = useState<number>(18);
  const [risk, setRisk] = useState<number>(1);
  const [sector, setSector] = useState<string>(ApexUtils.DEFAULT_USER_FORM_SECTOR as string);
  const [activeSectorImageIndex, setActiveSectorImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  // Domain that routes to ELB
  const makePieEndpoint: string = apiEndpoints["makePieEndpoint"];

  // Handler for when the user clicks Submit and requests a diversified Pie based on their inputs.
  // A loading screen should show in the front-end immediately after the Submit button is clicked.
  // The loading screen should stay until the backend server confirms that the new Pie has been
  // calculated and stored in the Firebase DB.
  // Once the backend server gives this confirmation, we will serve the PieResults page, which
  // will show another loading screen until the Plotly chart is fetched from the backend.
  async function handleSubmit(event: { preventDefault: () => void; }) {
    // Show "Creating Your Pie ..." screen while waiting for Pie to be published to DB
    setLoading(true);

    event.preventDefault();

    // in the case of a guest user, we will generate a temporary UUID for them
    // TODO: delete this UUID and its contents from the DB after the user's session is over
    const uid: string = currentUser ? currentUser["uid"] : uuid();

    // Send request to backend server to calculate a diversified Pie
    // for the user's selected inputs (age, risk tolerance, and sector).
    // Wait for the request to finish.
    await fetch(makePieEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        email: currentUser ? currentUser["email"] : null,
        age: age,
        risk: risk,
        sector: sector,
        is_guest: currentUser ? false : true,
      }),
    });

    // Move to the PieResults page after confirming that backend server finished making Pie.
    // Also sends the current state as props to the PieResults page so that
    // the PieResults page has access to the user's selected inputs.
    history.push("/pieresults", {
      uid: uid,
      email: currentUser ? currentUser["email"] : null,
      age: age,
      risk: risk,
      sector: sector,
      cameFromUserForm: true,
    });
  }

  const handleSelect = (selectedIndex, e) => {
    setActiveSectorImageIndex(selectedIndex % 4);
    setSector(ApexUtils.SECTORS[selectedIndex % 4]);
  };

  return {
    formState: {age, risk, sector, activeSectorImageIndex, loading} as FormState,
    formStateSetters: {setAge, setRisk} as FormStateSetters,
    handleSubmit,
    handleSelect
  }
}