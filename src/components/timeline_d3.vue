<template>
  <div class="timeline-container">

    <div class="title-container">
     <svg width="1015" height="41">
      <image xlink:href="/public/Title Icon.svg"/>
     </svg>
    </div>

    <div class="content-wrapper">

      <div class="tabs-container">
        <p class="title-text">Check by view:</p>
        <button @click="activeTab = 'timeline'"  :class="{ 'tab-selected': activeTab === 'timeline' }">Timeline</button>
        <button @click="activeTab = 'table'" :class="{ 'tab-selected': activeTab === 'table' }">Table View</button>
      </div>

      <div class="search-menu">
        <p class="title-text">Search by category:</p>
        <select v-model="selectedOption">
          <option disabled value="">Please select one</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

    </div>

     
    <div class="svg-container" v-show="activeTab === 'timeline'">
      <svg ref="chart" width="960" height="500">
        <g class="legend" v-for="(category, index) in uniqueCategories" :key="category.category" :transform="'translate(' + getXPosition(index) + ', 0)'">
          <rect width="10" height="10" :fill="category.categoryColor"></rect>
          <text x="15" y="10">{{ category.category }}</text>
        </g>
      </svg>

      <div>
        <Modal :show="modalShow" :type="modalType" :description="modalDescription" @close="closeModal" />
      </div>
    </div>

    <div class="table-view-container" v-show="activeTab === 'table'">
      <table_view :selected-category="selectedOption" />
    </div>

  </div>
   
