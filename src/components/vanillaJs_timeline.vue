<template>

  <div class="parent-container">
    <div ref="tabs-search-container" class="tabs-search-container">

    </div>
  </div>
   
</template>

<script>
import * as d3 from 'd3';
import Event from 'timeline/src/Event.js';
import events from '../dummy_data.json';
import {SelectionButton} from '../d3/SelectionButton.d3.js';
import {SearchMenu} from '../d3/SearchMenu.d3.js';
import {Table} from '../d3/Table.d3.js';
import {createTimeline} from 'timeline/src/Timeline.js';

export default {
    async mounted() {
        const fetchedData = await this.fetchData();
        console.log("fetchedData", fetchedData);

        // this.d3Timeline = Timeline();
        // this.d3Timeline.initializeTimeline(this.$refs['timeline-container'], fetchedData, this.openModal);

        this.d3Timeline = createTimeline(events);
        document.querySelector('.parent-container').appendChild(this.d3Timeline.dom);

        this.d3SelectionButton = SelectionButton();   
        this.d3SelectionButton.createButton(this.$refs['tabs-search-container']);

        this.d3SearchMenu = SearchMenu();
        this.d3SearchMenu.createSearchMenu(this.$refs['tabs-search-container'], this.handleSelectionChange, fetchedData);

        this.d3Table = Table();
        const tableContainer = document.querySelector('.timeline-container')
        this.d3Table.createTable(tableContainer, fetchedData);
        // this.d3Table.createTable(this.$refs['timeline-container'], fetchedData);

    },

    methods: {
        async fetchData() {
            try {
            const response = await fetch('src/dummy_data.json');
            const jsonData = await response.json();

            const events = jsonData.events.map(
              (event) => new Event(event.id, event.name, event.date, event.description, event.iconUrl, event.pairEventId,
                             event.eventType, event.status, event.estimatedCompleteDate)
            );
            return events;
            } catch (error) {
            console.error('Error fetching or parsing data:', error);
            }
        },

        handleSelectionChange(selectedOption) {
            // Update the timeline based on the selected option
            this.d3Timeline.update(selectedOption);
        },
    }
};


</script>


<style>

  .parent-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: auto;
  }

  .tabs-search-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-self: flex-start;
  }

  .selected-button {
    background-color: #67AF54;
    color: #ffffff;
  }

  .hide {
    display: none;
  }

  .search-menu, .tabs-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }

  .title-text {
    font-size: 13px;
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

</style>


