import { Cartridge } from "./cartridge";
import { MEMORY_SIZE } from "./variables/busConstants";

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
    }
    setRom(rom){
        this.cartridge = new Cartridge(rom);
    }
    write(address, value){
        //prueba de edicion de memoria
        if(address < 0x8000){
            console.log("esta escribiendo en rom bank 0");
            this.memory[address] = value;
            //this.cartridge.setRomData(address, value);
        }else if(address < 0xA000){
            console.log("esta escribiendo en char ram");
            this.memory[address] = value;
        }else if(address < 0xC000){
            console.log("esta escribiendo en rom bank 1");
            this.memory[address] = value;
            this.cartridge.setRomData(address, value);
        }else if(address < 0xE000){
            console.log("esta escribiendo en working ram");
            this.memory[address] = value;
        }else if(address < 0xFE00){
            console.log("reservado");
            //reservado
        }else if(address < 0xFEA0){
            console.log("esta escribiendo en oam");
            this.memory[address] = value;
        }else if(address < 0xFF00){
            console.log("reservado");
            //reservado
        }else if(address < 0xFF80){
            //no implementado
        }else if(address < 0xFFFF){
            //no implementado
        }else{
            console.error("Error: address out of range");
        }
    }
    read(address){
        if(address < 0x8000){
            console.log("esta leyendo desde rom bank 0");
            return this.memory[address];
        }else if(address < 0xA000){
            console.log("esta leyendo desde char ram");
            return this.memory[address];
        }else if(address < 0xC000){
            console.log("esta leyendo desde rom bank 1");
            return this.memory[address];
        }else if(address < 0xE000){
            console.log("esta leyendo desde working ram");
            return this.memory[address];
        }else if(address < 0xFE00){
            console.log("reservado");
            //reservado
        }else if(address < 0xFEA0){
            console.log("esta leyendo desde oam");
            return this.memory[address];
        }else if(address < 0xFF00){
            console.log("reservado");
            //reservado
        }else if(address < 0xFF80){
            //no implementado
        }else if(address < 0xFFFF){
            //no implementado
        }else{
            console.error("Error: address out of range");
        }
    }
}