export interface ApexApiEndpoints {
  makePieEndpoint: string;
  fetchNumSavedEndpoint: string;
  fetchPiesEndpoint: string;
  savePiesEndpoint: string;
  fetchSavedPieEndpoint: string;
}

export interface MakePieApiResponse {
  message: string;
  llmSuggestions: string;
}
