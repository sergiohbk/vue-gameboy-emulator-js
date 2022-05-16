<template>
  <div class="background">
    <div class="main-screen">
      <div class="border-animate">
        <canvas id="canvas" class="screen"></canvas>
      </div>
      <div class="buttons">
        <button @click="hola">cargar</button>
        <button @click="hola1">ejecutar</button>
        <button @click="hola2">parar</button>
        <button @click="hola3">breakpoint</button>
        <button @click="hola4">guardar partida</button>
        <input type="text" v-model="hex">
        <span style="color:white">{{hex}}</span>
        <button @click="hola5">seccion memoria</button>
        <button @click="hola6">txt instrucciones</button>
        hola que tal
      </div>
    </div>
    <div class="debug-screen">
      <canvas id="debug"></canvas>
    </div>
    <div>
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
    </div>
  </div>
</template>

<script>
import {saveAsATxt } from './components/extras/debugger.js'
import {GAMEBOY} from './components/gb.js'
import { IME } from './components/interrumpts.js'
export default {
  name: 'App',
  data(){
    return{
      hex: 0x0000
    }
  },
  setup() {
    var canvasloading = false
    return {
      canvasloading,
    }
  },
  methods: {
    //funcion de ejecucion del loop del emulador
    hola(){
      this.canvasloading = true
      this.gameboy = new GAMEBOY()
      this.gameboy.loadRom()
      //this.gameboy.loadBootRom()
    },
    hola1(){
      this.gameboy.run();
    },
    hola2(){
      this.gameboy.running = false
      console.log(this.gameboy.cpu.test)
      console.log("breakpoint at " + this.gameboy.cpu.registers.pc.toString(16) + " la posicion de la stack esta en: " + this.gameboy.cpu.registers.sp.toString(16)
            + " registro HL: " + this.gameboy.cpu.registers.getHL().toString(16)
            + " registro BC: " + this.gameboy.cpu.registers.getBC().toString(16)
            + " registro DE: " + this.gameboy.cpu.registers.getDE().toString(16)
            + " registro AF: " + this.gameboy.cpu.registers.getAF().toString(16)
            + " zeroflag: " + this.gameboy.cpu.registers.zero
            + " carryflag: " + this.gameboy.cpu.registers.carry
            + " halfcarryflag: " + this.gameboy.cpu.registers.halfcarry
            + " subflag: " + this.gameboy.cpu.registers.subtraction);
    },
    hola3(){
      console.log("point at " + this.gameboy.cpu.registers.pc.toString(16) + " la posicion de la stack esta en: " + this.gameboy.cpu.registers.sp.toString(16)
            + " registro HL: " + this.gameboy.cpu.registers.getHL().toString(16)
            + " registro BC: " + this.gameboy.cpu.registers.getBC().toString(16)
            + " registro DE: " + this.gameboy.cpu.registers.getDE().toString(16)
            + " registro AF: " + this.gameboy.cpu.registers.getAF().toString(16)
            + " zeroflag: " + this.gameboy.cpu.registers.zero
            + " carryflag: " + this.gameboy.cpu.registers.carry
            + " halfcarryflag: " + this.gameboy.cpu.registers.halfcarry
            + " subflag: " + this.gameboy.cpu.registers.subtraction
            + " halt?: " + this.gameboy.cpu.registers.halted
            + " interrupt request " + this.gameboy.cpu.bus.memory[0xFF0F].toString(2)
            + " interrupt enable " + this.gameboy.cpu.bus.memory[0xFFFF].toString(2)
            + " ime " + IME
            + " dmaActive " + this.gameboy.cpu.bus.dma.active);
    },
    hola4(){
      this.gameboy.cpu.bus.MBC.save();
    },
    hola5(){
      let hexi = parseInt(this.hex, 16)
      console.log(this.gameboy.cpu.bus.memory[hexi].toString(16))
    },
    hola6(){
      saveAsATxt();
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
  background-color: #3F3F3F;
}
.background{
  background-color: #3F3F3F;
  width: 100%;
  height: auto;
  min-height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
.main-screen{
  display: flex;
  justify-content: center;
}
.debug-screen{
  display: flex;
  justify-content: center;
}
.buttons{
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas{
  margin: 1rem;
  z-index: 1;
  image-rendering: pixelated;
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
.screen{
  height: 600px;
  width: 800px;
}

</style>
