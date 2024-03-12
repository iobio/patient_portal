<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event,index) in events" :key="index">
            <td>{{ event.type }}</td>
            <td>{{ event.date }}</td>
            <td>{{ event.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
import Event from '../model/Event.js';

  export default {
    data() {
      return {
        events: []
      };
    },

    props:{
      selectedCategory: String
    },

    watch: {
      selectedCategory(newCategory) {
        this.filterEvents(newCategory);
      }
    },

    mounted() {
      this.filterEvents(this.selectedCategory);

    },

    methods: {
      async filterEvents(category) {
        const response = await fetch('dummy_data.json');
        const jsonData = await response.json();
        let allEvents = jsonData.events.map(
          event => new Event(event.type, event.date, event.category)
        );

        // Filter based on the category
        if (category && category !== '') {
          this.events = allEvents.filter(event => event.category === category);
        } else {
          this.events = allEvents;
        }
      }
    }



  };
</script>
  
<style>
  .table-container {
    width: 920px;
    height: 450px;
    overflow-y: auto;
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
  