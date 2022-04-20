import { OAMend, OAMstart } from "./variables/GPUConstants";

export class DMA {
    constructor(bus){
        this.DMA_pointer = 0xFF46;
        this.active = false;
        this.bus = bus;
    }

    transfer(){
        if(!this.active) return 0;
        let address = this.bus.read(this.DMA_pointer);
        address = address << 8;
        let counter = 0;
        for(let byte = OAMstart; byte < OAMend; byte++){
            this.bus.write(byte, this.bus.read(address + counter));
            counter++;
        }
        this.active = false;
        return 160;
    }
}