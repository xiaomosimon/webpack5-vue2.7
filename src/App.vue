<template>
  <div id="app">
    <h1 class="red">Hello World, {{ msg }}</h1>
    <img width="100px" height="100px" src="./assets/img/logo.jpeg" />
    <Button ref="ButtonRef" text="提交" />
    <img width="100px" height="100px" src="./assets/img/test.jpg" />
    <Home />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Button from './components/TFButton.vue';
import Home from './views/HomePage.vue';

const msg = ref<string>('Simon Liu');
const ButtonRef = ref(null);
</script>
<style lang="scss" scoped>
#app {
  .red {
    color: red;
    transform: translateX(-200px);
  }
}

.red {
  color: blue;
}
</style>
