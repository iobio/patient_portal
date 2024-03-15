<template>
  <v-app>
      <Timeline v-if="events.length > 0" :events="events"></Timeline>
  </v-app>
</template>


<script>
import Timeline from "./components/timeline.vue";


export default {
  name: 'App',
  components: {
    Timeline
     
  },

  data() {
    return {
      events: []
    }
  },

  async created() {
    await this.fetchData();
    console.log(this.events);
  },

  methods: {
    async fetchData() {
      try {
        const response = await fetch('/dummy_data.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        this.events = jsonData.events; // Assuming the structure matches what Timeline expects
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    },
  }

}

</script>


<style>

</style>
