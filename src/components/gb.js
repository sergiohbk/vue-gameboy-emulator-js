import { CPU } from "./cpu";
import { GPU } from "./gpu";
import { cyclesPerFrame } from "./variables/GPUConstants";

export class GAMEBOY{
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

    constructor(){
        this.cpu = new CPU();
        this.gpu = new GPU(this.cpu.bus);
        this.lastTime = 0;
        this.fps = 0;
        this.cycles = 0;
        this.running = true;
    }

    run(){
        requestAnimationFrame(time => (this.runFrame(time)))
    }
    
    runFrame(currentTime){
        if(!this.running) return;
        const deltaTime = currentTime - this.lastTime;

        if(deltaTime >= 1000/60 || !this.lastTime){
            this.fps = Math.round(1000/deltaTime);
            this.lastTime = currentTime - (deltaTime % (1000/60));

            while(this.cycles < cyclesPerFrame){
                let cyclesFrame = this.cpu.tick();
                this.gpu.tick(cyclesFrame);
                this.cycles += cyclesFrame;
            }
            this.cycles %= cyclesPerFrame;
        }
        requestAnimationFrame(time => (this.runFrame(time)))
    }

    async loadBootRom(){
        //añadimos a la memoria el bootrom de gameboy
        const bootRom = await fetch("./roms/gb_boot_rom.gb");
        const bootRomBuffer = await bootRom.arrayBuffer();
        const bootRomArray = new Uint8Array(bootRomBuffer);
        //guardamos el boot rom en la memoria
        for(let i = 0; i < bootRomArray.length; i++){
            this.cpu.bus.write(i, bootRomArray[i]);
        }
    }
    async loadRom(){
        const rom = await fetch('./roms/interrupt_time.gb');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        this.cpu.rom = rombuffer;
        this.cpu.bus.setRom(rombuffer);
        //no se si habra que cargarlo en memoria
        for(let i = 0x0000; i < 0x8000; i++){
            this.cpu.bus.memory[i] = rombuffer[i];
        }
        await this.cpu.sleep(1000);
    }
}