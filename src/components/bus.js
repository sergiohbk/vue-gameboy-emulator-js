import { Cartridge } from "./cartridge";
import { INTERRUPT_ENABLE_REGISTER, MEMORY_SIZE } from "./variables/busConstants";
import { DIV_pointer } from "./timers";
import { DMA } from "./dma";
import { Controller } from "./controller";
import { IF_pointer } from "./interrumpts";

export class Bus{
    // 16 bit address bus
    // contenido de la memoria
    // 0x0000 - 0x3FFF : ROM Bank 0
    // 0x4000 - 0x7FFF : ROM Bank 1 - Cambiable
    // 0x8000 - 0x97FF : Character RAM
    // 0x9800 - 0x9BFF : BG Map 1
    // 0x9C00 - 0x9FFF : BG Map 2
    // 0xA000 - 0xBFFF : Cartridge RAM
    // 0xC000 - 0xCFFF : RAM Bank 0
    // 0xD000 - 0xDFFF : RAM Bank 1-7 - Cambiable - Solo Gameboy Color
    // 0xE000 - 0xFDFF : Prohibido - Echo RAM
    // 0xFE00 - 0xFE9F : OAM memory
    // 0xFEA0 - 0xFEFF : No usable
    // 0xFF00 - 0xFF7F : I/O Registros
    // 0xFF80 - 0xFFFE : Zero Page
    constructor(){
        this.memory = new Uint8Array(MEMORY_SIZE);
        this.bootrom = new Uint8Array(0x100);
        this.dma = new DMA(this);
        this.controller = new Controller(this);
        for(let i = 0x100; i < 0x8000; i++){
            this.memory[i] = 0xFF;
        }
    }
    
    setRom(rom){
        this.cartridge = new Cartridge(rom);
    }
    write(address, value){
        if(address == DIV_pointer || address == IF_pointer){
            this.memory[address] = 0;
            return;
        }
        if(address == 0xff00){
            this.controller.write(value);
            return;
        }
        if(address == this.dma.DMA_pointer){
            this.dma.active = true;
        }
        if(address == INTERRUPT_ENABLE_REGISTER){
            this.memory[address] = value;
            return;
        }
        if(address < 0x10000 && address >= 0x8000){
            this.memory[address] = value;
            return;
        }
        if(address > 0x10000){
            throw new Error("No se puede escribir en la direccion: " + address);
        }
    }
    read(address){
        if(address == 0xff00){
            this.memory[address] = this.controller.read();
            return this.memory[address];
        }
        if(address < 0x10000){
            return this.memory[address];
        }else{
            throw new Error("Error: address out of range " + address);
        }
    }
    readTile(address){
        if(address >= 0x8000 && address < 0x9FFF){
            let returntile = [];
            for(let i = 0; i < 16; i++){
                //sacamos las 16 tiras de 8 bits, 8x8pixels
                returntile.push(this.memory[address + i]);
            }
            return returntile;
        }else{
            throw new Error("Error: address fuera de rango " + address);
        }
    }
}