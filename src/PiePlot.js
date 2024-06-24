import React, { useEffect, useState, useRef} from 'react';
import { useAuth } from "./contexts/AuthContext";

import Plot from 'react-plotly.js';

const PiePlot = (props) => {
  const { currentUser } = useAuth();
  const uid = useRef(currentUser["uid"])
  const pieNum = useRef(props.pieNum);

  // const fetchSavedPieEndpoint = "http://127.0.0.1:5000/fetchsavedpie"
  const fetchSavedPieEndpoint = "https://api.apex-pies.com:5000/fetchsavedpie"

  const pie = useRef(null);
  const pieRows = useRef(null);

  const plotConfig = useRef(null)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPieData() {
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
            pieNum: pieNum.current
          }),
        });

        // need to also wait for data to arrive
        const json = await response.json();

        // Put all the results from the backend server into our State to be rendered.
        pie.current = json.pie
        pieRows.current = json.pieRows

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
          automargin: true
        }]

        var layout = {
          paper_bgcolor: 'rgba(0,0,0,0)', 
          plot_bgcolor: 'rgba(0,0,0,0)',
          showlegend: false,
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
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

  return (
    <div className="text-center" style={{paddingTop: "75px"}}>
      <Plot
        data={plotConfig.current['data']}
        layout={plotConfig.current['layout']}
      />
    </div>
  )
}

export default PiePlot;