import { ApexApiEndpoints } from "./apexInterfaces";

import apiEndpointsProd from "./resources/api-endpoints.json";
import apiEndpointsDev from "./resources/api-endpoints-dev.json";

const apiEndpoints: ApexApiEndpoints = process.env.REACT_APP_DEV_MODE
  ? apiEndpointsDev
  : apiEndpointsProd;

type supportedHttpMethodTypes = "GET" | "POST"

interface genericApexCallInput {
  endpoint: string
  httpMethodType: supportedHttpMethodTypes
  inputParams: any
}

// Send request to backend server using given endpoint and input params, and return the response.
export const genericApexCall = async({endpoint, httpMethodType, inputParams}: genericApexCallInput): Promise<any> => {
  const response = await fetch(endpoint, {
    method: httpMethodType,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputParams),
  });

  return await response.json();
}

// Fetch pie data for given Pie from give account
const fetchSavedPieEndpoint: string = apiEndpoints["fetchSavedPieEndpoint"];
export interface fetchSavedPieDataInput {
  uid: string;
  pieNum: number
}
export const fetchSavedPieData = async ({uid, pieNum}: fetchSavedPieDataInput): Promise<any> => {
  return await genericApexCall({endpoint: fetchSavedPieEndpoint, httpMethodType: "POST", inputParams: {uid: uid, pieNum: pieNum.toString()}})
}

// Fetch number of Pies saved to the given account
const fetchNumSavedEndpoint = apiEndpoints["fetchNumSavedEndpoint"];
export interface fetchNumSavedPiesInput {
  uid: string;
}
export const fetchNumSavedPies = async ({uid}: fetchNumSavedPiesInput): Promise<any> => {
  return await genericApexCall({endpoint: fetchNumSavedEndpoint, httpMethodType: "POST", inputParams: {uid: uid}})
}

// Fetch current Pie (that has already been computed) for the given user
const fetchCurrentPieEndpoint = apiEndpoints["fetchPiesEndpoint"];
export interface fetchCurrentPieInput {
  uid: string;
  isGuest: boolean;
}
export const fetchCurrentPie = async ({uid, isGuest}: fetchCurrentPieInput): Promise<any> => {
  return await genericApexCall({endpoint: fetchCurrentPieEndpoint, httpMethodType: "POST", inputParams: {uid: uid, is_guest: isGuest}})
}

// Save current Pie to given user's account
const saveCurrentPieEndpoint = apiEndpoints["savePiesEndpoint"];
export interface saveCurrentPieInput {
  uid: string;
}
export const saveCurrentPie = async ({uid}: saveCurrentPieInput): Promise<any> => {
  return await genericApexCall({endpoint: saveCurrentPieEndpoint, httpMethodType: "POST", inputParams: {uid: uid}})
}

// Make pie.
// This will be stored as the "current" Pie for this user/guest.
const makePieEndpoint: string = apiEndpoints["makePieEndpoint"];
export interface makePieInput {
  uid: string;
  email: string | null;
  age: number;
  risk: number;
  sector: string;
  isGuest: boolean
}
export const makePie = async ({uid, email, age, risk, sector, isGuest}: makePieInput): Promise<any> => {
  return await genericApexCall({endpoint: makePieEndpoint, httpMethodType: "POST", inputParams: {uid: uid, email: email, age: age, risk: risk, sector: sector, is_guest: isGuest}})
}