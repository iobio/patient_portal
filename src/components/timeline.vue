<template>
    <div class="timeline">
        <v-timeline align="start" direction="horizontal">
            <v-timeline-item
              v-for="(item, i) in items"
              :key="i"
              :dot-color="item.color"
              :icon="item.icon"
              fill-dot
            >
              <v-card>
                <v-card-title :class="['text-h6', `bg-${item.color}`]">
                  Case Added
                </v-card-title>
                <v-card-text class="bg-white text--primary">
                  <p>
                    Description of event
                  </p>
                  <v-btn :color="item.color" variant="outlined"> Button </v-btn>
                </v-card-text>
              </v-card>
            </v-timeline-item>
        </v-timeline>

    </div>

  
</template>

<script>
export default {
  name: 'timeline',
  components: {
    
  },
  data: () => ({
    items: [
        {
          color: 'red-lighten-2',
          icon: 'mdi-star',
        },
        {
          color: 'purple-lighten-2',
          icon: 'mdi-book-variant',
        },
        {
          color: 'green-lighten-1',
          icon: 'mdi-airballoon',
        },
        {
          color: 'indigo-lighten-2',
          icon: 'mdi-layers-triple',
        },
      ],
    
  }),
  computed: {
    
  },
  methods: {
    
  },
  created () {
    
  }
}
</script>



<style lang="sass">

.timeline
    margin: 0 auto
    max-width: 600px
    padding: 200px 0
    .v-timeline-item
        .v-timeline-item__icon
        border-radius: 50%
        height: 30px
        width: 30px
        .v-icon
            font-size: 16px
            line-height: 30px
        .v-timeline-item__fill-dot
        border-radius: 50%
        height: 10px
        width: 10px
        .v-timeline-item__content
        margin-left: 20px
        .v-card
            width: 100%
            .v-card__title
            padding: 10px 16px
            .v-icon
                font-size: 16px
                margin-right: 10px
            .v-card__text
            padding: 16px
            .v-btn
                margin-top: 10px
                width: 100%
                .v-icon
                margin-right: 10px
                font-size: 16px
                line-height: 30px



</style>
