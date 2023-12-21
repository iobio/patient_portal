<template>
  <v-container class="timeline-container">
    <v-card-title class="timeline-title">
      Case History
    </v-card-title>
    <v-timeline direction="horizontal" line-thickness="23" side="start" class="timeline-group">
      <v-timeline-item
        v-for="(event, i) in events"
        :key="i"
        :dot-color="event.color"
        size="small"
      >
        <div style="display: flex; flex-direction: column; align-items: center;">
          <!-- <div class="title-container">
            <p class="text-title">
              {{ event.type }}
            </p>
           
          </div> -->
          <div class="title-container">
            <v-tooltip top :text="event.description">
              <template v-slot:activator="{ props }">
                <p v-bind="props" class="text-title">{{ event.type }}</p>
              </template>
            </v-tooltip>
          </div>
          
          
          <div class="image-container">
            <img :src="event.svgContainer" :alt="event.type">
          </div>
        </div>
       
        <template v-slot:opposite>
          <p class="text-date">
            {{ event.formattedDate }}
          </p>
        </template>
          
      </v-timeline-item>
    </v-timeline>
  </v-container>

</template>

<script>
import Event from '../model/Event.js'

export default {
  name: 'timeline',
  components: {
    
  },
  data () {
    return {
      events: [],
    }

  },
    
  computed: {
    
  },

  methods: {
    // getSvgPath(eventType) {
    //   // Logic to determine the SVG path based on the event type
    //   if (eventType === 'Pheno Added') {
    //     return '/tall-icon-container.svg';
    //   } else if (eventType === 'Unknown sig variant') {
    //     return '/tall-icon-container.svg';
    //   } else if (eventType === 'Significant variant') {
    //     return '/tall-icon-container.svg';
    //   } else if (eventType === 'Case diagnosed') {
    //     return '/tall-icon-container.svg'
    //   } else {
    //     // Default SVG path if the event type doesn't match
    //     return '/short-icon-container.svg';
    //   }
    // }
    
  },

  created () {
    
  },

  async mounted() {
    try {
      const response = await fetch('dummy_data.json');
      const jsonData = await response.json();

      // Populate the events array with Event instances
      this.events = jsonData.events.map(
        (event) => new Event(event.type, event.date, event.description)
      );
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }

    console.log(this.events);
  },
}

</script>



<style lang="sass">

.timeline-container
  position: absolute
  height: 400px
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: #ffffff
  border-width: 1px
  border-style: ridge
  border-color: rgba(0, 0, 0, 0.12)

.timeline-title
  font-size: 20px !important
  font-weight: bold !important
  color: #808080 !important
 
.v-container
  padding: 20px !important
  overflow-x: auto !important

.timeline-group
  margin: 180px 0px 0px 0px!important
  padding: 0px 0px 0px 0px !important

.title-container
  margin: 0px 0px 25px 0px !important
  padding: 0px 0px 0px 0px !important
  justify-content: space-between !important
  align-items: center !important
  height: 10px !important
  width: 60px !important

.text-title
  font-size: 10px !important
  font-weight: bold !important
  margin: 0px 0px 0px 0px !important
  padding: 0px 0px 0px 0px !important
  justify-content: space-around !important
  text-align: center !important
  color: #808080 !important

.image-container
  padding: 0px 0px 0px 0px !important
  margin: 0px 0px 0px 0px !important

.v-timeline-item__opposite
  margin: 5px 0px 0px 0px !important
  padding: 0px 0px 0px 0px !important
  width: 100px !important

.v-timeline-item__body
  margin: 0px 0px 0px 0px !important
  padding: 0px 0px 0px 0px !important
  justify-content: center !important
  align-items: center !important
  width: 46px !important

.text-date
  font-size: 10px !important
  font-weight: bold !important
  margin: 15px 25px 0px 0px !important
  padding: 0px 0px 0px 0px !important
  text-align: center !important
  transform: rotate(315deg) !important
  color: #808080 !important
  
  

</style>
