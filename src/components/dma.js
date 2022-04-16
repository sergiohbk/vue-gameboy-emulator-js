import { OAMend, OAMstart } from "./variables/GPUConstants";

export class DMA {
    constructor(){
        this.DMA_pointer = 0xFF46;
        this.active = false;
    }

    transfer(bus){
        if(!this.active) return 0;

        const address = bus.read(this.DMA_pointer) * 0x100;
        let counter = 0;
        for(let byte = OAMstart; byte < OAMend; byte++){
            bus.write(byte, bus.read(address + counter));
            counter++;
        }
        this.active = false;
        return 160;
    }
}