<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <h2>{{ type }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: Boolean,
      type: String,
      description: String,
    },
  
    methods: {
      close() {
        this.$emit("close");
      },
    },
  };
  </script>
  
<style scoped>

.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Black w/ opacity */
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Sit on top */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}
</style>

  