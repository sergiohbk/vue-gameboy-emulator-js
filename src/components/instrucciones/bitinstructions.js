export function bitinstuctions(instruction, bus, cbinstructions){
    //PREFIX CB
    //0xCB
    instruction[0xCB] = {
        name: "PREFIX CB",
        opcode: 0xCB,
        cycles: 0,
        execute: function(cpu){
            cpu.registers.pc += 1;
            var opcode = bus.read(cpu.registers.pc);
            cbinstructions[opcode].execute(cpu);
        }
    };
    //RLC B
    //0x00
    cbinstructions[0x00] = {
        name: "RLC B",
        opcode: 0x00,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.b > 0x7F);
            cpu.registers.b = (cpu.registers.b << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC C
    //0x01
    cbinstructions[0x01] = {
        name: "RLC C",
        opcode: 0x01,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.c > 0x7F);
            cpu.registers.c = (cpu.registers.c << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC D
    //0x02
    cbinstructions[0x02] = {
        name: "RLC D",
        opcode: 0x02,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.d > 0x7F);
            cpu.registers.d = (cpu.registers.d << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC E
    //0x03
    cbinstructions[0x03] = {
        name: "RLC E",
        opcode: 0x03,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.e > 0x7F);
            cpu.registers.e = (cpu.registers.e << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC H
    //0x04
    cbinstructions[0x04] = {
        name: "RLC H",
        opcode: 0x04,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.h > 0x7F);
            cpu.registers.h = (cpu.registers.h << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC L
    //0x05
    cbinstructions[0x05] = {
        name: "RLC L",
        opcode: 0x05,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.l > 0x7F);
            cpu.registers.l = (cpu.registers.l << 1) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
}