</template>
  
  <script>
  import * as d3 from 'd3';
  import Modal from '../components/Modal.vue';
  import table_view from '../components/table_view.vue';
  import Event from '../model/Event.js';
  
  export default {
    name: 'timeline_d3',

    components: {
      Modal,
      table_view,
     
    },

    data() {
      return {
        x: null,
        y: null,
        x2: null,
        y2: null,
        xTop: null,
        xAxis: null,
        xAxisTop: null,
        xAxis2: null,
        yAxis_left: null,
        yAxis_right: null,
        mainChart: null,
        navChart: null,
        svg: null,
        height: null,
        height2: null,
        width: null,
        margin: null,
        margin2: null,
        brush: null,
        defaultSelection: null,

        modalShow: false,
        modalType: '',
        modalDescription: '',
        activeTab: 'timeline',
        formattedData: [],
        selectedOption: '',
        options: [
          { text: 'None', value: '' },
          { text: 'Application', value: 'Application' },
          { text: 'Evaluation', value: 'Evaluation' },
          { text: 'Diagnosis', value: 'Diagnosis' }
        ],
      };
    },

    computed: {
      uniqueCategories() {
        const unique = {};
        this.formattedData.forEach(item => {
          unique[item.category] = item.categoryColor;
        });
        return Object.keys(unique).map(category => ({
          category,
          categoryColor: unique[category]
        }));
      }
    },

    watch: {
      selectedOption: function (newVal, oldVal) {
        console.log('selectedOption changed from', oldVal, 'to', newVal);
        this.updateChart();
      }
    },

    async mounted() {
      const me = this;

      try {
        const fectchedData = await this.fetchData();
        console.log("fetchedData", fectchedData);

        this.svg = d3.select(this.$refs.chart),
        this.margin = {top: 20, right: 20, bottom: 110, left: 20},
        this.margin2 = {top: 420, right: 20, bottom: 30, left: 20},
        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right,
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom,
        this.height2 = +this.svg.attr("height") - this.margin2.top - this.margin2.bottom;

        this.x = d3.scaleTime().range([0, this.width]),
        this.x2 = d3.scaleTime().range([0, this.width]),
        this.xTop = d3.scaleTime().range([0, this.width]), 
        this.y = d3.scaleLinear().range([this.height, 0]),
        this.y2 = d3.scaleLinear().range([this.height2, 0]);

        this.xAxis = d3.axisBottom(this.x)
                  // .ticks(d3.timeMonth.every(1))  // Show ticks for every month
                  .tickFormat(d3.timeFormat("%b %Y"))
                  .tickSize(-this.height);

        this.xAxisTop = d3.axisTop(this.xTop)
                  .tickSize(0)
                  .tickFormat("");

        this.xAxis2 = d3.axisBottom(this.x2)
                    .ticks(d3.timeYear.every(1))  // Show ticks for every year
                    .tickFormat(d3.timeFormat("%Y"));

        this.yAxis_left = d3.axisLeft(this.y)
                      .tickSize(0)
                      .tickFormat("");

        this.yAxis_right = d3.axisRight(this.y)
                      .tickSize(0)
                      .tickFormat("");

        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on("brush end", this.brushed); 

        this.svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", this.width)
          .attr("height", this.height);

        this.mainChart = this.svg.append("g")
            .attr("class", "mainChart")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.navChart = this.svg.append("g")
            .attr("class", "navChart")
            .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");

        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const startYear = currentYear - 9;
        const minDate = new Date(startYear, 0, 1); // Jan 1st of start year
        const maxDate = new Date(currentYear, 11, 31); // Dec 31st of current year
        console.log("minDate:", minDate)
        console.log("maxDate:", maxDate)


        // Parse dates
        const parseDate = d3.timeParse("%Y-%m-%d");
        const formatMonthYear = d3.timeFormat("%b %Y");

        // Transform the data
        this.formattedData = fectchedData.map(event => ({
          type: event.type,
          date: parseDate(event.date),
          description: event.description,
          svgFile: `public/${event.type}.svg`,
          category: event.category,
          categoryColor: event.color
        }));

        console.log("formatted data:",this.formattedData);
    
        // let minDate = d3.min(formattedData, function(d) { return d.date; });
        // let maxDate = d3.max(formattedData, function(d) { return d.date; });

        // Adjust to start at the beginning of the minDate year and end at the end of the maxDate year
        this.x.domain([d3.timeYear.floor(minDate), d3.timeYear.ceil(maxDate)]);
        this.x2.domain([d3.timeYear.floor(minDate), d3.timeYear.ceil(maxDate)]);

        this.xTop.domain(this.x.domain());
      
        this.y2.domain(this.y.domain());

        // Add a count for each month to keep track of events in the same month
        const monthEventCount = {};

        // Loop through the formatted data and update y-coordinate based on the count
        this.formattedData.forEach(function(d) {
            const monthKey = formatMonthYear(d.date);
              // Extract the second day of the month
            const secondDayOfMonth = new Date(d.date);
            secondDayOfMonth.setDate(2);

            // Add the second day of the month as a new property which will be used to align the events vertically
            d.secondDayOfMonth = secondDayOfMonth;

            if (!monthEventCount[monthKey]) {
                monthEventCount[monthKey] = 1;
            } else {
                monthEventCount[monthKey]++;
            }
            d.verticalOffset = monthEventCount[monthKey]; // New property to store vertical offset
        });

        let lastEventDate = this.formattedData[this.formattedData.length - 1].secondDayOfMonth;

        // Calculate next month after last event and five months before that
        let nextMonthAfterLastEvent = d3.utcMonth.offset(lastEventDate, 1);
        let fiveMonthsBeforeNext = d3.utcMonth.offset(nextMonthAfterLastEvent, -6);

        // Ensure fiveMonthsBeforeNext is not before the min date
        if (fiveMonthsBeforeNext < minDate) {
            fiveMonthsBeforeNext = minDate;
            // Adjust nextMonthAfterLastEvent to maintain 6 month range
            nextMonthAfterLastEvent = d3.utcMonth.offset(fiveMonthsBeforeNext, 6);
        }

        let endOfTimeline = d3.timeYear.offset(d3.timeYear.ceil(maxDate), 1);

        // Ensure nextMonthAfterLastEvent is not beyond the max date
        if (nextMonthAfterLastEvent > endOfTimeline) {
            nextMonthAfterLastEvent = endOfTimeline;
            // Adjust fiveMonthsBeforeNext to maintain 6 month range
            fiveMonthsBeforeNext = d3.utcMonth.offset(nextMonthAfterLastEvent, -6);
        }

        // Set default selection
        this.defaultSelection = [this.x2(fiveMonthsBeforeNext), this.x2(nextMonthAfterLastEvent)];

        console.log("defaultSelection", this.defaultSelection);

        this.mainChart.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis);

        this.mainChart.append("g")
          .attr("class", "axis axis--y")
          .call(this.yAxis_left);

        this.mainChart.append("g")
          .attr("class", "axis axis--y")
          .attr("transform", "translate(" + this.width + ",0)")
          .call(this.yAxis_right);

        this.mainChart.selectAll(".tick line")
          .attr("class", "tick-line");

        this.mainChart.selectAll(".dot")
          .data(this.formattedData)
          .enter().append("image") 
          .attr("class", "dot") // Assign a class for styling
          .attr("xlink:href", function(d) { return d.svgFile; })
          .attr("x", d => this.x(d.secondDayOfMonth))
          .attr("y", d => d.verticalOffset * 40) // Adjust the y-coordinate based on the vertical offset
          .attr("width", 25) 
          .attr("height", 25);

        this.mainChart.selectAll(".dotText")
          .data(this.formattedData)
          .enter().append("text")
          .attr("class", "dotText") // Assign a class for styling
          .attr("x", d => this.x(d.secondDayOfMonth) + 30) // Position the text to the right of the image
          .attr("y", d => this.height / 30 + d.verticalOffset * 40) // Align the text vertically with the image
          .text(function(d) { return d.type; })
          .on("click", function(event, d) {
              console.log('dotText clicked', d);
              me.openModal(d.type, d.description);
          });


        this.navChart.selectAll(".dotContext")
          .data(this.formattedData)
          .enter().append("circle") 
          .attr("class", "dotContext") // Assign a class for styling
          .attr("cx", d => this.x2(d.secondDayOfMonth))
          .attr("cy", d => this.height2 / 4 + d.verticalOffset * 7)
          .attr("r", 3)
          .style("fill", function(d) { return d.categoryColor; }); 

        this.navChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height2 + ")")
            .call(this.xAxis2);

        this.navChart.append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, this.defaultSelection);

        this.svg.append("g")
            .attr("class", "axis axis--x-top")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .call(this.xAxisTop);

            // figuring out why zoom event and click event are conflicting
        // svg.append("rect")
        //     .attr("class", "zoom")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(zoom);
            

      } 
      catch (error) {
          console.error('Error fetching or parsing data:', error);
        }

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

      async fetchData() {
        try {
          const response = await fetch('dummy_data.json');
          const jsonData = await response.json();

          const events = jsonData.events.map(
            (event) => new Event(event.type, event.date, event.description)
          );
          return events;
        } catch (error) {
          console.error('Error fetching or parsing data:', error);
        }
      },

      brushed(event) {
        let s = event.selection || this.defaultSelection;
        let fixedBrushWidth = this.defaultSelection[1] - this.defaultSelection[0];

        if (s[1] - s[0] !== fixedBrushWidth) {
            if (event.sourceEvent && event.sourceEvent.type === "mousemove") {
                // Adjust the brush position while maintaining the fixed size
                let newStart = s[0];
                let newEnd = newStart + fixedBrushWidth;

                // Prevent the brush from exceeding the right boundary
                if (newEnd > this.x2.range()[1]) {
                    newEnd = this.x2.range()[1];
                    newStart = newEnd - fixedBrushWidth;
                }

                // Update the selection
                s = [newStart, newEnd];
                d3.select(".navChart .brush").call(this.brush.move, s);
            }
        }

        this.x.domain(s.map(this.x2.invert, this.x2));
       

        this.mainChart.selectAll(".dot")
          .attr("x", d => this.x(d.secondDayOfMonth))
          .attr("y", d => d.verticalOffset * 35);

        this.mainChart.selectAll(".dotText")
          .attr("x", d => this.x(d.secondDayOfMonth) + 30)
          .attr("y", d => this.height / 30 + d.verticalOffset * 35);

        this.mainChart.select(".axis--x").call(this.xAxis);

        this.mainChart.selectAll(".tick line")
          .attr("class", "tick-line");
          
      },

      updateChart() {
        const filteredData = this.selectedOption ? 
        this.formattedData.filter(d => d.category === this.selectedOption) : this.formattedData;

        console.log("filteredData", filteredData);
        this.updateMainChart(filteredData);
        this.updateNavChart(filteredData);

      },

      updateMainChart(filteredData) {
          // Clear existing elements
        const mainChart = d3.select(".mainChart");
        mainChart.selectAll(".dot, .dotText").remove();

        // Add new elements based on filtered data
        mainChart.selectAll(".dot")
          .data(filteredData)
          .enter().append("image")
          .attr("class", "dot")
          .attr("xlink:href", function(d) { return d.svgFile; })
          .attr("x", d => this.x(d.secondDayOfMonth))
          .attr("y", d => d.verticalOffset * 40)
          .attr("width", 25)
          .attr("height", 25);

        mainChart.selectAll(".dotText")
          .data(filteredData)
          .enter().append("text")
          .attr("class", "dotText")
          .attr("x", d => this.x(d.secondDayOfMonth) + 30)
          .attr("y", d => this.height / 30 + d.verticalOffset * 40)
          .text(function(d) { return d.type; })
          .on("click", function(event, d) {
            console.log('dotText clicked', d);
            this.openModal(d.type, d.description);
          }.bind(this));


      },

      updateNavChart(filteredData) {
        // Clear existing elements
        const navChart = d3.select(".navChart");
        navChart.selectAll(".dotContext").remove();

        // Add new elements based on filtered data
        navChart.selectAll(".dotContext")
          .data(filteredData)
          .enter().append("circle")
          .attr("class", "dotContext")
          .attr("cx", d => this.x2(d.secondDayOfMonth))
          .attr("cy", d => this.height2 / 4 + d.verticalOffset * 7)
          .attr("r", 3)
          .style("fill", function(d) { return d.categoryColor; });

      },

      estimateWidth(text) {
        const charWidth = 8; // Average width per character, adjust as needed
        return text.length * charWidth;
      },

      getXPosition(index) {
        let initialOffset = 650; 
        let xPos = initialOffset;
        for (let i = 0; i < index; i++) {
          xPos += this.estimateWidth(this.uniqueCategories[i].category) + 25; // 25 is additional spacing, adjust as needed
        }
        return xPos;
      }


    },
 
  };
  </script>
  
  <style>
  .timeline-container {
    position: absolute;
    height: 650px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-width: 1px;
    border-style: ridge;
    border-color: rgba(0, 0, 0, 0.12);
  }

  .content-wrapper {
    display: flex;
    margin: 10px 0px 0px 40px !important;
    gap: 20px;
  }

  .svg-container, .table-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
  }

  .tabs-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin: 0px 0px 0px 0px;
  }

  .title-text {
    padding: 10px;
    font-size: 13px;
  }

  .search-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  .tab-selected {
    background-color: #4285F4; 
    color: white;
    font-size: 13;
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
    font-size: 9px;
    font-family: sans-serif;
    fill: black;
    clip-path: url(#clip);
  }

  .legend text {
    font-size: 12px;
    fill: #333; 
  }
  </style>
  
