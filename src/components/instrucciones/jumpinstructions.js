export function jumpinstructions(instruction, bus){
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
}