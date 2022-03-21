import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";
import { loadInstructions } from "./instrucciones/loadInstructions";
import { jumpinstructions } from "./instrucciones/jumpinstructions";
import { incdecinstructions } from "./instrucciones/incdecinstructions";
import { aluinstructions } from "./instrucciones/ALUinstructions";
import { stackinstructions } from "./instrucciones/stackinstructions";
import { otherinstructions } from "./instrucciones/otherinstructions";
import { bitinstuctions } from "./instrucciones/bitinstructions";
import { IME, IF_pointer, interrupts_pointer, setIME } from "./interrumpts";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.current_opcode;
        this.instructions = [];
        this.cbinstructions = [];
        this.pause = false;
        this.ticks = 0;
        this.rom = null;
        this.bus = new Bus();
        this.display = new Display(this.bus);
        this.defineInstructions();
        this.cpu_cycles = 0;
        this.loadBootRom();
    }

    async interruptsCycle(){
        if(IME){
            console.log("se ha producido una interrupcion");
            let interrupt_indicator = this.bus.read(IF_pointer);
            if(interrupt_indicator & 0x1){
                this.interrupt_VBlank();
            }
            if(interrupt_indicator & 0x2){
                this.interrupt_LCDSTAT();
            }
            if(interrupt_indicator & 0x4){
                this.interrupt_Timer();
            }
            if(interrupt_indicator & 0x8){
                this.interrupt_Serial();
            }
            if(interrupt_indicator & 0x10){
                this.interrupt_Joypad();
            }
        }
    }

    async cpu_execute(){
        //guarda el opcode en current opcode
        if(this.rom === null){
            await this.loadRom();
        }
        this.current_opcode = this.rom[this.registers.pc];
        //mirar que instrucciones aumentan el program counter
        console.log("el opcode en la posicion " + this.registers.pc.toString(16) + " es " + this.current_opcode.toString(16));
        if(this.instructions[this.current_opcode] !== undefined){
            this.cpu_cycles = this.instructions[this.current_opcode].cycles;
            console.log(this.instructions[this.current_opcode].name); 
            this.instructions[this.current_opcode].execute(this);
        }else
        {
            console.error("instruccion desconocida o invalida con el opcode " + this.current_opcode.toString(16));
            this.registers.halted = true;
        }
    }
    async loadBootRom(){
        //añadimos a la memoria el bootrom de gameboy
        const bootRom = await fetch("./gb_boot_rom.gb");
        const bootRomBuffer = await bootRom.arrayBuffer();
        const bootRomArray = new Uint8Array(bootRomBuffer);
        //guardamos el boot rom en la memoria
        this.bus.bootrom = bootRomArray;
        //for(let i = 0; i < bootRomArray.length; i++){
        //    this.bus.write(i, bootRomArray[i]);
        //}
    }
    async loadRom(){
        const rom = await fetch('./POKEMON_BLUE.GB');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        this.rom = rombuffer;
        this.bus.setRom(rombuffer);
        //no se si habra que cargarlo en memoria
        for(let i = 0x0000; i < 0x8000; i++){
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
        bitinstuctions(this.instructions, this.bus, this.cbinstructions);
    }

    interrupt_VBlank(){
        setIME(false);
        this.registers.stackPush16(this.registers.pc);
        this.registers.pc = interrupts_pointer.VBlank;
    }
    interrupt_LCDSTAT(){
        setIME(false);
        this.registers.stackPush16(this.registers.pc);
        this.registers.pc = interrupts_pointer.LCDSTAT;
    }
    interrupt_Timer(){
        setIME(false);
        this.registers.stackPush16(this.registers.pc);
        this.registers.pc = interrupts_pointer.Timer;
    }
    interrupt_Serial(){
        setIME(false);
        this.registers.stackPush16(this.registers.pc);
        this.registers.pc = interrupts_pointer.Serial;
    }
    interrupt_Joypad(){
        setIME(false);
        this.registers.stackPush16(this.registers.pc);
        this.registers.pc = interrupts_pointer.Joypad;
    }
}