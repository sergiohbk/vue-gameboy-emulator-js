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
import { IME, IF_pointer, interrupts_pointer, masterInterruptPointer } from "./interrumpts";
import { DIV_pointer, TAC_pointer, TIMA_pointer, TMA_pointer } from "./timers";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.current_opcode;
        this.instructions = [];
        this.cbinstructions = [];
        this.pause = false;
        this.ticks = 0;
        this.timerticks = 0;
        this.rom = null;
        this.bus = new Bus();
        this.pause = false;
        this.display = new Display(this.bus);
        this.defineInstructions();
        this.cpu_cycles = 0;
        //this.loadBootRom();
        this.test = "";
    }

    interruptsCycle(){
        if(!IME) return;
        let interrupt_request = this.bus.read(IF_pointer);
        let interrupt_enable = this.bus.read(masterInterruptPointer);
        let interrupt = interrupt_request & interrupt_enable;
        if(interrupt == 0) return;
        
        if(interrupt & 0x1)
            this.interrupt_VBlank();
        else if(interrupt & 0x2)
            this.interrupt_LCDSTAT();
        else if(interrupt & 0x4)
            this.interrupt_Timer();
        else if(interrupt & 0x8)
            this.interrupt_Serial();
        else if(interrupt & 0x10)
            this.interrupt_Joypad();
    }

    cpu_execute(){
        //guarda el opcode en current opcode
        this.current_opcode = this.bus.memory[this.registers.pc];
        //mirar que instrucciones aumentan el program counter
        if(this.instructions[this.current_opcode] !== undefined){
            this.cpu_cycles = this.instructions[this.current_opcode].cycles;
            //this.breakpoint(0x102, true);
            //this.breakpoint(0xDF7C, true);
            this.breakpoint(0xC7F4, true);
            this.instructions[this.current_opcode].execute(this);
            this.updateTest();
            this.printTest();
            //console.log(this.registers.pc.toString(16) + " " + this.instructions[this.current_opcode].name + " " + this.cpu_cycles);
        }else
        {
            console.error("instruccion desconocida o invalida con el opcode " + this.current_opcode + " en la posicion " + this.registers.pc.toString(16));
            console.log(this.bus.memory[this.registers.pc].toString(16));
            this.pause = true;
        }
    }
    async loadBootRom(){
        //añadimos a la memoria el bootrom de gameboy
        const bootRom = await fetch("./roms/gb_boot_rom.gb");
        const bootRomBuffer = await bootRom.arrayBuffer();
        const bootRomArray = new Uint8Array(bootRomBuffer);
        //guardamos el boot rom en la memoria
        this.bus.bootrom = bootRomArray;
        //for(let i = 0; i < bootRomArray.length; i++){
        //    this.bus.write(i, bootRomArray[i]);
        //}
    }
    async loadRom(){
        const rom = await fetch('./roms/02-interrupts.gb');
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

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    breakpoint(pc, breakpoint){
        if(this.registers.pc == pc){
            this.pause = breakpoint;
            console.log("breakpoint at " + pc.toString(16) + " " + this.instructions[this.current_opcode].name + " " + this.registers.sp.toString(16)
            + " registro HL: " + this.registers.getHL().toString(16)
            + " registro BC: " + this.registers.getBC().toString(16)
            + " registro DE: " + this.registers.getDE().toString(16)
            + " registro AF: " + this.registers.getAF().toString(16)
            + " zeroflag: " + this.registers.zero
            + " carryflag: " + this.registers.carry
            + " halfcarryflag: " + this.registers.halfcarry
            + " subflag: " + this.registers.subtraction);
        }
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
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.VBlank;
        this.bus.write(IF_pointer, 0x00);
        this.bus.write(masterInterruptPointer, 0x00);
        this.cpu_cycles += 20;
    }
    interrupt_LCDSTAT(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.LCDSTAT;
        this.bus.write(IF_pointer, 0x00);
        this.bus.write(masterInterruptPointer, 0x00);
        this.cpu_cycles += 20;
    }
    interrupt_Timer(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Timer;
        this.bus.write(IF_pointer, 0x00);
        this.bus.write(masterInterruptPointer, 0x00);
        this.cpu_cycles += 20;
    }
    interrupt_Serial(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Serial;
        this.bus.write(IF_pointer, 0x00);
        this.bus.write(masterInterruptPointer, 0x00);
        this.cpu_cycles += 20;
    }
    interrupt_Joypad(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Joypad;
        this.bus.write(IF_pointer, 0x00);
        this.bus.write(masterInterruptPointer, 0x00);
        this.cpu_cycles += 20;
    }
    timerCycle(){
        //si los ciclos son 0 retornar
        if(this.cpu_cycles === 0) return;
        this.ticks += this.cpu_cycles;
        if(this.ticks >= 256){
            this.bus.write(DIV_pointer, this.bus.read(DIV_pointer) + 1);
            this.ticks -= 256;
        }
        if((this.bus.read(TAC_pointer) & 0x4) == 0) return;
        this.ctu_TIMA = this.cyclesToUpTIMA();
        this.timerticks += this.cpu_cycles;
        while(this.timerticks >= this.ctu_TIMA){
            if(this.bus.read(TIMA_pointer) == 0xFF){
                this.bus.write(TIMA_pointer, this.bus.read(TMA_pointer));
                this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x4);
            }else{
                this.bus.write(TIMA_pointer, this.bus.read(TIMA_pointer) + 1);
            }
            this.timerticks -= this.ctu_TIMA;
        }
    }
    cyclesToUpTIMA(){
        switch(this.bus.read(TAC_pointer) & 0x3){
            case 0:
                return 1024;
            case 1:
                return 16;
            case 2:
                return 64;
            case 3:
                return 256;
            default:
                return null;
        }
    }
    teststack(){
        this.bus.write(0x100, 0xF8);
        this.bus.write(0x101, 0x80);
        this.bus.write(0x102, 0x00);
        this.bus.write(0x103, 0xC5);
        this.bus.write(0x104, 0xF1);
        this.bus.write(0x105, 0x00);
        this.bus.write(0x480, 0xF1);
        this.bus.write(0x481, 0x00);

        //registers push y pop funcionan
        //calls parecen funcionar
    }
    updateTest (){
        if(this.bus.read(0xFF02) == 0x81){
            let letra = this.bus.read(0xFF01);
            this.test += String.fromCharCode(letra);
            this.bus.write(0xFF02, 0x00);
        }
    }
    printTest(){
        if(this.test.length > 15){
            console.log(this.test);
        }
    }
    haltHandler(){
        if(IME){
            return false;
        }
        else if(!IME && this.bus.read(IF_pointer) == 0x00 && this.bus.read(masterInterruptPointer) == 0x00){
            this.registers.halted = false;
            return true;
        }
        else if(!IME && this.bus.read(IF_pointer) != 0x00 && this.bus.read(masterInterruptPointer) != 0x00){
            //halt bug (programar)
            this.registers.halted = false;
            return false;
        }
    }
}