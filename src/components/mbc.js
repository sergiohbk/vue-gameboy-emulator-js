export class MBC {
    constructor(rom, bus){
        this.rom = rom;
        this.bus = bus;
        this.ramBankNumber = 0;
        this.externalRam = false;
        this.romBankNumber = 1;
        this.mode = 0;
        this.ramBanks = new Array(this.rom.ram_size);
        this.zeroBankNumber = 0;
        this.highRambank = 0;
    }

    init(){
        if(!this.rom.MBC1) return;

        if(!this.rom.externalRam) return;

        for(let i = 0; i < this.rom.ram_size; i++){
            this.ramBanks[i] = new Uint8Array(0x2000);
            this.ramBanks[i].fill(0);
        } 

        this.setRam8kb();
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
        if(!this.rom.externalRam) return;
        
        console.log("MBC1 enabling ram");
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
        //console.log("MBC1 rom bank number: " + this.romBankNumber);
        this.setRom16kb();
    }

    setRom16kb(){
        for(let i = 0x4000; i < 0x8000; i++){
            this.bus.memory[i] = this.rom.rom[this.romBankNumber * 0x4000 + (i - 0x4000)];
        }
    }
    setRam8kb(){
        for(let i = 0xA000; i < 0xC000; i++){
            this.bus.memory[i] = this.ramBanks[this.ramBankNumber][i - 0xA000];
        }
    }

    setZeroBankNumber(bank){
        if(this.rom.rom_size < 64) return;

        if(this.rom.rom_size == 64){
            bank = (bank & 0x01) << 5;

            this.zeroBankNumber = bank;
        }

        if(this.rom.rom_size == 128){
            bank = bank << 5;

            this.zeroBankNumber = bank;
        }
    }

    setHighRamBank(value){
        if(this.rom.rom_size < 64) return;

        if(this.rom.rom_size == 64){
            value = (value & 0x01) << 5;
            this.highRambank = value;
        }
        if(this.rom.rom_size == 128){
            value = value << 5;
            this.highRambank = value;
        }
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

        this.saveRam(this.ramBankNumber);

        this.ramBankNumber = value;

        console.log("MBC1 ram bank number: " + this.ramBankNumber);
        this.setRam8kb();
    }

    saveRam(ramBank){
        if(!this.rom.externalRam) return;

        for(let i = 0xA000; i < 0xC000; i++){
            this.ramBanks[ramBank][i - 0xA000] = this.bus.memory[i];
        }
    }

    setModeFlag(value){
        if(!this.rom.MBC1) return;

        value = value & 0x01;

        if(value == 1) throw new Error("MBC1 mode 1 not supported");

        this.mode = value;
    }
}
