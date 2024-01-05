<template>
    <div class="svg-container">
      <svg ref="chart" width="960" height="500"></svg>
    </div>
</template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'timeline_d3',

    data() {
      return {
    
      };
    },

    mounted() {
      let svg = d3.select(this.$refs.chart),
      margin = {top: 20, right: 20, bottom: 110, left: 40},
      margin2 = {top: 430, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      height2 = +svg.attr("height") - margin2.top - margin2.bottom;
      console.log(width, height, height2)

      var parseDate = d3.timeParse("%b %Y");

      var x = d3.scaleTime().range([0, width]),
          x2 = d3.scaleTime().range([0, width]),
          y = d3.scaleLinear().range([height, 0]),
          y2 = d3.scaleLinear().range([height2, 0]);

      var xAxis = d3.axisBottom(x),
          xAxis2 = d3.axisBottom(x2),
          yAxis = d3.axisLeft(y);

      var brush = d3.brushX()
          .extent([[0, 0], [width, height2]])
          .on("brush", brushed)

      // var zoom = d3.zoom()
      //     .scaleExtent([1, Infinity])
      //     .translateExtent([[0, 0], [width, height]])
      //     .extent([[0, 0], [width, height]])
      //     .on("zoom", zoomed);

      svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var focus = svg.append("g")
          .attr("class", "focus")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var context = svg.append("g")
          .attr("class", "context")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

   
      d3.csv("src/model/events.csv", type).then(function(data) {

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        const defaultSelection = [
          x(d3.utcYear.offset(x.domain()[1], -1)),
          x.range()[1]
        ];

        focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        focus.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis);

        focus.selectAll(".dot")
            .data(data)
            .enter().append("circle") 
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d) { return x(d.date) })
            .attr("cy", function(d) { return y(d.value) })
            .attr("r", 5); 

        context.selectAll(".dotContext")
          .data(data)
          .enter().append("circle") 
          .attr("class", "dotContext") // Assign a class for styling
          .attr("cx", function(d) { return x2(d.date) })
          .attr("cy", function(d) { return y2(d.value) })
          .attr("r", 2); 

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, defaultSelection);

        // svg.append("rect")
        //     .attr("class", "zoom")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(zoom);
            
        let upperchart = d3.select(".zoom")
        // upperchart.call(zoom.transform, d3.zoomIdentity
        //   .scale(width / (defaultSelection[1] - defaultSelection[0]))
        //   .translate(-defaultSelection[0], 0));

        console.log(upperchart)

        console.log(d3.zoomIdentity
              .scale(width / (defaultSelection[1] - defaultSelection[0]))
              .translate(-defaultSelection[0], 0))

      });

      function brushed(event) {
        // if (event.sourceEvent && event.sourceEvent.type === "zoom") return;
        // check event.sourceEvent.type === "zoom" to prevent brush from triggering zoom event causing indefinite loop
        if (!event || !event.sourceEvent || event.sourceEvent.type === "zoom") return;
        var s = event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.selectAll(".dot").attr("cx", function(d) { return x(d.date); }).attr("cy", function(d) { return y(d.value); });
        focus.select(".axis--x").call(xAxis);
        // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        //     .scale(width / (s[1] - s[0]))
        //     .translate(-s[0], 0));
        
            console.log(d3.zoomIdentity
              .scale(width / (s[1] - s[0]))
              .translate(-s[0], 0))

            
      }

      // function zoomed(event) {
      //   if (!event || !event.sourceEvent || event.sourceEvent.type === "brush") return;
      //   var t = event.transform;
      //   x.domain(t.rescaleX(x2).domain());
      //   focus.selectAll(".dot").attr("cx", function(d) { return x(d.date); }).attr("cy", function(d) { return y(d.value); });
      //   focus.select(".axis--x").call(xAxis);
      //   context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      // }


      function type(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
        return d;
      }
  
    },

    methods: {
      
      
    },
 
  };
  </script>
  
  <style>
  .svg-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
    fill: red;
    stroke: #fff;
    clip-path: url(#clip);
  }
  </style>
  
