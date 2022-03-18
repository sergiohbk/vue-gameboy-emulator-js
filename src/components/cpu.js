import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";
import { loadInstructions } from "./instrucciones/loadInstructions";
import { jumpinstructions } from "./instrucciones/jumpinstructions";
import { incdecinstructions } from "./instrucciones/incdecinstructions";
import { aluinstructions } from "./instrucciones/ALUinstructions";
import { stackinstructions } from "./instrucciones/stackinstructions";
import { otherinstructions } from "./instrucciones/otherinstructions";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.current_opcode;
        this.instructions = [];
        this.pause = false;
        this.ticks = 0;
        this.rom = null;
        this.bus = new Bus();
        this.defineInstructions();
        this.cpu_cycles = 0;
        this.loadBootRom();
    }

    async cpu_execute(){
        //guarda el opcode en current opcode
        if(this.rom === null){
            await this.loadRom();
        }
        this.current_opcode = this.rom[this.registers.pc];
        //mirar que instrucciones aumentan el program counter
        console.log("el opcode en la posicion " + this.registers.pc.toString(16) + " es " + this.current_opcode.toString(16));
        this.cpu_cycles = this.instructions[this.current_opcode].cycles;
        console.log(this.instructions[this.current_opcode].name); 
        this.instructions[this.current_opcode].execute(this);
    }
    async loadBootRom(){
        //añadimos a la memoria el bootrom de gameboy
        const bootRom = await fetch("./gb_boot_rom.gb");
        const bootRomBuffer = await bootRom.arrayBuffer();
        const bootRomArray = new Uint8Array(bootRomBuffer);
        //guardamos el boot rom en la memoria
        for(let i = 0; i < bootRomArray.length; i++){
            this.bus.write(i, bootRomArray[i]);
        }
    }
    async loadRom(){
        const rom = await fetch('./POKEMON_BLUE.GB');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        this.rom = rombuffer;
        this.bus.setRom(rombuffer);
        //no se si habra que cargarlo en memoria
        for(let i = 0x100; i < 0x8000; i++){
            this.bus.memory[i] = rombuffer[i];
        }
        await this.sleep(1000);
    }

    async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    defineInstructions(){
        loadInstructions(this.instructions, this.bus);
        jumpinstructions(this.instructions, this.bus);
        incdecinstructions(this.instructions, this.bus);
        aluinstructions(this.instructions, this.bus);
        stackinstructions(this.instructions, this.bus);
        otherinstructions(this.instructions);
    }
}