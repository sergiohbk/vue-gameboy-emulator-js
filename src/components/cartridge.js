import { CARTRIDGE_TYPE, NEW_LICENSEE_CODE } from "./variables/cartridgeConstants";

export class Cartridge{
    constructor(rom){
        this.rom = rom;
        this.entry_point = new Uint8Array(0x04);
        this.N_logo = new Uint8Array(0x30);
        this.title = this.getTitle(this.rom);
        this.newLIC = this.getLicenseCode(this.rom);
        this.cartType = this.getCartridgeType(this.rom);
        this.rom_size = rom.length;
        this.rom_data_pointer;
        this.rom_header_pointer = 0x100;

        //usos de la rom
        this.MBC1 = false;
        this.MBC2 = false;
        this.MBC3 = false;
        this.MBC5 = false;
        this.MBC7 = false;
        this.externalRAM = false;
        this.battery = false;
        this.timer = false;
        this.rumble = false;

        this.getMBCType();
    }

    getLicenseCode(rom){
        let license = String.fromCharCode(rom[0x0144]);
        license += String.fromCharCode(rom[0x0145]);
        license = parseInt(license);
        let lic = NEW_LICENSEE_CODE.find(lic => license === lic.mask);
        return lic;
    }
    getCartridgeType(rom){
        let cart = CARTRIDGE_TYPE.find(cart => (rom[0x147] & 0xFF) === cart.mask);
        console.log(cart);
        return cart;
    }
    getTitle(rom){
        let title = "";
        for(let i = 0x134; i < 0x143; i++){
            if(rom[i] !== 0){
                title += String.fromCharCode(rom[i]);
            }
        }
        return title;
    }
    getManufacCode(rom){
        let code = "";
        for(let i = 0x13F; i < 0x143; i++){
            if(rom[i] !== 0){
                code += String.fromCharCode(rom[i]);
            }
        }
        console.log(code);
        return code;
    }
    getVersion(rom){
        return rom[0x014C];
    }
    getSuperGameboyFlag(rom){
        let flag;
        if(rom[0x146] === 0x00){
            flag = "juego no compatible con super gameboy";
        }
        else if(rom[0x146] === 0x03){
            flag = "juego compatible con super gameboy";
        }
        else{
            flag = "juego que tiene las funciones de super gameboy deshabilitadas";
        }
        console.log(flag);
        return flag;
    }
    getDestinationCode(rom){
        if(rom[0x014A] === 0x00){
            return "juego destinado a venderse en japon";
        }
        else if(rom[0x014A] === 0x01){
            return "juego no destinado a venderse en japon";
        }
        else{
            return "juego que no tiene un codigo de destino";
        }
    }
    getMBCType(){
        switch(this.cartType.name){
            case "ROM+MBC1":
                this.MBC1 = true;
                break;
            case "ROM+MBC1+RAM":
                this.MBC1 = true;
                this.externalRAM = true;
                break;
            case "ROM+MBC1+RAM+BATTERY":
                this.MBC1 = true;
                this.externalRAM = true;
                this.battery = true;
                break;
            case "ROM+MBC2":
                this.MBC2 = true;
                break;
            case "ROM+MBC2+BATTERY":
                this.MBC2 = true;
                this.battery = true;
                break;
            case "ROM+RAM":
                this.externalRAM = true;
                break;
            case "ROM+RAM+BATTERY":
                this.externalRAM = true;
                this.battery = true;
                break;
            case "ROM+MBC3+TIMER+BATTERY":
                this.MBC3 = true;
                this.battery = true;
                this.timer = true;
                break;
            case "ROM+MBC3+TIMER+RAM+BATTERY":
                this.MBC3 = true;
                this.battery = true;
                this.timer = true;
                this.externalRAM = true;
                break;
            case "ROM+MBC3":
                this.MBC3 = true;
                break;
            case "ROM+MBC3+RAM":
                this.MBC3 = true;
                this.externalRAM = true;
                break;
            case "ROM+MBC3+RAM+BATTERY":
                this.MBC3 = true;
                this.externalRAM = true;
                this.battery = true;
                break;
            case "ROM+MBC5":
                this.MBC5 = true;
                break;
            case "ROM+MBC5+RAM":
                this.MBC5 = true;
                this.externalRAM = true;
                break;
            case "ROM+MBC5+RAM+BATTERY":
                this.MBC5 = true;
                this.externalRAM = true;
                this.battery = true;
                break;
            case "ROM+MBC5+RUMBLE":
                this.MBC5 = true;
                this.rumble = true;
                break;
            case "ROM+MBC5+RUMBLE+RAM":
                this.MBC5 = true;
                this.rumble = true;
                this.externalRAM = true;
                break;
            case "ROM+MBC5+RUMBLE+RAM+BATTERY":
                this.MBC5 = true;
                this.rumble = true;
                this.externalRAM = true;
                this.battery = true;
                break;
            default:
                break;
        }
    }
    romHeaderChecksum(rom){
        let x = 0;
        let i = 0x0134;
        while (i <= 0x014C)
        {
            x = x - rom[i] - 1;
            i++;
        }
        i = rom[0x014D] & 0xFF;
        x = x & 0xFF;
        return i === x ? "rom header checksum correcto" : "rom header checksum incorrecto";
    }

    getRomData(address){
        return this.rom[address];
    }
    setRomData(address, value){
        this.rom[address] = value;
    }
}