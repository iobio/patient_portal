<script>
// import timeline from "./components/timeline.vue"
// import timeline_d3 from "./components/timeline_d3.vue"
import vanillaJs_timeline from "./components/vanillaJs_timeline.vue";



export default {
  name: 'App',
  components: {
    // timeline,
    // timeline_d3,
    vanillaJs_timeline
     
  },
  data: () => ({
    
  }),
  computed: {
    
  },
  methods: {
    
  },
  created () {
    
  }
}

</script>

<template>
  <v-app>
      <!-- <timeline></timeline> -->
      <!-- <timeline_d3></timeline_d3> -->
      <vanillaJs_timeline></vanillaJs_timeline>
  </v-app>
</template>

<style lang="sass">

</style>
