import { Cartridge } from "./cartridge";
import { setRunning } from "./variables/globalConstants";
import { MEMORY_SIZE } from "./variables/busConstants";
import { DIV_pointer } from "./timers";

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
    }
    
    setRom(rom){
        this.cartridge = new Cartridge(rom);
    }
    write(address, value){
        if(address == DIV_pointer){
            this.memory[address] = 0;
        }
        if(address < 0x10000){
            this.memory[address] = value;
        }else{
            console.error("Error: address out of range");
            setRunning(false);
        }
    }
    read(address){
        if(address < 0x10000){
            return this.memory[address];
        }else{
            console.error("Error: address out of range");
            setRunning(false);
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
    writeTile(){

    }
}