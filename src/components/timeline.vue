<template>

  <div class="parent-container">
    
    <div class="banner-container">
      <div class="icon-container">
        <v-icon color="#0f60c3" size="30">mdi-chart-timeline</v-icon>
        <span style="font-size: 16px; margin-left: 10px; font-weight: 600">Case Timeline</span>

      </div>
       
      <div ref="tabs-search-container" class="tabs-search-container"></div>
    </div>
   

  </div>
   
</template>

<script>
import * as d3 from 'd3';
import {createTimeline, SelectionButton, SearchMenu, Table} from 'iobio-timeline';

export default {

    name: 'timeline',

    props:{
      events: {
        type: Array,
        required: true,
        default: () => [] 
      }
    },

    mounted() {

        this.init();
      
    },

    methods: {

      init() {

        this.d3Timeline = createTimeline(this.events);
        document.querySelector('.parent-container').appendChild(this.d3Timeline.dom);

        this.d3SelectionButton = SelectionButton(); 
        this.d3SelectionButton.createButton(this.$refs['tabs-search-container']);

        this.d3SearchMenu = SearchMenu();
        this.d3SearchMenu.createSearchMenu(this.$refs['tabs-search-container'], this.handleSelectionChange, this.events);

        this.d3Table = Table();
        const tableContainer = document.querySelector('.timeline-container')
        this.d3Table.createTable(tableContainer, this.events);

      },


      handleSelectionChange(selectedOption, data) {
        // Update the timeline based on the selected option
        this.d3Timeline.update(selectedOption);
        this.d3Table.updateTable('.timeline-container', data);
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
    background-color: #d9d9d9;
    border-radius: 10px;
  }

  .banner-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .icon-container {
    margin-left: 30px;
  }

  .tabs-search-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 30px;
  }

</style>


