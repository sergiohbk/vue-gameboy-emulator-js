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
  <button @click="hola">cargar</button>
  <button @click="hola1">ejecutar</button>
  <button @click="hola2">parar</button>
</template>

<script>
import {GAMEBOY} from './components/gb.js'
import { clocksperfps } from './components/variables/globalConstants.js'
export default {
  name: 'App',
  setup() {
    var running = false
    var ticks = 0
    var cycles = 0
    var lastTime = 0
    var msperframe = 1000 / 60
    return {
      ticks,
      cycles,
      lastTime,
      msperframe,
      running
    }
  },
  methods: {
    //funcion de ejecucion del loop del emulador
    runGameBoy() { 
      this.running = true
      this.run()
    },
    run(){
      requestAnimationFrame(time => (this.runFrame(time)))
    },
    runFrame(currentTime){
      if(!this.running) return;
      if(this.gameboy.cpu.pause) return;

      const delta = currentTime - this.lastTime
      //console.log(this.gameboy.cpu.registers.pc.toString(16))
      if(delta >= this.msperframe || this.lastTime)
      {
        this.fps = Math.round(1000 / delta)
        this.lastTime = currentTime - (delta % this.msperframe)

        while(this.cycles <= clocksperfps){
          if(!this.gameboy.cpu.registers.halted)
          {
            this.gameboy.cpu.cpu_execute();
          }else{
            this.gameboy.cpu.cpu_execute();
          }
          this.gameboy.cpu.interruptsCycle();
          this.gameboy.cpu.timerCycle();
          this.cycles += this.gameboy.cpu.cpu_cycles;
        }
        this.cycles %= clocksperfps;
      }
      //console.log(this.gameboy.cpu.registers.stack)
      requestAnimationFrame(time => (this.runFrame(time)))
    },
    hola(){
      this.gameboy = new GAMEBOY()
      this.gameboy.cpu.loadRom()
    },
    hola1(){
      this.runGameBoy()
    },
    hola2(){
      this.running = false
      console.log(this.gameboy.cpu.test)
      console.log(this.gameboy.cpu.registers.a.toString(16) + " " + this.gameboy.cpu.registers.b.toString(16) + " " + this.gameboy.cpu.registers.c.toString(16) + " " + this.gameboy.cpu.registers.d.toString(16) + " " + this.gameboy.cpu.registers.e.toString(16) + " " + this.gameboy.cpu.registers.h.toString(16) + " " + this.gameboy.cpu.registers.l.toString(16) + " " + this.gameboy.cpu.registers.sp.toString(16) + " " + this.gameboy.cpu.registers.pc.toString(16) + " " + this.gameboy.cpu.registers.carry + " " + this.gameboy.cpu.registers.zero + " " + this.gameboy.cpu.registers.subtraction + " " + this.gameboy.cpu.registers.halfcarry + " ")
    }
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
