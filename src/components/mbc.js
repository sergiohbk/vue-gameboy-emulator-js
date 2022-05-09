export class MBC {
    constructor(rom, bus){
        this.cartridge = rom;
        this.bus = bus;
        this.ramBankNumber = 0;
        this.externalRam = false;
        this.romBankNumber = 1;
        this.mode = 0;
        this.zeroBankNumber = 0;
    }

    init(){
        if(!this.cartridge.MBC1) return;

        if(!this.cartridge.externalRam) return;

        this.ramBanks = new Array(this.rom.ram_size);

        for(let i = 0; i < this.cartridge.ram_size; i++){
            this.ramBanks[i] = new Uint8Array(0x2000);
            this.ramBanks[i].fill(0);
        } 

        this.setRam8kb();
    }

    save(){
        if(this.cartridge.battery)
        {
            //guardar memoria en un archivo al cerrar en A000 - BFFF
        }
    }
    load(){
        if(this.cartridge.battery)
        {
            //cargar memoria de un archivo al abrir en A000 - BFFF
        }
    }
    enablingRam(value){
        if(!this.cartridge.MBC1) return;
        if(!this.cartridge.externalRam) return;
        
        console.log("MBC1 enabling ram");
        value = value & 0x0F;
        if(value == 0xA){
            this.externalRam = true;
        }else{
            this.externalRam = false;
        }
    }

    setTheRomBankNumber(value){
        if(!this.cartridge.MBC1) return;
        
        if(value == 0)
        {
            this.romBankNumber = 1;
            return;
        }
    
        let mask = this.getMasktoRomBankNumber();

        value = value & mask;

        this.romBankNumber = value;

        if(this.mode == 1){
            if(this.cartridge.rom_size == 64){
                value = (value & 0x01) << 5;
                this.romBankNumber |= value;
            }

            if(this.cartridge.rom_size == 128){
                value = value << 5;
                this.romBankNumber |= value;
            }
        }
    }

    setZeroBankNumber(bank){
        if(this.cartridge.rom_size < 64) return;

        if(this.cartridge.rom_size == 64){
            bank = (bank & 0x01) << 5;

            this.zeroBankNumber = bank;
        }

        if(this.cartridge.rom_size == 128){
            bank = bank << 5;

            this.zeroBankNumber = bank;
        }
    }
    getMasktoRomBankNumber(){
        let mask = 0x00;
        switch(this.cartridge.rom_size){
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
        if(!this.cartridge.MBC1) return;
        if(!this.cartridge.externalRam) return;

        value = value & 0x03;

        this.ramBankNumber = value;

        this.setZeroBankNumber(this.ramBankNumber);
    }

    setModeFlag(value){
        if(!this.cartridge.MBC1) return;

        value = value & 0x01;

        this.mode = value;
    }

    ramWrite(address, value){
        if(!this.cartridge.MBC1) return;
        if(!this.cartridge.externalRam) return;

        if(this.mode == 1){
            if(this.cartridge.ram_size == 4){
                this.ramBanks[this.ramBankNumber][address - 0xA000] = value;
            }else{
                this.ramBanks[0][address - 0xA000] = value;
            }
        }else{
            this.ramBanks[this.ramBankNumber][address - 0xA000] = value;
        }
    }

    readRomBankZero(address){
        if(this.mode == 1){
            this.setZeroBankNumber(this.ramBankNumber);

            return this.cartridge.rom[this.zeroBankNumber * 0x4000 + address];
        }else{
            return this.cartridge.rom[address];
        }
    }

    ramRead(address){
        if(!this.cartridge.MBC1) return;
        if(!this.cartridge.externalRam) return;

        if(this.mode == 1){
            if(this.cartridge.ram_size == 4){
                return this.ramBanks[this.ramBankNumber][address - 0xA000];
            }else{
                return this.ramBanks[0][address - 0xA000];
            }
        }else{
            return this.ramBanks[this.ramBankNumber][address - 0xA000];
        }
    }
}
