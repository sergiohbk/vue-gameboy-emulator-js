export class MBC {
    constructor(rom, bus){
        this.rom = rom;
        this.bus = bus;
        this.ramBankNumber = this.rom.ram_size;
        this.externalRam = false;
        this.romBankNumber = 0;
        this.mode = 0;
    }

    save(){
        if(this.rom.battery)
        {
            //guardar memoria en un archivo al cerrar en A000 - BFFF
        }
    }
    load(){
        if(this.rom.battery)
        {
            //cargar memoria de un archivo al abrir en A000 - BFFF
        }
    }
    enablingRam(value){
        if(!this.rom.MBC1) return;
        
        value = value & 0x0F;
        if(value == 0xA){
            this.externalRam = true;
        }else{
            this.externalRam = false;
        }
    }

    setTheRomBankNumber(value){
        if(!this.rom.MBC1) return;
        
        if(value == 0)
        {
            this.romBankNumber = 1;
            return;
        }
    
        let mask = this.getMasktoRomBankNumber();

        value = value & mask;

        this.romBankNumber = value;
    }

    getMasktoRomBankNumber(){
        let mask = 0x00;
        switch(this.rom.rom_size){
            case 2:
                mask = 0x01;
                break;
            case 4:
                mask = 0x03;
                break;
            case 8:
                mask = 0x07;
                break;
            case 16:
                mask = 0x0F;
                break;
            case 32:
                mask = 0x1F;
                break;
            case 64:
                mask = 0x1F;
                break;
            case 128:
                mask = 0x1F;
                break;
        }
        return mask;
    }

    setTheRamBankNumber(value){
        if(!this.rom.MBC1) return;

        value = value & 0x03;

        this.ramBankNumber = value;
    }

    setModeFlag(value){
        if(!this.rom.MBC1) return;

        value = value & 0x01;

        this.mode = value;
    }
}
