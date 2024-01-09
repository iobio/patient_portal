<template>
  <div class="timeline-container">

    <div class="title-container">
     <svg width="1015" height="41">
      <image xlink:href="/public/Title Icon.svg"/>
     </svg>
    </div>

    <div class="svg-container">
      <svg ref="chart" width="960" height="500"></svg>

      <div>
        <Modal :show="modalShow" :type="modalType" :description="modalDescription" @close="closeModal" />
      </div>
    </div>

  </div>
   
</template>
  
  <script>
  import * as d3 from 'd3';
  import Modal from '../components/Modal.vue';
  
  export default {
    name: 'timeline_d3',

    components: {
      Modal,
     
    },

    data() {
      return {
        modalShow: false,
        modalType: '',
        modalDescription: '',
      };
    },

    mounted() {
      const me = this;

      let svg = d3.select(this.$refs.chart),
      margin = {top: 20, right: 20, bottom: 110, left: 40},
      margin2 = {top: 420, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      height2 = +svg.attr("height") - margin2.top - margin2.bottom;
      console.log("width", width, "height", height, "height2", height2)
      console.log("margin", margin, "margin2", margin2)

      let x = d3.scaleTime().range([0, width]),
          x2 = d3.scaleTime().range([0, width]),
          xTop = d3.scaleTime().range([0, width]), 
          y = d3.scaleLinear().range([height, 0]),
          y2 = d3.scaleLinear().range([height2, 0]);

      let xAxis = d3.axisBottom(x)
                    .tickFormat(d3.timeFormat("%b %Y"))
                    .tickSize(-height);

      let xAxisTop = d3.axisTop(xTop)
                    .tickSize(0)
                    .tickFormat("");

      let xAxis2 = d3.axisBottom(x2)
                    .ticks(d3.timeYear.every(1))  // Show ticks for every year
                    .tickFormat(d3.timeFormat("%Y"));

      let yAxis_left = d3.axisLeft(y)
                    .tickSize(0)
                    .tickFormat("");

      let yAxis_right = d3.axisRight(y)
                    .tickSize(0)
                    .tickFormat("");

      let brush = d3.brushX()
          .extent([[0, 0], [width, height2]])
          .on("brush end", brushed)

      let zoom = d3.zoom()
          .scaleExtent([1, Infinity])
          .translateExtent([[0, 0], [width, height]])
          .extent([[0, 0], [width, height]])
          // .on("zoom", zoomed);

      svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      let mainChart = svg.append("g")
          .attr("class", "mainChart")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let navChart = svg.append("g")
          .attr("class", "navChart")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

   
      d3.json("public/dummy_data.json").then(function(jsonData) {

        // Parse dates
        const parseDate = d3.timeParse("%Y-%m-%d");
        const formatMonthYear = d3.timeFormat("%b %Y");

        // Transform the data
        const formattedData = jsonData.events.map(event => ({
          type: event.type,
          date: parseDate(event.date),
          description: event.description,
          svgFile: `public/${event.type}.svg`
        }));

        console.log("formatted data:",formattedData);
    
        let minDate = d3.min(formattedData, function(d) { return d.date; });
        let maxDate = d3.max(formattedData, function(d) { return d.date; });

        // Get the prior year of minDate
        let priorYearMin = d3.timeYear.offset(minDate, -1);

        // Get the next year of maxDate
        let nextYearMax = d3.timeYear.offset(maxDate, 1);

        x.domain([d3.timeMonth.floor(priorYearMin), d3.timeMonth.ceil(maxDate)]);
        x2.domain([d3.timeYear.floor(priorYearMin), d3.timeYear.ceil(nextYearMax)]);

        xTop.domain(x.domain());
      
        y2.domain(y.domain());

        // Add a count for each month to keep track of events in the same month
        const monthEventCount = {};

        // Loop through the formatted data and update y-coordinate based on the count
        formattedData.forEach(function(d) {
            const monthKey = formatMonthYear(d.date);
            if (!monthEventCount[monthKey]) {
                monthEventCount[monthKey] = 1;
            } else {
                monthEventCount[monthKey]++;
            }
            d.verticalOffset = monthEventCount[monthKey]; // New property to store vertical offset
        });
          
        let lastEventDate = formattedData[formattedData.length - 1].date;
        let nextMonthAfterLastEvent = d3.utcMonth.offset(lastEventDate, 1);
        let fourMonthsBeforeNext = d3.utcMonth.offset(nextMonthAfterLastEvent, -5);
        let defaultSelection = [x2(fourMonthsBeforeNext), x2(nextMonthAfterLastEvent)];

        console.log("defaultSelection", defaultSelection);

        mainChart.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        mainChart.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis_left);

        mainChart.append("g")
          .attr("class", "axis axis--y")
          .attr("transform", "translate(" + width + ",0)")
          .call(yAxis_right);

        mainChart.selectAll(".tick line")
          .attr("class", "tick-line");

        mainChart.selectAll(".dot")
          .data(formattedData)
          .enter().append("image") 
          .attr("class", "dot") // Assign a class for styling
          .attr("xlink:href", function(d) { return d.svgFile; })
          .attr("x", function(d) { return x(d.date); })
          .attr("y", function(d) { return height / 5 + d.verticalOffset * 40; }) // Adjust the y-coordinate based on the vertical offset
          .attr("width", 25) 
          .attr("height", 25);

        mainChart.selectAll(".dotText")
          .data(formattedData)
          .enter().append("text")
          .attr("class", "dotText") // Assign a class for styling
          .attr("x", function(d) { return x(d.date) + 30; }) // Position the text to the right of the image
          .attr("y", function(d) { return height / 4 + d.verticalOffset * 40; }) // Align the text vertically with the image
          .text(function(d) { return d.type; })
          .on("click", function(event, d) {
              console.log('dotText clicked', d);
              me.openModal(d.type, d.description);
          });


        navChart.selectAll(".dotContext")
          .data(formattedData)
          .enter().append("circle") 
          .attr("class", "dotContext") // Assign a class for styling
          .attr("cx", function(d) { return x2(d.date) })
          .attr("cy", function(d) {return height2 / 4 + d.verticalOffset * 7; })
          .attr("r", 3);

        navChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        navChart.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, defaultSelection);

        svg.append("g")
            .attr("class", "axis axis--x-top")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(xAxisTop);

            // figuring out why zoom event and click event are conflicting
        // svg.append("rect")
        //     .attr("class", "zoom")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(zoom);
            

      });

      function brushed(event) {
        // check event.sourceEvent.type === "zoom" to prevent brush from triggering zoom event causing indefinite loop
        // if (!event || !event.sourceEvent || event.sourceEvent.type === "zoom") return;
        let s = event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));

        mainChart.selectAll(".dot")
          .attr("x", function(d) { return x(d.date); })
          .attr("y", function(d) {return height / 5 + d.verticalOffset * 40;});

        mainChart.selectAll(".dotText")
          .attr("x", function(d) { return x(d.date) + 30; })
          .attr("y", function(d) { return height / 4 + d.verticalOffset * 40; });

        mainChart.select(".axis--x").call(xAxis);

        mainChart.selectAll(".tick line")
          .attr("class", "tick-line");

        // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        //     .scale(width / (s[1] - s[0]))
        //     .translate(-s[0], 0));    
      }

      // function zoomed(event) {
      //   if (!event || !event.sourceEvent || event.sourceEvent.type === "brush") return;
      //   let t = event.transform;
      //   x.domain(t.rescaleX(x2).domain());

      //   mainChart.selectAll(".dot")
      //     .attr("x", function(d) { return x(d.date); })
      //     .attr("y", function(d) {return height / 5 + d.verticalOffset * 40;})

      //   mainChart.selectAll(".dotText")
      //     .attr("x", function(d) { return x(d.date) + 25; })
      //     .attr("y", function(d) { return height / 4 + d.verticalOffset * 40; })

      //   mainChart.select(".axis--x").call(xAxis);

      //   mainChart.selectAll(".tick line")
      //     .attr("class", "tick-line");

      //   navChart.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      // }
  
    },

    methods: {
      openModal(type, description) {
        console.log('Opening modal with type:', type, 'and description:', description);
        this.modalType = type;
        this.modalDescription = description;
        this.modalShow = true;
      },

      closeModal() {
        this.modalShow = false;
      },
      
    },
 
  };
  </script>
  
  <style>
  .timeline-container {
    position: absolute;
    height: 550px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-width: 1px;
    border-style: ridge;
    border-color: rgba(0, 0, 0, 0.12);
  }


  .svg-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .area {
    fill: steelblue;
    clip-path: url(#clip);
  }
  
  .zoom {
    cursor: move;
    fill: none;
    pointer-events: all;
  }

  .dot {
    fill: steelblue;
    stroke: #fff;
    clip-path: url(#clip);
  }

  .dotContext {
    fill: steelblue;
    stroke: #fff;
    clip-path: url(#clip);
  }

  .tick-line {
    stroke-dasharray: 7, 5;  /* control the length of dashes and gaps */
    stroke-width: 1;        
    stroke: rgb(222, 221, 221);          
  }

  .dotText {
    font-size: 10px;
    font-family: sans-serif;
    fill: black;
    clip-path: url(#clip);
  }
  </style>
  
