import { CPU } from "./cpu";
import { GPU } from "./gpu";
import { cyclesPerFrame } from "./variables/GPUConstants";

export class GAMEBOY {
  // especificaciones
  // cpu z80 (8080 like)
  // cpu freq 4,194,304 MHz
  // ram 8kb
  // rom 16kb
  // video ram 8kb
  // resolucion de pantalla 160x144
  // 4 tonos de gris
  // sincronizacion vertical 59,73 Hz
  // sincronizacion horizontal 9,198 Hz

  constructor() {
    this.cpu = new CPU();
    this.gpu = new GPU(this.cpu.bus);
    this.lastTime = 0;
    this.fps = 60;
    this.then = 0;
    this.now = 0;
    this.interval = 0;
    this.elapsed = 0;
    this.cycles = 0;
    this.running = true;
    this.frameFinishedCallback = null;
  }

  run() {
    this.interval = 1000 / this.fps;
    this.then = window.performance.now();
    requestAnimationFrame((time) => this.runFrame(time));
  }

  runFrame(time) { 
    if (!this.running) return;
    this.now = time;
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.interval){
      this.then = this.now - (this.elapsed % this.interval);
      
      while (this.cycles < cyclesPerFrame) {
        let cyclesFrame = this.cpu.tick();
        this.gpu.tick(cyclesFrame);
        this.cycles += cyclesFrame;
      }

      this.gpu.renderTheFrame();

      this.cycles %= cyclesPerFrame;
    }
    requestAnimationFrame((time) => this.runFrame(time));
  }

  onFrameFinished(callback) {
    this.frameFinishedCallback = callback;
  }

  async loadBootRom() {
    //añadimos a la memoria el bootrom de gameboy
    const bootRom = await fetch("./roms/gb_boot_rom.gb");
    const bootRomBuffer = await bootRom.arrayBuffer();
    const bootRomArray = new Uint8Array(bootRomBuffer);
    //guardamos el boot rom en la memoria
    for (let i = 0; i < bootRomArray.length; i++) {
      this.cpu.bus.memory[i] = bootRomArray[i];
    }
  }
  async loadRom() {
    const rom = await fetch("./roms/zelda.gb");
    const buffer = await rom.arrayBuffer();
    const rombuffer = new Uint8Array(buffer);
    this.cpu.rom = rombuffer;
    this.cpu.bus.setRom(rombuffer);

    this.cpu.bus.MBC.init();
    await this.cpu.sleep(1000);
  }
}
