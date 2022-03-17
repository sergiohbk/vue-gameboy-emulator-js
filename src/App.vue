<template>
  <canvas id="canvas"></canvas>
  hola que tal
  <table class="content-table">
    <thead>
      <tr>
        <th>Register</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>A</td>
        <td>0x{{ gameboy.cpu.registers.a.toString(16)}}</td>
      </tr>
      <tr>
        <td>B</td>
        <td>0x{{ gameboy.cpu.registers.b.toString(16) }}</td>
      </tr>
      <tr>
        <td>C</td>
        <td>0x{{ gameboy.cpu.registers.c.toString(16) }}</td>
      </tr>
      <tr>
        <td>D</td>
        <td>0x{{ gameboy.cpu.registers.d.toString(16) }}</td>
      </tr>
      <tr>
        <td>E</td>
        <td>0x{{ gameboy.cpu.registers.e.toString(16) }}</td>
      </tr>
      <tr>
        <td>H</td>
        <td>0x{{ gameboy.cpu.registers.h.toString(16) }}</td>
      </tr>
      <tr>
        <td>L</td>
        <td>0x{{ gameboy.cpu.registers.l.toString(16) }}</td>
      </tr>
      <tr>
        <td>stack pointer</td>
        <td>0x{{ gameboy.cpu.registers.sp.toString(16) }}</td>
      </tr>
      <tr>
        <td>program counter</td>
        <td>0x{{ gameboy.cpu.registers.pc.toString(16) }}</td>
      </tr>
      <tr>
        <td>carry</td>
        <td>{{ gameboy.cpu.registers.carry }}</td>
      </tr>
      <tr>
        <td>zero</td>
        <td>{{ gameboy.cpu.registers.zero }}</td>
      </tr>
      <tr>
        <td>subtract</td>
        <td>{{ gameboy.cpu.registers.subtraction }}</td>
      </tr>
      <tr>
        <td>half carry</td>
        <td>{{ gameboy.cpu.registers.halfcarry }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {GAMEBOY} from './components/gb.js'
export default {
  name: 'App',
  setup() {
    var gameboy = new GAMEBOY()
    var running = false
    var ticks = 0
    return {
      gameboy,
      running,
      ticks,
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
      this.running = true
      await this.gameboy.cpu.cpu_execute();
      await this.gameboy.cpu.cpu_execute();
      await this.gameboy.cpu.cpu_execute();
    },
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
  border-bottom: 2px solid #136d50;
}

</style>
