import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";
import { Cartridge } from "./cartridge";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.cardridge;
        this.current_opcode;
        this.instructions = [];
        this.pause = false;
        this.rom;
        this.bus = new Bus(this.cardridge);
        this.defineInstructions(this.bus);
        this.cpu_cycles = 0;
    }

    async cpu_execute(){
        //guarda el opcode en current opcode
        if(!this.rom)
            await this.loadRom();
        if(this.rom){
            this.current_opcode = this.rom[this.registers.pc];
            //mirar que instrucciones aumentan el program counter
            this.cpu_cycles = this.instructions[this.current_opcode].cycles;
            console.log(this.instructions[this.current_opcode].name); 
            this.instructions[this.current_opcode].execute(this);
            console.log("el opcode en la posicion " + this.registers.pc.toString(16) + " es " + this.current_opcode.toString(16));
        } 
    }
    async loadRom(){
        const rom = await fetch('./POKEMON_BLUE.GB');
        const buffer = await rom.arrayBuffer();
        const rombuffer = new Uint8Array(buffer);
        this.rom = rombuffer;
        this.cardridge = new Cartridge(rombuffer);
        //no se si habra que cargarlo en memoria
        for(let i = 0x100; i < 0x8000; i++){
            this.bus.memory[i] = rombuffer[i];
        }
    }

    async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    defineInstructions(bus){
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
        //INC BC
        //0x03
        this.instructions[0x03] = {
            name: "INC BC",
            opcode: 0x03,
            cycles: 8,
            execute: function(cpu){
                //incrementamos en 1 el valor de BC
                cpu.registers.setBC((cpu.registers.getBC() + 1) & 0xFFFF);
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
                cpu.registers.b = (cpu.registers.b + 1) & 0xFF;
                //si el valor de B es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.b == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de B es igual a 0x0, se pone el bit de carry a 0
                else if((cpu.registers.b & 0xF) == 0){
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
                //si el valor de B es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.b == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de B es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.b & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 1
                cpu.registers.setSubtractFlag(1);
                cpu.registers.pc += 1;
            }
        }
        
        //RLCA
        //0x07
        this.instructions[0x07] = {
            name: "RLCA",
            opcode: 0x07,
            cycles: 4,
            execute: function(cpu){
                //seteamos el bit de carry si es mayor a 7F, shifteamos los bits de a, ponemos a 0 las otras flags
                if(cpu.registers.a > 0x7F){
                    cpu.registers.setCarry(1);
                }
                cpu.registers.a = ((cpu.registers.a << 1) & 0xFF) | cpu.registers.a >> 7;
                cpu.registers.setZeroFlag();
                cpu.registers.setSubtractFlag();
                cpu.registers.setHalfCarry();
                cpu.registers.pc += 1;
            }
        }
        //ADD HL, BC
        //0x09
        this.instructions[0x09] = {
            name: "ADD HL, BC",
            opcode: 0x09,
            cycles: 8,
            execute: function(cpu){
                //sumamos el valor de BC a HL
                let oldHLregister = cpu.registers.getHL();
                cpu.registers.setHL(cpu.registers.getHL() + cpu.registers.getBC());
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                //cambiamos el bit de half carry si hay carry en la posicion 12
                if((cpu.registers.getHL() & 0xFFF) < (oldHLregister & 0xFFF)){
                    cpu.registers.setHalfCarry(1);
                }
                //ponemos el carry si excede los 16 bits
                if(cpu.registers.getHL() > 0xFFFF){
                    cpu.registers.setCarryFlag(1);
                }
                cpu.registers.setHL(cpu.registers.getHL() & 0xFFFF);
                cpu.registers.pc += 1;
            }
        }
        //DEC BC
        //0x0B
        this.instructions[0x0B] = {
            name: "DEC BC",
            opcode: 0x0B,
            cycles: 8,
            execute: function(cpu){
                //decrementamos en 1 el valor de BC
                cpu.registers.setBC(cpu.registers.getBC() - 1);
                cpu.registers.pc += 1;
            }
        }
        //INC C
        //0x0C
        this.instructions[0x0C] = {
            name: "INC C",
            opcode: 0x0C,
            cycles: 4,
            execute: function(cpu){
                //incrementamos en 1 el valor de C
                cpu.registers.c = cpu.registers.c + 1;
                //si el valor de C es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.c == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de C es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.c & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                cpu.registers.pc += 1;
            }
        }
        //DEC C
        //0x0D
        this.instructions[0x0D] = {
            name: "DEC C",
            opcode: 0x0D,
            cycles: 4,
            execute: function(cpu){
                //decrementamos en 1 el valor de C
                cpu.registers.c = cpu.registers.c - 1;
                //si el valor de C es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.c == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de C es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.c & 0xF) == 0x0F){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 1
                cpu.registers.setSubtractFlag(1);
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
        //INC DE
        //0x13
        this.instructions[0x13] = {
            name: "INC DE",
            opcode: 0x13,
            cycles: 8,
            execute: function(cpu){
                //incrementamos en 1 el valor de DE
                cpu.registers.setDE(cpu.registers.getDE() + 1);
                cpu.registers.pc += 1;
            }
        }
        //INC D
        //0x14
        this.instructions[0x14] = {
            name: "INC D",
            opcode: 0x14,
            cycles: 4,
            execute: function(cpu){
                //incrementamos en 1 el valor de D
                cpu.registers.d = cpu.registers.d + 1;
                //si el valor de D es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.d == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de D es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.d & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                cpu.registers.pc += 1;
            }
        }
        //DEC D
        //0x15
        this.instructions[0x15] = {
            name: "DEC D",
            opcode: 0x15,
            cycles: 4,
            execute: function(cpu){
                //decrementamos en 1 el valor de D
                cpu.registers.d = cpu.registers.d - 1;
                //si el valor de D es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.d == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de D es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.d & 0xF) == 0x0F){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 1
                cpu.registers.setSubtractFlag(1);
                cpu.registers.pc += 1;
            }
        }
        //LD D, n
        //0x16
        this.instructions[0x16] = {
            name: "LD D, n",
            opcode: 0x16,
            cycles: 8,
            execute: function(cpu){
                //guardamos el valor de la posicion PC + 1 en la variable a
                cpu.registers.d = cpu.rom[cpu.registers.pc + 1];
                cpu.registers.pc += 2;
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
        //DEC DE
        //0x1B
        this.instructions[0x1B] = {
            name: "DEC DE",
            opcode: 0x1B,
            cycles: 8,
            execute: function(cpu){
                //decrementamos en 1 el valor de DE
                cpu.registers.setDE(cpu.registers.getDE() - 1);
                cpu.registers.pc += 1;
            }
        }
        //INC E
        //0x1C
        this.instructions[0x1C] = {
            name: "INC E",
            opcode: 0x1C,
            cycles: 4,
            execute: function(cpu){
                //incrementamos en 1 el valor de E
                cpu.registers.e = cpu.registers.e + 1 & 0xFF;
                //si el valor de E es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.e == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de E es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.e & 0xF) == 0){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 0
                cpu.registers.setSubtractFlag();
                cpu.registers.pc += 1;
            }
        }
        //DEC E
        //0x1D
        this.instructions[0x1D] = {
            name: "DEC E",
            opcode: 0x1D,
            cycles: 4,
            execute: function(cpu){
                //decrementamos en 1 el valor de E
                cpu.registers.e = cpu.registers.e - 1;
                //si el valor de E es igual a 0, se pone el bit de zero a 1
                if(cpu.registers.e == 0){
                    cpu.registers.setZeroFlag(1);
                }
                //si el valor de E es igual a 0x0F, se pone el bit de halfcarry a 1
                else if((cpu.registers.e & 0xF) == 0x0F){
                    cpu.registers.setHalfCarry(1);
                }
                //cambiamos el bit de subtraction a 1
                cpu.registers.setSubtractFlag(1);
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
        
        //JP nn
        //0xC3
        this.instructions[0xC3] = {
            name: "JP nn",
            opcode: 0xC3,
            cycles: 16,
            execute: function(cpu){
                //instruccion que sirve para saltar a una direccion, en este caso a la direccion que le pasamos por parametro es de 16 bits
                cpu.registers.pc = bus.read(cpu.registers.pc + 1) | (bus.read(cpu.registers.pc + 2) << 8);
            }
        }
        //CP n
        //0xFE
        this.instructions[0xFE] = {
            name: "CP n",
            opcode: 0xFE,
            cycles: 8,
            execute: function(cpu){
                let suma = cpu.registers.a - cpu.rom[cpu.registers.pc + 1];
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