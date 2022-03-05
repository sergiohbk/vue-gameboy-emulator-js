<template>
  <canvas id="canvas"></canvas>
  hola que tal
</template>

<script>
import {CPU} from './components/cpu.js'
export default {
  name: 'App',

  mounted() {
    this.cpu = new CPU();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
