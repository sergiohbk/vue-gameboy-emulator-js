import { setIME } from "../interrumpts";

export function otherinstructions(instruction){
    //NOP
    //0x00
    instruction[0x00] = {
        name: "NOP",
        opcode: 0x00,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.pc += 1;
        }
    };
    //RLCA
    //0x07
    instruction[0x07] = {
        name: "RLCA",
        opcode: 0x07,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.a == 0x7F);
            cpu.registers.a = (cpu.registers.a << 1) | (cpu.registers.a >> 7);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = false;
            cpu.registers.pc += 1;
        }
    };
    //RRCA
    //0x0F
    instruction[0x0F] = {
        name: "RRCA",
        opcode: 0x0F,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.a = (cpu.registers.a >> 1) | (cpu.registers.a & 1) << 7;
            cpu.registers.carry = (cpu.registers.a == 0x7F);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = false;
            cpu.registers.pc += 1;
        }
    };
    //STOP
    //0x10
    instruction[0x10] = {
        name: "STOP",
        opcode: 0x10,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.halted = true;
            cpu.registers.pc += 1;
        }
    };
    //RLA
    //0x17
    instruction[0x17] = {
        name: "RLA",
        opcode: 0x17,
        cycles: 4,
        execute: function(cpu){
            var carry = (cpu.registers.carry) ? 1 : 0;
            cpu.registers.carry = (cpu.registers.a > 0x7F);
            cpu.registers.a = ((cpu.registers.a << 1 ) & 0xFF) | carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = false;
            cpu.registers.pc += 1; 
        }
    };
    //RRA
    //0x1F
    instruction[0x1F] = {
        name: "RRA",
        opcode: 0x1F,
        cycles: 4,
        execute: function(cpu){
            var carry = (cpu.registers.carry) ? 1 : 0;
            cpu.registers.carry = (cpu.registers.a > 0x7F);
            cpu.registers.a = ((cpu.registers.a >> 1) & 0xFF) | carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = false;
            cpu.registers.pc += 1; 
        }
    };
    //DAA
    //0x27
    instruction[0x27] = {
        name: "DAA",
        opcode: 0x27,
        cycles: 4,
        execute: function(cpu){
            var a = cpu.registers.a;
            var halfcarry = cpu.registers.halfcarry;
            var carry = cpu.registers.carry;
            if(!cpu.registers.subtraction){
                if(carry || a > 0x99){
                    a += 0x60;
                    cpu.registers.carry = true;
                }
                if(halfcarry || (a & 0x0F) > 0x09){
                    a += 0x06;
                }
            }
            else{
                if(carry){
                    a -= 0x60;
                }
                if(halfcarry){
                    a -= 0x06;
                }
            }
            cpu.registers.a = a;
            cpu.registers.halfcarry = false;
            cpu.registers.zero = (cpu.registers.a == 0);
        }
    };
    //CPL
    //0x2F
    instruction[0x2F] = {
        name: "CPL",
        opcode: 0x2F,
        cycles: 4,
        execute: function(cpu){
            //invertimos los bits de A
            cpu.registers.a = ~cpu.registers.a;
            cpu.registers.halfcarry = true;
            cpu.registers.subtraction = true;
        }
    };
    //SCF
    //0x37
    instruction[0x37] = {
        name: "SCF",
        opcode: 0x37,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.carry = true;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
        }
    };
    //CCF
    //0x3F
    instruction[0x3F] = {
        name: "CCF",
        opcode: 0x3F,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.carry = !cpu.registers.carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
        }
    };
    //HALT
    //0x76
    instruction[0x76] = {
        name: "HALT",
        opcode: 0x76,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.halted = true;
            cpu.registers.pc += 1;
        }
    };
    //DI
    //0xF3
    instruction[0xF3] = {
        name: "DI",
        opcode: 0xF3,
        cycles: 4,
        execute: function(cpu){
            setIME(false);
            cpu.registers.pc += 1;
        }
    };
    //EI
    //0xFB
    instruction[0xFB] = {
        name: "EI",
        opcode: 0xFB,
        cycles: 4,
        execute: function(cpu){
            setIME(true);
            cpu.registers.pc += 1;
        }
    };
    
}