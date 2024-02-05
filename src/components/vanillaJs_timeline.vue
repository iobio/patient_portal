<template>
  
    <div ref="timeline-container" class="timeline-container">
        <div ref="content-wrapper" class="content-wrapper">

        </div>
       
    </div>
   

</template>

<script>
import * as d3 from 'd3';
import Event from '../model/Event.js';
import {Timeline} from '../d3/Timeline.d3.js';
import {SelectionButton} from '../d3/SelectionButton.d3.js';
import {SearchMenu} from '../d3/SearchMenu.d3.js';
import {Table} from '../d3/Table.d3.js';
import {Modal} from '../d3/Modal.d3.js';

export default {
    async mounted() {
        const fetchedData = await this.fetchData();
        console.log("fetchedData", fetchedData);

        this.d3Timeline = Timeline();
        this.d3Timeline.initializeTimeline(this.$refs['timeline-container'], fetchedData, this.openModal);

        this.d3SelectionButton = SelectionButton();   
        this.d3SelectionButton.createButton(this.$refs['content-wrapper'],  this.showView);

        this.d3SearchMenu = SearchMenu();
        this.d3SearchMenu.createSearchMenu(this.$refs['content-wrapper'], this.handleSelectionChange);

        this.d3Table = Table();
        this.d3Table.createTable(this.$refs['timeline-container'], fetchedData);

    },

    methods: {
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

        showView(viewType) {
            const timeline_view = document.querySelector('.timeline-svg');
            const table_view = document.querySelector('.table-view-container');

            if (viewType=== 'timeline') {
                timeline_view.style.display = 'block';
                table_view.style.display = 'none';
            } else if (viewType === 'table'){
                timeline_view.style.display = 'none';
                table_view.style.display = 'block';
            }
        },

        handleSelectionChange(selectedOption) {
            // Update the timeline based on the selected option
            this.d3Timeline.updateChart(selectedOption, this.openModal);
        },

        openModal(type, description) {
            const modal = Modal();
            modal.createModal(this.$refs['timeline-container'], {
                show: true,
                type: type,
                description: description,
            });
        },
    }
};


</script>


<style>
.timeline-container {
    position: absolute;
    height: 600px;
    width: 960px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-width: 1px;
    border-style: ridge;
    border-color: rgba(0, 0, 0, 0.12);
  }

  .svg-container, .table-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
  }

  .content-wrapper {
    display: flex;
    margin: 20px 0px 0px 0px !important;
    gap: 20px;
  }

  .tabs-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    margin: 0px 0px 0px 10px;
  }

  .selected {
    background-color: #67AF54;
    color: #ffffff;
}

  .hide {
    display: none;
  }

  .search-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }

  .title-text {
    font-size: 13px;
    font-weight: bold;
    padding: 10px;
  }

  .table-container {
    width: 920px;
    height: 450px;
    overflow-y: auto;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  thead {
    background-color: #f2f2f2;
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

</style>


