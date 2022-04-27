import { Bus } from "./bus";
import { Registers } from "./registers";
import { loadInstructions } from "./instrucciones/loadInstructions";
import { jumpinstructions } from "./instrucciones/jumpinstructions";
import { incdecinstructions } from "./instrucciones/incdecinstructions";
import { aluinstructions } from "./instrucciones/ALUinstructions";
import { stackinstructions } from "./instrucciones/stackinstructions";
import { otherinstructions } from "./instrucciones/otherinstructions";
import { bitinstuctions } from "./instrucciones/bitinstructions";
import { IME, IF_pointer, interrupts_pointer, masterInterruptPointer, setIME } from "./interrumpts";
import { DIV_pointer, TAC_pointer, TIMA_pointer, TMA_pointer } from "./timers";
import { startSavingInstructions, rangeInstructionsToLog } from "./extras/debugger";

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
        this.defineInstructions();
        if(!this.registers.bootstrap)
            this.inicialiceMemory();
        this.cpu_cycles = 0;
        //this.loadBootRom();
        this.test = "";
    }

    tick(){
        if(this.pause) return;
        this.interruptsCycle();

        if(this.registers.halted){
            /*if(this.haltHandler()){
                
            }*/
            this.cpu_cycles += 4;
            this.timerCycle();
            return this.cpu_cycles;
        }
        this.cpu_execute();
        this.timerCycle();
        return this.cpu_cycles;
    }

    inicialiceMemory(){
        //this.bus.memory[0xFF00] = 0xFF;
        this.bus.memory[0xFF04] = 0xAC;
        this.bus.memory[0xFF05] = 0x00;
        this.bus.memory[0xFF06] = 0x00;
        this.bus.memory[0xFF07] = 0x00;
        this.bus.memory[0xFF0F] = 0xE1;
        this.bus.memory[0xFF10] = 0x80;
        this.bus.memory[0xFF11] = 0xBF;
        this.bus.memory[0xFF12] = 0xF3;
        this.bus.memory[0xFF14] = 0xBF;
        this.bus.memory[0xFF16] = 0x3F;
        this.bus.memory[0xFF17] = 0x00;
        this.bus.memory[0xFF19] = 0xBF;
        this.bus.memory[0xFF1A] = 0x7F;
        this.bus.memory[0xFF1B] = 0xFF;
        this.bus.memory[0xFF1C] = 0x9F;
        this.bus.memory[0xFF1E] = 0xBF;
        this.bus.memory[0xFF20] = 0xFF;
        this.bus.memory[0xFF21] = 0x00;
        this.bus.memory[0xFF22] = 0x00;
        this.bus.memory[0xFF23] = 0xBF;
        this.bus.memory[0xFF24] = 0x77;
        this.bus.memory[0xFF25] = 0xF3;
        this.bus.memory[0xFF26] = 0xF1;
        this.bus.memory[0xFF40] = 0x91;
        this.bus.memory[0xFF42] = 0x00;
        this.bus.memory[0xFF43] = 0x00;
        this.bus.memory[0xFF45] = 0x00;
        this.bus.memory[0xFF47] = 0xFC;
        this.bus.memory[0xFF48] = 0xFF;
        this.bus.memory[0xFF49] = 0xFF;
        this.bus.memory[0xFF4A] = 0x00;
        this.bus.memory[0xFF4B] = 0x00;
        this.bus.memory[0xFFFF] = 0x00;
    }

    interruptsCycle(){
        

        let interrupt_request = this.bus.read(IF_pointer);
        //comprobar si al añadir un request interrupt, se aumenta el master interrupt en la siguiente iteracion
        let interrupt_enable = this.bus.read(masterInterruptPointer);
        //console.log("interrupt request " + interrupt_request.toString(2))
        //console.log("interrupt enable " +interrupt_enable.toString(2))
        let interrupt = interrupt_request & interrupt_enable;
        //console.log("interrupt and " + interrupt.toString(2) + " ime " + IME)
        if(interrupt > 0){
            this.registers.halted = false;

            if(!IME && this.registers.halted){
                return;
            }
        }else{
            return;
        }

        if(!IME) return;

        if(interrupt & 0x1){
            this.interrupt_VBlank();
        }
        else if(interrupt & 0x2){
            this.interrupt_LCDSTAT();
        }
        else if(interrupt & 0x4){
            this.interrupt_Timer();
        }
        else if(interrupt & 0x8){
            this.interrupt_Serial();
        }
        else if(interrupt & 0x10){
            this.interrupt_Joypad();
        }
    }

    cpu_execute(){
        //guarda el opcode en current opcode
        this.current_opcode = this.bus.memory[this.registers.pc];
        if(this.instructions[this.current_opcode] !== undefined){
            //this.breakpoint(0x101, true);
            //this.breakpoint(0xDF7C, true);
            this.cpu_cycles = this.instructions[this.current_opcode].cycles;
            this.instructions[this.current_opcode].execute(this);
            if(this.current_opcode == 0xCB){
                this.cpu_cycles += this.instructions[this.current_opcode].cycles;
            }

            if(this.bus.dma.isTransferring){
                this.cpu_cycles += 160;
                this.bus.dma.isTransferring = false;
            }
            this.debugInstruction();
            rangeInstructionsToLog(this.registers.pc, this.instructions[this.current_opcode].name);
            
            //this.breakpoint(0x359, false);
        }else
        {
            console.error("instruccion desconocida o invalida con el opcode " + this.current_opcode + " en la posicion " + this.registers.pc.toString(16));
            console.log(this.bus.memory[this.registers.pc].toString(16));
            this.pause = true;
        }
    }

    debugInstruction(){
        if(this.bus.controller.startPressed)
            startSavingInstructions(true);
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
            + " subflag: " + this.registers.subtraction
            + " IME: " + IME
            + " interrupt_enable: " + this.bus.read(masterInterruptPointer).toString(16)
            + " interrupt_request: " + this.bus.read(IF_pointer).toString(16));
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
        this.bus.write(IF_pointer, this.bus.read(IF_pointer) & 0xFE);
        this.cpu_cycles += 20;
        setIME(false);
    }
    interrupt_LCDSTAT(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.LCDSTAT;
        this.bus.write(IF_pointer, this.bus.read(IF_pointer) & 0xFD);
        this.cpu_cycles += 20;
        setIME(false);
    }
    interrupt_Timer(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Timer;
        this.bus.write(IF_pointer, this.bus.read(IF_pointer) & 0xFB);
        this.cpu_cycles += 20;
        setIME(false);
    }
    interrupt_Serial(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Serial;
        this.bus.write(IF_pointer, this.bus.read(IF_pointer) & 0xF7);
        this.cpu_cycles += 20;
        setIME(false);
    }
    interrupt_Joypad(){
        this.registers.stackPush16(this.registers.pc, this.bus);
        this.registers.pc = interrupts_pointer.Joypad;
        this.bus.write(IF_pointer, this.bus.read(IF_pointer) & 0xEF);
        //this.bus.write(masterInterruptPointer, this.bus.read(masterInterruptPointer) & 0xEF);
        this.cpu_cycles += 20;
        setIME(false);
    }
    timerCycle(){
        //si los ciclos son 0 retornar
        if(this.cpu_cycles === 0) return;

        this.ticks += this.cpu_cycles;
        if(this.ticks >= 255){
            this.bus.write(DIV_pointer, (this.bus.read(DIV_pointer) + this.ticks) & 0xff);
            this.ticks = 0;
        }
        if((this.bus.read(TAC_pointer) & 0x4) == 0) return;
        this.ctu_TIMA = this.cyclesToUpTIMA();
        this.timerticks += this.cpu_cycles;
        if(this.timerticks >= this.ctu_TIMA){
            this.timerticks = 0;
            if(this.bus.read(TIMA_pointer) == 255){
                this.bus.write(TIMA_pointer, this.bus.read(TMA_pointer));
                this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x4);
            }else{
                this.bus.write(TIMA_pointer, this.bus.read(TIMA_pointer) + 1);
            }
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
                return 1024;
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
            return true;
        }
        else if(!IME && this.bus.read(IF_pointer) != 0x00 && this.bus.read(masterInterruptPointer) != 0x00){
            //halt bug (programar)
            this.registers.halted = false;
            return false;
        }
        else if(!IME){
            return true;
        }
    }
}