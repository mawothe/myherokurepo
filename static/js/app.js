function buildMetadata(sample) {
  console.log("Build metadata"); 

   // @TODO: Complete the following function that builds the metadata panel

   //where to pull the data
   var selector = d3.select("#selDataset");
   var numSample = selector.property("value");

   console.log(numSample);

   //make a variable for the url to call the data
   var metaURL = `/metadata/${numSample}`;

   //grabbing the meta_data sample
   d3.json(metaURL).then(function(response){
     console.log(response)
  
     // Use d3 to select the panel with id of `#sample-metadata`  
    var panel = d3.select("#sample-metadata");
    
    //clears previous
    panel.html("");
    
   //put the meta sample onto the webpage
    Object.entries(response).forEach(function([key,value]){
      console.log(key, value);

      var rows = panel.append("div");
      rows.text(`${key}: ${value}`)
    });
   });
  }

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);



function buildCharts(sample) {
    console.log("Build new chart");
   //THIS IS THE BUBBLE CHART
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var selector = d3.select("#selDataset");
    var sampleNum = selector.property("value");
    var sampleURL = `/samples/${sampleNum}`;

    d3.json (sampleURL).then(function(response) {
        console.log("getting the data...");

        //slicing the top ten samples
        var sample_values = response.sample_values.slice(0,10);
        var otu_ids = response.otu_ids.slice(0,10);
        var otu_labels = response.otu_labels.slice(0,10);

        var trace = {
            mode: "markers",
            text: otu_labels,
            x: otu_ids,
            y: sample_values,
            marker:{
                size: sample_values,
                color: otu_ids
            }
        };

        var data = [trace];

        var layout = {
           xaxis:{
               type: "linear"
           },
           yaxis:{
               autorange: true,
               type: "linear"
           }
        };
    
        Plotly.newPlot("bubble", data, layout)

        //THIS IS THE PIE CHART

        var trace2 = {
            type: "pie",
            labels: otu_ids,
            values: sample_values, 
            hovertext: otu_labels
        };

        var data2 = [trace2];

        Plotly.newPlot('pie', data2);
    });
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
init()