export function jumpinstructions(instruction, bus){
    //JP NZ, nn
    instruction[0xC2] = {
        name: "JP NZ, nn",
        opcode: 0xC2,
        cycles: 12,
        execute: function(){
            //sin implementar
        }
    }
    //JP nn
    //0xC3
    instruction[0xC3] = {
        name: "JP nn",
        opcode: 0xC3,
        cycles: 16,
        execute: function(cpu){
            //instruccion que sirve para saltar a una direccion, en este caso a la direccion que le pasamos por parametro es de 16 bits
            cpu.registers.pc = bus.read(cpu.registers.pc + 1) | (bus.read(cpu.registers.pc + 2) << 8);
        }
    }
    //JP HL
    //0xE9
    instruction[0xE9] = {
        name: "JP HL",
        opcode: 0xE9,
        cycles: 4,
        execute: function(cpu){
            cpu.registers.pc = cpu.registers.getHL();
        }
    }
}