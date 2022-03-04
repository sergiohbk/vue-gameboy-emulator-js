import { MEMORY_SIZE } from "./variables/busConstants";

export class Bus{
    // 16 bit address bus
    constructor(){
        this.memory = new Uint16Array(MEMORY_SIZE);

    }
}