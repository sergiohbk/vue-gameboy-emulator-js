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
    async testEmulator(){
      this.gameboy = new GAMEBOY()
      await this.gameboy.cpu.cpu_execute();
      await this.gameboy.cpu.cpu_execute();
      console.log(this.gameboy.cpu.bus.memory);
      console.log(this.gameboy.cpu.registers.a);
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
