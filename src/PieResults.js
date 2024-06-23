import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import Plot from 'react-plotly.js';

const PieResults = (props) => {
  const { currentUser } = useAuth();
  const [uid, setUid] = useState(props.location.state.uid);
  const [age, setAge] = useState(props.location.state.age);
  const [risk, setRisk] = useState(props.location.state.risk);
  const [sector, setSector] = useState(props.location.state.sector);

  const [loading, setLoading] = useState(true);
  const [avgBeta, setAvgBeta] = useState();
  const [vizLink, setVizLink] = useState();
  const [username, setUsername] = useState();
  const [apiKey, setApiKey] = useState();
  const [iframe, setIframe] = useState();
  const [plotConfig, setPlotConfig] = useState({});
  const [numStocks, setNumStocks] = useState();

  const pie = useRef(null);
  const pieRows = useRef(null);

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

        // need to also wait for data to arrive
        const json = await response.json();

        // Put all the results from the backend server into our State to be rendered.
        // Remove the loading screen so that the page can finally be rendered.
        setLoading(false);
        setAvgBeta((Math.round(json.avgBeta * 100) / 100).toFixed(2));
        pie.current = json.pie
        pieRows.current = json.pieRows
        setNumStocks(json.pie['Beta'].length); // just using any of the lists to get the length
        setVizLink(json.vizLink);
        setUsername(json.username);
        setApiKey(json.apiKey);
        setIframe(json.iframe);

        console.log(json.pieRows)
        console.log(pie)
        console.log(pieRows)

        // extract just the data needed for hovertext display,
        // and put it into the 2D array format needed for the plot
        var pieRowsOfRowsAsCustomData = pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']])

        // construct plot configs as soon as results from backend come
        var data = [{
          values: pie.current['Percentage'],
          labels: pie.current['Ticker'],
          type: 'pie',
          customdata: pieRowsOfRowsAsCustomData, 
          hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
          marker: {
            colors: pie.current['Color']
          },
        }]

        var layout = {
          paper_bgcolor: 'rgba(0,0,0,0)', 
          plot_bgcolor: 'rgba(0,0,0,0)',
          showlegend: false
        }

        setPlotConfig({
          'data': data,
          'layout': layout
        })

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
    // Note: Using paddingTop instead of marginTop because marginTop can cause white background to reveal if too much margin is given.
    <div className="text-center bg-primary" style={{paddingTop: "75px"}}>
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

      <Plot
        data={plotConfig['data']}
        layout={plotConfig['layout']}
      />

      {/* Lists information about each stock in our Pie */}
      {Array.from(Array(numStocks), (x, i) => i).map((stockIndex) => {
          return (
            <p key={stockIndex}>
              Percentage: {pie.current["Percentage"][stockIndex]}% Sector: {pie.current["Sector"][stockIndex]} Ticker: {pie.current["Ticker"][stockIndex]}
            </p>
          );
        })}

      <br />
    </div>
  );
};

export default withRouter(PieResults);
