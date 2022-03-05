import { MEMORY_SIZE } from "./variables/busConstants";

export class Bus{
    // 16 bit address bus
    constructor(){
        this.memory = new Uint8Array(MEMORY_SIZE);

    }
    writeByte(address, value){
        this.memory[address] = value;
    }
    readByte(address){
        return this.memory[address];
    }
}