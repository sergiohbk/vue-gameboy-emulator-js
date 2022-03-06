import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.bus = new Bus();
    }
    async loadBootRom(){
        //añadimos a la memoria el bootrom de gameboy
        const bootRom = await fetch("./gb_boot_rom.gb");
        const bootRomBuffer = await bootRom.arrayBuffer();
        const bootRomArray = new Uint8Array(bootRomBuffer);
        //guardamos el boot rom en la memoria
        for(let i = 0; i < bootRomArray.length; i++){
            this.bus.writeByte(i, bootRomArray[i]);
        }
        console.log(this.bus.memory);
    }
    async loadRom(){
        const rom = await fetch('./POKEMON_BLUE.GB');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        console.log(rombuffer);
    }
}