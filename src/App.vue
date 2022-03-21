<template>
  <canvas id="canvas"></canvas>
  hola que tal
  <table class="content-table" v-if="false">
    <thead>
      <tr>
        <th>Register</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>A</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>B</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>C</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>D</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>E</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>H</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>L</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>stack pointer</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>program counter</td>
        <td>0x</td>
      </tr>
      <tr>
        <td>carry</td>
        <td></td>
      </tr>
      <tr>
        <td>zero</td>
        <td></td>
      </tr>
      <tr>
        <td>subtract</td>
        <td></td>
      </tr>
      <tr>
        <td>half carry</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <table class="content-table" v-if="false">
    <thead>
      <tr>
        <th>Stack Position</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0x{{ index.toString(16) }}</td>
        <td>0x{{ value.toString(16) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {GAMEBOY} from './components/gb.js'
import { IME } from './components/interrumpts.js'
export default {
  name: 'App',
  setup() {
    var running = false
    var ticks = 0
    return {
      running,
      ticks
    }
  },
  methods: {
    //funcion de ejecucion del loop del emulador
    async runGameBoy() { 
      this.gameboy = new GAMEBOY()
      this.running = true
      while(this.running){
        if(!this.gameboy.cpu.registers.halted){
          await this.gameboy.cpu.cpu_execute()
          this.ticks++
          await this.gameboy.cpu.interruptsCycle()
        }else{
          if(IME){
            this.gameboy.cpu.registers.halted = false
          }
        }
        //if interruptmasterenable desactiva IME y controla las interrupciones, luego quita el halted
        //if IME es true interruptmasterenable es true
      }
    },
    async testEmulator(){
      var gameboy = new GAMEBOY()
      this.running = true
      await gameboy.cpu.cpu_execute();
      await gameboy.cpu.cpu_execute();
      await gameboy.cpu.cpu_execute();
    }
  },

  mounted() {
    this.testEmulator()
  },
  computed:{

  }
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
.content-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 1.5em;
  min-width: 800px;
  border: 1px solid #ddd;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  justify-content: center;
}
.content-table thead tr {
  background-color: #6473f5;
  color: #fff;
  text-align: left;
  font-weight: bold;
}
.content-table th,
.content-table td {
  padding: 12px 15px;
}
.content-table tbody tr {
  border-bottom: 1px solid #ddd;
}
.content-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}
.content-table tbody tr:last-of-type {
  border-bottom: 5px solid #6fd6ff;
}

</style>
