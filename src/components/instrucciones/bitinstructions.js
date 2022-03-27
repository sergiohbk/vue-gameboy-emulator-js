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
            if(cbinstructions[opcode] == undefined){
                throw new Error("Instruccion no implementada: " + opcode.toString(16) + " en " + cpu.registers.pc.toString(16));
            }
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
            cpu.registers.b = ((cpu.registers.b << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
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
            cpu.registers.c = ((cpu.registers.c << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
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
            cpu.registers.d = ((cpu.registers.d << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
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
            cpu.registers.e = ((cpu.registers.e << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
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
            cpu.registers.h = ((cpu.registers.h << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
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
            cpu.registers.l = ((cpu.registers.l << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //RLC (HL)
    //0x06
    cbinstructions[0x06] = {
        name: "RLC (HL)",
        opcode: 0x06,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            cpu.registers.carry = (value > 0x7F);
            value = ((value << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //RLC A
    //0x07
    cbinstructions[0x07] = {
        name: "RLC A",
        opcode: 0x07,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.a > 0x7F);
            cpu.registers.a = ((cpu.registers.a << 1) & 0xFF) | ((cpu.registers.carry) ? 1 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC B
    //0x08
    cbinstructions[0x08] = {
        name: "RRC B",
        opcode: 0x08,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.b & 0x01) == 1;
            cpu.registers.b = ((cpu.registers.b >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC C
    //0x09
    cbinstructions[0x09] = {
        name: "RRC C",
        opcode: 0x09,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.c & 0x01) == 1;
            cpu.registers.c = ((cpu.registers.c >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC D
    //0x0A
    cbinstructions[0x0A] = {
        name: "RRC D",
        opcode: 0x0A,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.d & 0x01) == 1;
            cpu.registers.d = ((cpu.registers.d >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC E
    //0x0B
    cbinstructions[0x0B] = {
        name: "RRC E",
        opcode: 0x0B,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.e & 0x01) == 1;
            cpu.registers.e = ((cpu.registers.e >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC H
    //0x0C
    cbinstructions[0x0C] = {
        name: "RRC H",
        opcode: 0x0C,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.h & 0x01) == 1;
            cpu.registers.h = ((cpu.registers.h >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC L
    //0x0D
    cbinstructions[0x0D] = {
        name: "RRC L",
        opcode: 0x0D,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.l & 0x01) == 1;
            cpu.registers.l = ((cpu.registers.l >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //RRC (HL)
    //0x0E
    cbinstructions[0x0E] = {
        name: "RRC (HL)",
        opcode: 0x0E,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            cpu.registers.carry = (value & 0x01) == 1;
            value = ((value >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //RRC A
    //0x0F
    cbinstructions[0x0F] = {
        name: "RRC A",
        opcode: 0x0F,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.a & 0x01) == 1;
            cpu.registers.a = ((cpu.registers.a >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR C
    //0x19
    cbinstructions[0x19] = {
        name: "RR C",
        opcode: 0x19,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.c & 0x01) == 0x01;
            cpu.registers.c = ((cpu.registers.c >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR D
    //0x1A
    cbinstructions[0x1A] = {
        name: "RR D",
        opcode: 0x1A,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.d & 0x01) == 0x01;
            cpu.registers.d = ((cpu.registers.d >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR E
    //0x1B
    cbinstructions[0x1B] = {
        name: "RR E",
        opcode: 0x1B,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.e & 0x01) == 0x01;
            cpu.registers.e = ((cpu.registers.e >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR H
    //0x1C
    cbinstructions[0x1C] = {
        name: "RR H",
        opcode: 0x1C,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.h & 0x01) == 0x01;
            cpu.registers.h = ((cpu.registers.h >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR L
    //0x1D
    cbinstructions[0x1D] = {
        name: "RR L",
        opcode: 0x1D,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.l & 0x01) == 0x01;
            cpu.registers.l = ((cpu.registers.l >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //RR (HL)
    //0x1E
    cbinstructions[0x1E] = {
        name: "RR (HL)",
        opcode: 0x1E,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            var carry = (value & 0x01) == 0x01;
            value = ((value >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //RR A
    //0x1F
    cbinstructions[0x1F] = {
        name: "RR A",
        opcode: 0x1F,
        cycles: 8,
        execute: function(cpu){
            var carry = (cpu.registers.a & 0x01) == 0x01;
            cpu.registers.a = ((cpu.registers.a >> 1) & 0xFF) | ((cpu.registers.carry) ? 0x80 : 0);
            cpu.registers.carry = carry;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA B
    //0x20
    cbinstructions[0x20] = {
        name: "SLA B",
        opcode: 0x20,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.b > 0x7F);
            cpu.registers.b = (cpu.registers.b << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA C
    //0x21
    cbinstructions[0x21] = {
        name: "SLA C",
        opcode: 0x21,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.c > 0x7F);
            cpu.registers.c = (cpu.registers.c << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA D
    //0x22
    cbinstructions[0x22] = {
        name: "SLA D",
        opcode: 0x22,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.d > 0x7F);
            cpu.registers.d = (cpu.registers.d << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA E
    //0x23
    cbinstructions[0x23] = {
        name: "SLA E",
        opcode: 0x23,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.e > 0x7F);
            cpu.registers.e = (cpu.registers.e << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA H
    //0x24
    cbinstructions[0x24] = {
        name: "SLA H",
        opcode: 0x24,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.h > 0x7F);
            cpu.registers.h = (cpu.registers.h << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA L
    //0x25
    cbinstructions[0x25] = {
        name: "SLA L",
        opcode: 0x25,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.l > 0x7F);
            cpu.registers.l = (cpu.registers.l << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //SLA (HL)
    //0x26
    cbinstructions[0x26] = {
        name: "SLA (HL)",
        opcode: 0x26,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            cpu.registers.carry = (value > 0x7F);
            value = (value << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //SLA A
    //0x27
    cbinstructions[0x27] = {
        name: "SLA A",
        opcode: 0x27,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.a > 0x7F);
            cpu.registers.a = (cpu.registers.a << 1) & 0xFF;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA B
    //0x28
    cbinstructions[0x28] = {
        name: "SRA B",
        opcode: 0x28,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.b & 0x01) == 0x01;
            cpu.registers.b = (cpu.registers.b >> 1) | (cpu.registers.b & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA C
    //0x29
    cbinstructions[0x29] = {
        name: "SRA C",
        opcode: 0x29,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.c & 0x01) == 0x01;
            cpu.registers.c = (cpu.registers.c >> 1) | (cpu.registers.c & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA D
    //0x2A
    cbinstructions[0x2A] = {
        name: "SRA D",
        opcode: 0x2A,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.d & 0x01) == 0x01;
            cpu.registers.d = (cpu.registers.d >> 1) | (cpu.registers.d & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA E
    //0x2B
    cbinstructions[0x2B] = {
        name: "SRA E",
        opcode: 0x2B,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.e & 0x01) == 0x01;
            cpu.registers.e = (cpu.registers.e >> 1) | (cpu.registers.e & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA H
    //0x2C
    cbinstructions[0x2C] = {
        name: "SRA H",
        opcode: 0x2C,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.h & 0x01) == 0x01;
            cpu.registers.h = (cpu.registers.h >> 1) | (cpu.registers.h & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA L
    //0x2D
    cbinstructions[0x2D] = {
        name: "SRA L",
        opcode: 0x2D,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.l & 0x01) == 0x01;
            cpu.registers.l = (cpu.registers.l >> 1) | (cpu.registers.l & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRA (HL)
    //0x2E
    cbinstructions[0x2E] = {
        name: "SRA (HL)",
        opcode: 0x2E,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            cpu.registers.carry = (value & 0x01) == 0x01;
            value = (value >> 1) | (value & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //SRA A
    //0x2F
    cbinstructions[0x2F] = {
        name: "SRA A",
        opcode: 0x2F,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.a & 0x01) == 0x01;
            cpu.registers.a = (cpu.registers.a >> 1) | (cpu.registers.a & 0x80);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP B
    //0x30
    cbinstructions[0x30] = {
        name: "SWAP B",
        opcode: 0x30,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.b = ((cpu.registers.b & 0xF) << 4)  | (cpu.registers.b >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP C
    //0x31
    cbinstructions[0x31] = {
        name: "SWAP C",
        opcode: 0x31,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.c = ((cpu.registers.c & 0xF) << 4)  | (cpu.registers.c >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.c == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP D
    //0x32
    cbinstructions[0x32] = {
        name: "SWAP D",
        opcode: 0x32,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.d = ((cpu.registers.d & 0xF) << 4)  | (cpu.registers.d >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.d == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP E
    //0x33
    cbinstructions[0x33] = {
        name: "SWAP E",
        opcode: 0x33,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.e = ((cpu.registers.e & 0xF) << 4)  | (cpu.registers.e >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.e == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP H
    //0x34
    cbinstructions[0x34] = {
        name: "SWAP H",
        opcode: 0x34,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.h = ((cpu.registers.h & 0xF) << 4)  | (cpu.registers.h >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.h == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP L
    //0x35
    cbinstructions[0x35] = {
        name: "SWAP L",
        opcode: 0x35,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.l = ((cpu.registers.l & 0xF) << 4)  | (cpu.registers.l >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.l == 0);
            cpu.registers.pc += 1;
        }
    }
    //SWAP (HL)
    //0x36
    cbinstructions[0x36] = {
        name: "SWAP (HL)",
        opcode: 0x36,
        cycles: 16,
        execute: function(cpu){
            var value = bus.read(cpu.registers.getHL());
            value = ((value & 0xF) << 4)  | (value >> 4);
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (value == 0);
            bus.write(cpu.registers.getHL(), value);
            cpu.registers.pc += 1;
        }
    }
    //SWAP A
    //0x37
    cbinstructions[0x37] = {
        name: "SWAP A",
        opcode: 0x37,
        cycles: 8,
        execute: function(cpu){
            //movemos los 4 primeros bits a los 4 ultimos y viceversa
            cpu.registers.a = ((cpu.registers.a & 0xF) << 4) | ((cpu.registers.a) >> 4);
            cpu.registers.carry = false;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.a == 0);
            cpu.registers.pc += 1;
        }
    }
    //SRL B
    //0x38
    cbinstructions[0x38] = {
        name: "SRL B",
        opcode: 0x38,
        cycles: 8,
        execute: function(cpu){
            cpu.registers.carry = (cpu.registers.b & 0x01) == 0x01;
            cpu.registers.b >>= 1;
            cpu.registers.halfcarry = false;
            cpu.registers.subtraction = false;
            cpu.registers.zero = (cpu.registers.b == 0);
            cpu.registers.pc += 1;
        }
    }
}