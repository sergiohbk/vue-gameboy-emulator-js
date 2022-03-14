export function aluinstructions(instruction, bus){
    //ADD HL, BC
    //0x09
    instruction[0x09] = {
        name: "ADD HL, BC",
        opcode: 0x09,
        cycles: 8,
        execute: function(cpu){
            //sumamos el valor de BC a HL
            let suma = cpu.registers.getHL() + cpu.registers.getBC();
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.getHL() & 0xFFF) > (suma & 0xFFF);
            //cambiamos el bit de carry si la suma es mayor que 0xFFFF
            cpu.registers.carry = (suma > 0xFFFF);
            cpu.registers.setHL((cpu.registers.getHL() + cpu.registers.getBC()) & 0xFFFF);
            cpu.registers.pc += 1;
        }
    }
    //ADD HL, DE
    //0x19
    instruction[0x19] = {
        name: "ADD HL, DE",
        opcode: 0x19,
        cycles: 8,
        execute: function(cpu){
            //sumamos el valor de DE a HL
            let suma = cpu.registers.getHL() + cpu.registers.getDE();
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.getHL() & 0xFFF) > (suma & 0xFFF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFFFF);
            cpu.registers.setHL((cpu.registers.getHL() + cpu.registers.getDE()) & 0xFFFF);
            cpu.registers.pc += 1;
        }
    }
    //ADD HL, HL
    //0x29
    instruction[0x29] = {
        name: "ADD HL, HL",
        opcode: 0x29,
        cycles: 8,
        execute: function(cpu){
            //sumamos el valor de HL a HL
            let suma = cpu.registers.getHL() + cpu.registers.getHL();
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.getHL() & 0xFFF) > (suma & 0xFFF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFFFF);
            cpu.registers.setHL((cpu.registers.getHL() + cpu.registers.getHL()) & 0xFFFF);
            cpu.registers.pc += 1;
        }
    }
    //ADD HL, SP
    //0x39
    instruction[0x39] = {
        name: "ADD HL, SP",
        opcode: 0x39,
        cycles: 8,
        execute: function(cpu){
            //sumamos el valor de SP a HL
            let suma = cpu.registers.getHL() + cpu.registers.getSP();
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.getHL() & 0xFFF) > (suma & 0xFFF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFFFF);
            cpu.registers.setHL((cpu.registers.getHL() + cpu.registers.getSP()) & 0xFFFF);
            cpu.registers.pc += 1;
        }
    }
    //ADD A, B
    //0x80
    instruction[0x80] = {
        name: "ADD A, B",
        opcode: 0x80,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de B a A
            let suma = cpu.registers.a + cpu.registers.b;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.b) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, C
    //0x81
    instruction[0x81] = {
        name: "ADD A, C",
        opcode: 0x81,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de C a A
            let suma = cpu.registers.a + cpu.registers.c;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.c) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, D
    //0x82
    instruction[0x82] = {
        name: "ADD A, D",
        opcode: 0x82,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de D a A
            let suma = cpu.registers.a + cpu.registers.d;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.d) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, E
    //0x83
    instruction[0x83] = {
        name: "ADD A, E",
        opcode: 0x83,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de E a A
            let suma = cpu.registers.a + cpu.registers.e;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.e) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, H
    //0x84
    instruction[0x84] = {
        name: "ADD A, H",
        opcode: 0x84,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de H a A
            let suma = cpu.registers.a + cpu.registers.h;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.h) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, L
    //0x85
    instruction[0x85] = {
        name: "ADD A, L",
        opcode: 0x85,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de L a A
            let suma = cpu.registers.a + cpu.registers.l;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.l) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, (HL)
    //0x86
    instruction[0x86] = {
        name: "ADD A, (HL)",
        opcode: 0x86,
        cycles: 8,
        execute: function(cpu){
            //sumamos el valor de la posicion HL a A
            let suma = cpu.registers.a + bus.read(cpu.registers.getHL());
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + bus.read(cpu.registers.getHL()) & 0xFF);
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADD A, A
    //0x87
    instruction[0x87] = {
        name: "ADD A, A",
        opcode: 0x87,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de A a A
            let suma = cpu.registers.a + cpu.registers.a;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            //cambiamos el bit de half carry si hay carry en la posicion 12
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) > (suma & 0xF);
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.a) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, B
    //0x88
    instruction[0x88] = {
        name: "ADC A, B",
        opcode: 0x88,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de B a A + carry
            let suma = cpu.registers.a + cpu.registers.b + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.b & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.b + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, C
    //0x89
    instruction[0x89] = {
        name: "ADC A, C",
        opcode: 0x89,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de C a A + carry
            let suma = cpu.registers.a + cpu.registers.c + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.c & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.c + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, D
    //0x8A
    instruction[0x8A] = {
        name: "ADC A, D",
        opcode: 0x8A,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de D a A + carry
            let suma = cpu.registers.a + cpu.registers.d + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.d & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.d + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, E
    //0x8B
    instruction[0x8B] = {
        name: "ADC A, E",
        opcode: 0x8B,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de E a A + carry
            let suma = cpu.registers.a + cpu.registers.e + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.e & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.e + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, H
    //0x8C
    instruction[0x8C] = {
        name: "ADC A, H",
        opcode: 0x8C,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de H a A + carry
            let suma = cpu.registers.a + cpu.registers.h + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.h & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.h + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, L
    //0x8D
    instruction[0x8D] = {
        name: "ADC A, L",
        opcode: 0x8D,
        cycles: 4,
        execute: function(cpu){
            //sumamos el valor de L a A + carry
            let suma = cpu.registers.a + cpu.registers.l + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (cpu.registers.l & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = (cpu.registers.a + cpu.registers.l + (cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
    //ADC A, (HL)
    //0x8E
    instruction[0x8E] = {
        name: "ADC A, (HL)",
        opcode: 0x8E,
        cycles: 8,
        execute: function(cpu){
            let data = bus.read(cpu.registers.getHL())
            //sumamos el valor de (HL) a A + carry
            let suma = cpu.registers.a + data + (cpu.registers.carry) ? 1 : 0;
            //cambiamos el bit de subtraction a 0
            cpu.registers.subtraction = false;
            cpu.registers.halfcarry = (cpu.registers.a & 0xF) + (data & 0xF) + ((cpu.registers.carry) ? 1 : 0) > 0xF;
            //ponemos el carry si excede los 16 bits
            cpu.registers.carry = (suma > 0xFF);
            cpu.registers.a = cpu.registers.a + data + ((cpu.registers.carry) ? 1 : 0) & 0xFF;
            cpu.registers.zero = (suma == 0);
            cpu.registers.pc += 1;
            //cambiar flags
        }
    }
}