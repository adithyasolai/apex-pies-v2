import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

const PieResults = (props) => {
  const { currentUser } = useAuth();
  const [uid, setUid] = useState(props.location.state.uid);
  const [age, setAge] = useState(props.location.state.age);
  const [risk, setRisk] = useState(props.location.state.risk);
  const [sector, setSector] = useState(props.location.state.sector);

  const [loading, setLoading] = useState(true);
  const [avgBeta, setAvgBeta] = useState();
  const [pie, setPie] = useState();
  const [vizLink, setVizLink] = useState();
  const [username, setUsername] = useState();
  const [apiKey, setApiKey] = useState();
  const [iframe, setIframe] = useState();

  const [numStocks, setNumStocks] = useState();

  // local dev endpoint
  const flask_endpoint = "http://127.0.0.1:5000/fetchpies"

  // Domain that routes to ELB
  // const flask_endpoint = "https://api.apex-pies.com:5000/fetchpies";

  useEffect(() => {
    async function fetchPieData() {
      try {
        // Send request to backend server to fetch the Pie & Plotly information
        // for the current userId. Wait for the request to give a response.
        const response = await fetch(flask_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            is_guest: currentUser ? false : true
          }),
        });

        // removing the `await` here causes the PieReults page to just hang for some reason
        const json = await response.json();

        console.log(json.avgBeta);
        console.log(json.pie);

        // Put all the results from the backend server into our State to be rendered.
        // Remove the loading screen so that the page can finally be rendered.
        setLoading(false);
        setAvgBeta((Math.round(json.avgBeta * 100) / 100).toFixed(2));
        setPie(json.pie);
        setNumStocks(json.pie.length);
        setVizLink(json.vizLink);
        setUsername(json.username);
        setApiKey(json.apiKey);
        setIframe(json.iframe);
      } catch (err) {
        console.log(err);
      }
    }

    fetchPieData();
  }, []);

  if (loading) {
    return <h2>loading ...</h2>;
  }

  console.log("Number of stocks", numStocks);
  console.log(pie)

  return (
    <div>
      {/* Display fields chosen by user in User Form */}
      <h1>
        Age: {age}
        <br />
        Risk: {risk}
        <br />
        Sector: {sector}
      </h1>

      {/* Beta */}
      {/* TODO: Make this hover-text */}
      <h3> Overall Beta of Pie: {avgBeta} </h3>

      {/* Embed the Plotly Pie Chart */}
      <div dangerouslySetInnerHTML={{ __html: iframe }} />

      {/* Lists information about each stock in our Pie */}
      {/* TODO: Make percentage of pie something that is returned by backend when algorithm gets more complex. */}
      {Array.from(Array(numStocks), (x, i) => i).map((stockIndex) => {
          return (
            <p key={stockIndex}>
              Percentage: 5% Sector: {pie[stockIndex]["Sector"]} Ticker: {pie[stockIndex]["Ticker"]}
            </p>
          );
        })}

      <br />
    </div>
  );
};

export default withRouter(PieResults);
