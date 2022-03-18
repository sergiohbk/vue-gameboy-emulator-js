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
        execute: function(){
            //sin implementar
        }
    };
    //RRCA
    //0x0F
    instruction[0x0F] = {
        name: "RRCA",
        opcode: 0x0F,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //STOP
    //0x10
    instruction[0x10] = {
        name: "STOP",
        opcode: 0x10,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //RLA
    //0x17
    instruction[0x17] = {
        name: "RLA",
        opcode: 0x17,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //RRA
    //0x1F
    instruction[0x1F] = {
        name: "RRA",
        opcode: 0x1F,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //DAA
    //0x27
    instruction[0x27] = {
        name: "DAA",
        opcode: 0x27,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //CPL
    //0x2F
    instruction[0x2F] = {
        name: "CPL",
        opcode: 0x2F,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //SCF
    //0x37
    instruction[0x37] = {
        name: "SCF",
        opcode: 0x37,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //CCF
    //0x3F
    instruction[0x3F] = {
        name: "CCF",
        opcode: 0x3F,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //HALT
    //0x76
    instruction[0x76] = {
        name: "HALT",
        opcode: 0x76,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //DI
    //0xF3
    instruction[0xF3] = {
        name: "DI",
        opcode: 0xF3,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
    //EI
    //0xFB
    instruction[0xFB] = {
        name: "EI",
        opcode: 0xFB,
        cycles: 4,
        execute: function(){
            //sin implementar
        }
    };
}