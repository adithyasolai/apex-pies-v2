import { ApexApiEndpoints } from "./apexInterfaces";

import apiEndpointsProd from "./resources/api-endpoints.json";
import apiEndpointsDev from "./resources/api-endpoints-dev.json";

const apiEndpoints: ApexApiEndpoints = process.env.REACT_APP_DEV_MODE
  ? apiEndpointsDev
  : apiEndpointsProd;

const fetchSavedPieEndpoint: string = apiEndpoints["fetchSavedPieEndpoint"];

export interface fetchSavedPieDataInput {
  uid: string;
  pieNum: number
}

export const fetchSavedPieData = async ({uid, pieNum}: fetchSavedPieDataInput): Promise<any> => {
  // Send request to backend server to fetch the Pie & Plotly information
  // for the current userId. Wait for the request to give a response.
  const response = await fetch(fetchSavedPieEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: uid,
      pieNum: pieNum.toString(),
    }),
  });

  return await response.json();
}

const fetchNumSavedEndpoint = apiEndpoints["fetchNumSavedEndpoint"];

export interface fetchNumSavedPiesInput {
  uid: string;
}

// Fetch number of Pies saved to the given account
export const fetchNumSavedPies = async ({uid}: fetchNumSavedPiesInput): Promise<any> => {
  const response = await fetch(fetchNumSavedEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: uid
    }),
  });

  return await response.json();
}