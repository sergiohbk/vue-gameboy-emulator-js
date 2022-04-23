import { OAMstart } from "./variables/GPUConstants";

export class DMA {
    constructor(bus){
        this.DMA_pointer = 0xFF46;
        this.active = false;
        this.counter = 0;
        this.bus = bus;
        this.address = 0;
        this.delay = 0;
    }

    activating(addr){
        this.active = true;
        this.counter = 0;
        this.delay = 2;
        this.address = addr << 8;
    }

    tick(){
        if(!this.active) return 0;

        if(this.delay > 0){
            this.delay--;
            return 0;
        }

        this.bus.write(OAMstart + this.counter, this.bus.read(this.address + this.counter));

        this.active = this.counter < 0xA0;

        return 4;
    }

    /*transfer(){
        if(!this.active) return 0;
        let address = this.bus.read(this.DMA_pointer);
        address = address << 8;
        for(let a = 0 ; a < 0xA0; a++){
            this.bus.write(OAMstart + a, this.bus.read(address + a));
        }
        this.active = false;
        return 160;
    }*/
}