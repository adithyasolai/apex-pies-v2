import React, { useEffect, useState, useRef} from 'react';
import { useAuth } from "./contexts/AuthContext";

import apiEndpoints from "./api-endpoints.json";
// import apiEndpoints from "./api-endpoints-dev.json";

import Plot from 'react-plotly.js';

const PiePlot = (props) => {
  const { currentUser } = useAuth();
  const uid = useRef(currentUser["uid"])
  const pieNum = useRef(props.pieNum);

  const fetchSavedPieEndpoint = apiEndpoints["fetchSavedPieEndpoint"]

  const pie = useRef(null);
  const pieRows = useRef(null);

  const plotConfig = useRef(null)

  const [loading, setLoading] = useState(true);

  const dummyPlotConfig = {
    'data': [{
      values: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      type: 'pie',
      marker: {
        colors: new Array(20).fill("#ADD8E6")
      }
    }],
    'layout': {
      paper_bgcolor: 'rgba(0,0,0,0)', 
      plot_bgcolor: 'rgba(0,0,0,0)',
      showlegend: false
    }
  }

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

      // simplify pie chart with just sector slices only
      var sector_data_dict = {}
      pieRows.current.forEach(row => {
        var currSector = row["Sector"]
        var currPct = row["Percentage"]
        var currColor = row["Color"]

        if (currSector in sector_data_dict) {
          sector_data_dict[currSector][0] += currPct
        } else {
          sector_data_dict[currSector] = new Array(2)
          sector_data_dict[currSector][0] = currPct
          sector_data_dict[currSector][1] = currColor
        }
      });
      
      // create exact ordering of Sector keys
      var sector_list = Object.keys(sector_data_dict)
      var colors = new Array(sector_list.length)
      var percentages = new Array(sector_list.length)

      sector_list.forEach((sector, index) => {
        percentages[index] = sector_data_dict[sector][0]
        colors[index] = sector_data_dict[sector][1]
      });
      // construct plot configs as soon as results from backend come
      var data = [{
        values: percentages,
        labels: sector_list,
        type: 'pie',
        // customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]), 
        // hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
        marker: {
          colors: colors
        },
        hoverinfo: 'none'
      }]
      // var data = [{
      //   values: pie.current['Percentage'],
      //   labels: pie.current['Ticker'],
      //   type: 'pie',
      //   customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]), 
      //   hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
      //   marker: {
      //     colors: pie.current['Color']
      //   }
      // }]

      var layout = {
        paper_bgcolor: 'rgba(0,0,0,0)', 
        plot_bgcolor: 'rgba(0,0,0,0)'
        // showlegend: false
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

  useEffect(() => {
    if (!props.active) {
      return
    }

    fetchPieData();
  }, [props.active]); // this triggers a re-render of the return Components every time this Pie is the active on in the carousel

  if (loading) {
    return <h2 className='text-center pb-5'>loading ...</h2>;
  }

  return (
    <>
      { props.active ?
          <Plot
            data={plotConfig.current['data']}
            layout={plotConfig.current['layout']}
            useResizeHandler={true}
            style={{width: '100%', height: '100%'}}
          /> :
          // TODO: make this look better
          <Plot
            data={dummyPlotConfig['data']}
            layout={dummyPlotConfig['layout']}
            useResizeHandler={true}
            style={{width: '100%', height: '100%', opacity: '10%'}}
          />
        }
    </>
  )
}

export default PiePlot;