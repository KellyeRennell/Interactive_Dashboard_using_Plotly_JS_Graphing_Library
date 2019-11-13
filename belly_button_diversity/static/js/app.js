//using async as recommended by Manny. the catch callback will be executied when the promise is rejected
async function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  const metaUrl = "/metadata/" + sample;
  let data = await d3.json(metaUrl)
  console.log(data);

  // Use d3 to select the panel with id of `#sample-metadata`
  const metaPanel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  metaPanel.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  Object.entries(data).forEach(([key, value]) => {
    console.log(key + value);
    const panelrow = metaPanel.append("p");
    panelrow.text(`${key}:${value}`);

  });
}

//   // BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);

async function buildCharts(sample) {

  // // // @TODO: Use `d3.json` to fetch the sample data for the plots
  const urlSample = "/samples/" + sample;
  let data = await d3.json(urlSample)

  // //   // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data
  const
    sample_values = data.sample_values,
    otu_labels = data.otu_labels,
    otu_ids = data.otu_ids

  const trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  }
    
  data = [trace1];

  let layout = {
    xaxis: {
      title: "OTU ID"
    },
    showlegend: false
  };


  Plotly.newPlot('bubble', data, layout);


  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  //     // otu_ids, and labels (10 each).

  const pieChart = [{
    values: sample_values.slice(0, 10),
    labels: otu_ids.slice(0, 10),
    hovertext: otu_labels.slice(0, 10),
    hoverinfo: "hovertext",
    type: "pie"
  }];

  layout = {
    height: 500,
    width: 700
  };

  Plotly.newPlot("pie", pieChart, layout);

};

function init() {
  //   // Grab a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();