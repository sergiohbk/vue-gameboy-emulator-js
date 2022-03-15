import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";
import { loadInstructions } from "./instrucciones/loadInstructions";
import { jumpinstructions } from "./instrucciones/jumpinstructions";
import { incdecinstructions } from "./instrucciones/incdecinstructions";
import { aluinstructions } from "./instrucciones/ALUinstructions";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.current_opcode;
        this.instructions = [];
        this.pause = false;
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
        //NOP
        //0x00
        this.instructions[0x00] = {
            name: "NOP",
            opcode: 0x00,
            cycles: 4,
            execute: function(cpu){
                cpu.registers.pc += 1;
            }
        };
        //RLCA
        //0x07
        this.instructions[0x07] = {
            name: "RLCA",
            opcode: 0x07,
            cycles: 4,
            execute: function(cpu){
                //seteamos el bit de carry si es mayor a 7F, shifteamos los bits de a, ponemos a 0 las otras flags
                cpu.registers.carry = (cpu.registers.a > 0x7F);
                cpu.registers.a = ((cpu.registers.a << 1) & 0xFF) | cpu.registers.a >> 7;
                cpu.registers.subtraction = false;
                cpu.registers.zero = false;
                cpu.registers.halfcarry = false;
                cpu.registers.pc += 1;
            }
        }
        
        //RRCA
        //0x0F
        this.instructions[0x0F] = {
            name: "RRCA",
            opcode: 0x0F,
            cycles: 4,
            execute: function(cpu){
                cpu.registers.a = cpu.registers.a >> 1 | ((cpu.registers.a & 1) << 7);
                //cambiamos el bit de zero a 0
                cpu.registers.setZeroFlag();
                //cambiamos el bit de halfcarry a 0
                cpu.registers.setHalfCarry();
                //cambiamos el bit de subtract a 0
                cpu.registers.setSubtractFlag();
                //comprobamos si hay carry
                if(cpu.registers.a > 0x7F){
                    cpu.registers.setCarryFlag(1);
                }
                cpu.registers.pc += 1;
            }
        }
        //STOP
        //0x10
        this.instructions[0x10] = {
            name: "STOP",
            opcode: 0x10,
            cycles: 4,
            execute: function(cpu){
                //por ahora no implementada
                cpu.registers.pc += 1;
            }
        }
        //RLA
        //0x17
        this.instructions[0x17] = {
            name: "RLA",
            opcode: 0x17,
            cycles: 4,
            execute: function(cpu){
                //guardamos en variable bool el bit de carry
                var carry = cpu.registers.getCarryFlag();
                //comprobamos si hay carry en la registro a
                if(cpu.registers.a > 0x7F){
                    cpu.registers.setCarryFlag(1);
                }
                //shifteamos a la izquierda el registro a en 1 y hacemos un or con variable carry
                cpu.registers.a = ((cpu.registers.a << 1) & 0xFF) | carry;
                //cambiamos el bit de zero a 0
                cpu.registers.setZeroFlag();
                //cambiamos el bit de halfcarry a 0
                cpu.registers.setHalfCarry();
                //cambiamos el bit de subtract a 0
                cpu.registers.setSubtractFlag();
                cpu.registers.pc += 1;
            }
        }
        //JR r8
        //0x18
        this.instructions[0x18] = {
            name: "JP HL",
            opcode: 0x18,
            cycles: 4,
            execute: function(cpu){
                //sin implementar
                cpu.registers.pc += 1;
            }
        }
        //ADD HL, DE
        //0x19
        this.instructions[0x19] = {
            name: "ADD HL, DE",
            opcode: 0x19,
            cycles: 8,
            execute: function(cpu){
                let suma = cpu.registers.getHL() + cpu.registers.getDE();
                //si la suma es mayor que 0xFFFF, se pone el bit de carry a 1
                if(suma > 0xFFFF){
                    cpu.registers.setCarryFlag(1);
                }
                if((cpu.registers.getHL & 0xFFF) > (suma & 0xFFF)){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtract a 0
                cpu.registers.setSubtractFlag();
                //guardamos la suma en la variable HL
                cpu.registers.setHL(suma & 0xFFFF);
                cpu.registers.pc += 1;
            }
        }
        //RRA
        //0x1F
        this.instructions[0x1F] = {
            name: "RRA",
            opcode: 0x1F,
            cycles: 4,
            execute: function(cpu){
                //sin implementar
                cpu.registers.pc += 1;
            }
        }
        //JR Z, n
        //0x28
        this.instructions[0x28] = {
            name: "JR Z, n",
            opcode: 0x28,
            cycles: 12,
            execute: function(){
                //sin implementar
            }
        }
        //CP n
        //0xFE
        this.instructions[0xFE] = {
            name: "CP n",
            opcode: 0xFE,
            cycles: 8,
            execute: function(cpu){
                let suma = cpu.registers.a - this.bus.read(cpu.registers.pc + 1);
                //si la suma es menor que 0, se pone el bit de carry a 1
                if(suma < 0){
                    cpu.registers.setCarryFlag(1);
                }
                //si la suma es mayor que el registro A & 0xf se pone el bit de halfcarry a 1
                if((cpu.registers.a & 0xF) > (suma & 0xF)){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtract a 1
                cpu.registers.setSubtractFlag(1);
                //si el valor de la suma es igual a 0, se pone el bit de zero a 1
                if(suma == 0){
                    cpu.registers.setZeroFlag(1);
                }
                cpu.registers.pc += 2;
            }
        }
    }
}