export function stackinstructions(instruction, bus){
    //PUSH BC
    //0xC5
    instruction[0xC5] = {
        name: "PUSH BC",
        opcode: 0xC5,
        cycles: 16,
        execute: function(cpu){
            cpu.registers.stackPush16(cpu.registers.getBC(), bus);
            cpu.registers.pc += 1;
        }
    },
    //PUSH DE
    //0xD5
    instruction[0xD5] = {
        name: "PUSH DE",
        opcode: 0xD5,
        cycles: 16,
        execute: function(cpu){
            cpu.registers.stackPush16(cpu.registers.getDE(), bus);
            cpu.registers.pc += 1;
        }
    },
    //PUSH HL
    //0xE5
    instruction[0xE5] = {
        name: "PUSH HL",
        opcode: 0xE5,
        cycles: 16,
        execute: function(cpu){
            cpu.registers.stackPush16(cpu.registers.getHL(), bus);
            cpu.registers.pc += 1;
        }
    }
    //PUSH AF
    //0xF5
    instruction[0xF5] = {
        name: "PUSH AF",
        opcode: 0xF5,
        cycles: 16,
        execute: function(cpu){
            cpu.registers.stackPush16(cpu.registers.getAF(), bus);
            cpu.registers.pc += 1;
        }
    }
    //POP BC
    //0xC1
    instruction[0xC1] = {
        name: "POP BC",
        opcode: 0xC1,
        cycles: 12,
        execute: function(cpu){
            cpu.registers.setBC(cpu.registers.stackPop16(bus));
            cpu.registers.pc += 1;
        }
    }
    //POP DE
    //0xD1
    instruction[0xD1] = {
        name: "POP DE",
        opcode: 0xD1,
        cycles: 12,
        execute: function(cpu){
            cpu.registers.setDE(cpu.registers.stackPop16(bus));
            cpu.registers.pc += 1;
        }
    }
    //POP HL
    //0xE1
    instruction[0xE1] = {
        name: "POP HL",
        opcode: 0xE1,
        cycles: 12,
        execute: function(cpu){
            cpu.registers.setHL(cpu.registers.stackPop16(bus));
            cpu.registers.pc += 1;
        }
    }
    //POP AF
    //0xF1
    instruction[0xF1] = {
        name: "POP AF",
        opcode: 0xF1,
        cycles: 12,
        execute: function(cpu){
            cpu.registers.setAF(cpu.registers.stackPop16(bus));
            cpu.registers.pc += 1;
        }
    }
    //CALL NZ,nn
    //0xC4
    instruction[0xC4] = {
        name: "CALL NZ,nn",
        opcode: 0xC4,
        cycles: 24,
        execute: function(cpu){
            if(!cpu.registers.zero)
            {   
                let address = bus.read(cpu.registers.pc + 2) << 8 | (bus.read(cpu.registers.pc + 1));
                cpu.registers.stackPush16(cpu.registers.pc + 3, bus);
                cpu.registers.pc = address;
                cpu.ticks += 12;
            }else{
                cpu.registers.pc += 3;
            }
        }
    }
    //CALL NC,nn
    //0xD4
    instruction[0xD4] = {
        name: "CALL NC,nn",
        opcode: 0xD4,
        cycles: 24,
        execute: function(cpu){
            if(!cpu.registers.carry)
            {   
                let address = bus.read(cpu.registers.pc + 2) << 8 | (bus.read(cpu.registers.pc + 1));
                cpu.registers.stackPush16(cpu.registers.pc + 3, bus);
                cpu.registers.pc = address;
                cpu.ticks += 12;
            }else{
                cpu.registers.pc += 3;
            }
        }
    }
    //CALL Z,nn
    //0xCC
    instruction[0xCC] = {
        name: "CALL Z,nn",
        opcode: 0xCC,
        cycles: 24,
        execute: function(cpu){
            if(cpu.registers.zero)
            {   
                let address = bus.read(cpu.registers.pc + 2) << 8 | (bus.read(cpu.registers.pc + 1));
                cpu.registers.stackPush16(cpu.registers.pc + 3, bus);
                cpu.registers.pc = address;
                cpu.ticks += 12;
            }else{
                cpu.registers.pc += 3;
            }
        }
    }
    //CALL C,nn
    //0xDC
    instruction[0xDC] = {
        name: "CALL C,nn",
        opcode: 0xDC,
        cycles: 24,
        execute: function(cpu){
            if(cpu.registers.carry)
            {   
                let address = bus.read(cpu.registers.pc + 2) << 8 | (bus.read(cpu.registers.pc + 1));
                cpu.registers.stackPush16(cpu.registers.pc + 3, bus);
                cpu.registers.pc = address;
                cpu.ticks += 12;
            }else{
                cpu.registers.pc += 3;
            }
        }
    }
    //CALL nn
    //0xCD
    instruction[0xCD] = {
        name: "CALL nn",
        opcode: 0xCD,
        cycles: 24,
        execute: function(cpu){
            let address = bus.read(cpu.registers.pc + 2) << 8 | (bus.read(cpu.registers.pc + 1));
            cpu.registers.stackPush16(cpu.registers.pc + 3, bus);
            cpu.registers.pc = address;
            cpu.ticks += 12;
        }
    }
}