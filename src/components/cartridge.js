import { CARTRIDGE_TYPE, NEW_LICENSEE_CODE } from "./variables/cartridgeConstants";

export class Cartridge{
    constructor(rom){
        this.entry_point = new Uint8Array(0x04);
        this.N_logo = new Uint8Array(0x30);
        this.title = this.getTitle(rom);
        this.newLIC;
        this.cartType = this.getCartridgeType(rom);
        this.rom_size = rom.length;
        this.rom_data_pointer;
        this.rom_header_pointer = 0x100;
    }

    getLicenseCode(){
        let lic = NEW_LICENSEE_CODE.find(lic => this.newLIC === lic.mask);
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
        console.log(title);
        return title;
    }
}