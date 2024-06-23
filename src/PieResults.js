import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import Plot from 'react-plotly.js';

const PieResults = (props) => {
  const { currentUser } = useAuth();
  const uid = useRef(props.location.state.uid);
  const age = useRef(props.location.state.age);
  const risk = useRef(props.location.state.risk);
  const sector = useRef(props.location.state.sector);

  const [loading, setLoading] = useState(true);

  // holds backend response data
  const pie = useRef(null);
  const pieRows = useRef(null);
  const avgBeta = useRef(0);

  // data calculated when backend data is received to make render logic faster
  const plotConfig = useRef(null)
  const numStocks = useRef(0)

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
            uid: uid.current,
            is_guest: currentUser ? false : true
          }),
        });

        // need to also wait for data to arrive
        const json = await response.json();

        // Put all the results from the backend server into our State to be rendered.
        pie.current = json.pie
        pieRows.current = json.pieRows
        avgBeta.current = (Math.round(json.avgBeta * 100) / 100).toFixed(2)
        numStocks.current = json.pie['Beta'].length // just using any of the lists to get the length

        // construct plot configs as soon as results from backend come
        var data = [{
          values: pie.current['Percentage'],
          labels: pie.current['Ticker'],
          type: 'pie',
          customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]), 
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

        plotConfig.current = {
          'data': data,
          'layout': layout
        }

        // Remove the loading screen so that the page can finally be rendered.
        setLoading(false);

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
        Age: {age.current}
        <br />
        Risk: {risk.current}
        <br />
        Sector: {sector.current}
      </h1>

      {/* Beta */}
      {/* TODO: Make this hover-text */}
      <h3> Overall Beta of Pie: {avgBeta.current} </h3>

      <Plot
        data={plotConfig.current['data']}
        layout={plotConfig.current['layout']}
      />

      {/* Lists information about each stock in our Pie */}
      {Array.from(Array(numStocks.current), (x, i) => i).map((stockIndex) => {
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
