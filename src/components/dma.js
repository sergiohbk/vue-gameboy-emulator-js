import { OAMstart } from "./variables/GPUConstants";

export class DMA {
    constructor(bus){
        this.DMA_pointer = 0xFF46;
        this.active = false;
        this.counter = 0;
        this.bus = bus;
        this.address = 0;
        this.isTransferring = false;
    }

    transfer(){
        if(!this.active) return;
        this.isTransferring = true;
        let address = this.bus.read(this.DMA_pointer);
        address = address << 8;
        for(let a = 0 ; a < 0xA0; a++){
            this.bus.memory[OAMstart + a] = this.bus.memory[address + a];
        }
        this.active = false;
    }
}