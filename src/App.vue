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
      <tr style="display:none">
        <td>update</td>
        <td>{{update}}</td>
      </tr>
      <tr>
        <td>A</td>
        <td>0x{{ gameboy.cpu.registers.a.toString(16) }}</td>
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
  <table class="content-table">
    <thead>
      <tr>
        <th>Stack Position</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr style="display:none">
        <td>update</td>
        <td>{{update}}</td>
      </tr>
      <tr v-for="(value, index) in gameboy.cpu.registers.stack" v-bind:key="index">
        <td>0x{{ index.toString(16) }}</td>
        <td>0x{{ value.toString(16) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {ref} from 'vue'
import {GAMEBOY} from './components/gb.js'
export default {
  name: 'App',
  setup() {
    var gameboy = new GAMEBOY()
    var running = false
    var ticks = 0
    var a = ref(gameboy.cpu.registers.a)
    var b = ref(gameboy.cpu.registers.b)
    var c = ref(gameboy.cpu.registers.c)
    var d = ref(gameboy.cpu.registers.d)
    var e = ref(gameboy.cpu.registers.e)
    var h = ref(gameboy.cpu.registers.h)
    var l = ref(gameboy.cpu.registers.l)
    var sp = ref(gameboy.cpu.registers.sp)
    var pc = ref(gameboy.cpu.registers.pc)
    var carry = ref(gameboy.cpu.registers.carry)
    var zero = ref(gameboy.cpu.registers.zero)
    var subtraction = ref(gameboy.cpu.registers.subtraction)
    var halfcarry = ref(gameboy.cpu.registers.halfcarry)
    var update = ref(0)
    var stack = ref(gameboy.cpu.registers.stack)
    return {
      gameboy,
      running,
      ticks,
      update,
      a,
      b,
      c,
      d,
      e,
      h,
      l,
      sp,
      pc,
      carry,
      zero,
      subtraction,
      halfcarry,
      stack
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
      this.updateReactive()
      this.gameboy.cpu.display.createDisplay()
      await this.gameboy.cpu.cpu_execute();
      await this.gameboy.cpu.cpu_execute();
      await this.gameboy.cpu.cpu_execute();
    },
    async updateReactive(){
      while(this.running)
      {  
        this.update += 1
        await this.gameboy.cpu.sleep(100)
      }
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
