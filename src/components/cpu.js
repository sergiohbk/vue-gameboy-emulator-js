import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";
import { Cartridge } from "./cartridge";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.bus = new Bus();
        this.cardridge;
        this.current_opcode;
        this.instructions = [];
        this.pause = false;
        this.rom;
        this.defineInstructions();
        this.cpu_cycles = 0;
    }

    async cpu_execute(){
        //guarda el opcode en current opcode
        if(!this.rom)
            await this.loadRom();
        if(this.rom){
            this.current_opcode = this.rom[this.registers.pc];
            console.log(this.current_opcode.toString(16));
            //mirar que instrucciones aumentan el program counter
            this.cpu_cycles = this.instructions[this.current_opcode].cycles;
            this.instructions[this.current_opcode].execute(this);
        } 
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
    }
    async loadRom(){
        const rom = await fetch('./POKEMON_BLUE.GB');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        this.rom = rombuffer;
        this.cardridge = new Cartridge(rombuffer);
    }

    async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    defineInstructions(){
        //NOP
        //0x00
        this.instructions[0x00] = {
            name: "NOP",
            opcode: 0x00,
            cycles: 4,
            execute: function(cpu){
                console.log("NOP");
                cpu.registers.pc += 1;
            }
        };
        //LD BC, nn
        //0x01
        this.instructions[0x01] = {
            name: "LD BC, nn",
            opcode: 0x01,
            cycles: 12,
            execute: function(cpu){
                cpu.registers.c = cpu.rom[cpu.registers.pc + 1];
                cpu.registers.b = cpu.rom[cpu.registers.pc + 2];
                cpu.registers.pc += 3;
            }
        }
        //LD (BC), A
        //0x02
        this.instructions[0x02] = {
            name: "LD (BC), A",
            opcode: 0x02,
            cycles: 8,
            execute: function(cpu){
                //guardamos el valor de BC en A
                cpu.registers.a = cpu.registers.getBC();
                cpu.registers.pc += 1; 
            }
        }
        //INC BC
        //0x03
        this.instructions[0x03] = {
            name: "INC BC",
            opcode: 0x03,
            cycles: 8,
            execute: function(cpu){
                //incrementamos en 1 el valor de BC
                cpu.registers.setBC(cpu.registers.getBC() + 1);
                cpu.registers.pc += 1;
            }
        }
        //INC B
        //0x04
        this.instructions[0x04] = {
            name: "INC B",
            opcode: 0x04,
            cycles: 4,
            execute: function(cpu){
                //incrementamos en 1 el valor de B
                cpu.registers.b = cpu.registers.b + 1;
                //si el valor de B es igual a 0x00, se pone el bit de zero a 1
                if(cpu.registers.b == 0x00){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de B es igual a 0x00, se pone el bit de carry a 0
                if((cpu.registers.b & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                cpu.registers.pc += 1;
            }
        }
        //DEC B
        //0x05
        this.instructions[0x05] = {
            name: "DEC B",
            opcode: 0x05,
            cycles: 4,
            execute: function(cpu){
                //decrementamos en 1 el valor de B
                cpu.registers.b = cpu.registers.b - 1;
                //si el valor de B es igual a 0x00, se pone el bit de zero a 1
                if(cpu.registers.b == 0x00){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de B es igual a 0x00, se pone el bit de carry a 0
                if((cpu.registers.b & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 1
                cpu.registers.setSubtractFlag(1);
                cpu.registers.pc += 1;
            }
        }
        //LD B, n
        //0x06
        this.instructions[0x06] = {
            name: "LD B, n",
            opcode: 0x06,
            cycles: 8,
            execute: function(cpu){
                //guardamos el valor de n en B
                cpu.registers.b = cpu.rom[cpu.registers.pc + 1];
                cpu.registers.pc += 2;
            }
        }
        //RLCA
        //0x07
        this.instructions[0x07] = {
            name: "RLCA",
            opcode: 0x07,
            cycles: 4,
            execute: function(cpu){
                //comprobamos si el bit de la izquierda es 1 en la variable a
                if(cpu.registers.a > 0x7F){
                    //si es 1, ponemos el bit de carry a 1
                    cpu.registers.setCarryFlag(1);
                }
                //shifteamos el bit de la derecha a la izquierda
                cpu.registers.a = cpu.registers.a << 1;
                //si el bit de carry era 1, se pone el bit de A a 1
                if(cpu.registers.getCarryFlag() == 1){
                    cpu.registers.a = cpu.registers.a | 0x01;
                }
                //cambiamos el bit de zero a 0
                cpu.registers.setZeroFlag();
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                //cambiamos el bit de half carry a 0
                cpu.registers.setHalfCarry();
                cpu.registers.pc += 1;
            }
        }
        //LD (nn), SP
        //0x08
        this.instructions[0x08] = {
            name: "LD (nn), SP",
            opcode: 0x08,
            cycles: 20,
            execute: function(cpu){
                temp_var = cpu.rom[cpu.registers.pc + 1] | (cpu.rom[cpu.registers.pc + 2] << 8);
                cpu.registers.sp = cpu.rom[temp_var] | (cpu.rom[temp_var + 1] << 8);
                //comprobar si hay que escribirlo en el stack o en la rom
                cpu.registers.pc += 3;
            }
        }

        //JP nn
        //0xC3
        this.instructions[0xC3] = {
            name: "JP nn",
            opcode: 0xC3,
            cycles: 16,
            execute: function(cpu){
                console.log("JP nn");
                //instruccion que sirve para saltar a una direccion, en este caso a la direccion que le pasamos por parametro es de 16 bits
                cpu.registers.pc = cpu.rom[cpu.registers.pc + 1] + (cpu.rom[cpu.registers.pc + 2] << 8);
            }
        }
    }
}