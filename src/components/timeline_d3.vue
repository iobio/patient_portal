<template>
  <div class="timeline-container">

    <div class="title-container">
     <svg width="1017" height="41">
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
  import {Timeline} from '../d3/Timeline.d3.js';
  
  export default {
    name: 'timeline_d3',

    components: {
      Modal,
      table_view,
     
    },

    data() {
      return {
        d3Timeline: null,


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
      const fetchedData = await this.fetchData();
      console.log("fetchedData", fetchedData);
      const parseDate = d3.timeParse("%Y-%m-%d");
      this.formattedData = fetchedData.map(event => ({
            type: event.type,
            date: parseDate(event.date),
            description: event.description,
            svgFile: `public/${event.type}.svg`,
            category: event.category,
            categoryColor: event.color
        }));

      this.d3Timeline = Timeline();
      this.d3Timeline.initializeTimeline(this.$refs.chart, fetchedData, this.openModal);

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

      updateChart() {
        this.d3Timeline.updateChart(this.selectedOption, this.openModal);
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
    font-size: 13px;
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
  
