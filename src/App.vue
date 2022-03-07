<template>
  <canvas id="canvas"></canvas>
  hola que tal
</template>

<script>
import {GAMEBOY} from './components/gb.js'
export default {
  name: 'App',
  data() {
    return {
      running: false,
      ticks: 0,
    }
  },
  methods: {
    //funcion de ejecucion del loop del emulador
    runGameBoy() { 
      this.gameboy = new GAMEBOY()
      this.running = true
      while(this.running){
        this.ticks++
      }
    },
    testEmulator(){
      this.gameboy = new GAMEBOY()
      this.gameboy.cpu.loadBootRom()
      this.gameboy.cpu.loadRom()
    }
  },

  mounted() {
    this.testEmulator()
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
