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
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Sit on top */
  transform: translate(-50%, -50%);
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

  