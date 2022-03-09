export class Registers{
    constructor(){
        this.a = 0x00;
        this.b = 0x00;
        this.c = 0x00;
        this.d = 0x00;
        this.e = 0x00;
        this.h = 0x00;
        this.l = 0x00;
        this.f = 0x00; //este registro es una flag, los 4 bits menos significativos no se usan
        //el bit 7 es el flag de zero
        //el bit 6 es el flag de subtraction
        //el bit 5 es el flag de half carry
        //el bit 4 es el flag de carry

        this.sp = 0xFFFE; //stack pointer
        this.pc = 0x0100; // hay que ver cuantos bytes tiene

        //port registers
        this.p1 = 0;
        this.sc = 0;
        this.tima = 0;
        this.tac = 0;
        this.ie = 0;
        this.lcdc = 0x83;
        this.scy = 0;
        this.scx = 0;
        this.wy = 0;
        this.w = 0;
        this.lyc = 0;
    }

    //la cpu es capaz de escribir y leer 16 bits aunque sus registros son de 8 bits
    //asi que guardamos los 16 bits en una combinacion de registros
    getBC(){
        return ((this.b << 8) | this.c); //retornamos los registros como una variable de 16 bits
    }
    setBC(value){
        this.b = (value >> 8); //guardamos los 8 bits mas significativos
        this.c = (value & 0x00FF); //guardamos los 8 bits menos significativos
    }
    getAF(){
        return ((this.a << 8) | this.f); //retornamos los registros como una variable de 16 bits
    }
    setAF(value){
        this.a = (value >> 8); //guardamos los 8 bits mas significativos
        this.f = (value & 0x00FF); //cambiar la escritura a solo flags
    }
    getDE(){
        return ((this.d << 8) | this.e); //retornamos los registros como una variable de 16 bits
    }
    setDE(value){
        this.d = (value >> 8); //guardamos los 8 bits mas significativos
        this.e = (value & 0x00FF); //guardamos los 8 bits menos significativos
    }
    getHL(){
        return ((this.h << 8) | this.l); //retornamos los registros como una variable de 16 bits
    }
    setHL(value){
        this.h = (value >> 8); //guardamos los 8 bits mas significativos
        this.l = (value & 0x00FF); //guardamos los 8 bits menos significativos
    }
    getCarryFlag(){
        return (this.f & 0x10) >> 4; //retornamos el bit 4
    }
    getHalfCarryFlag(){
        return (this.f & 0x20) >> 5; //retornamos el bit 5
    }
    getSubtractionFlag(){
        return (this.f & 0x40) >> 6; //retornamos el bit 6
    }
    getZeroFlag(){
        return (this.f & 0x80) >> 7; //retornamos el bit 7
    }
    setCarryFlag(value){
        if(value){
            this.f |= 0x10; //seteamos el bit 4
        }else{
            this.f &= 0xEF; //borramos el bit 4
        }
    }
    setHalfCarryFlag(value){
        if(value){
            this.f |= 0x20; //seteamos el bit 5
        }else{
            this.f &= 0xDF; //borramos el bit 5
        }
    }
    setSubtractionFlag(value){
        if(value){
            this.f |= 0x40; //seteamos el bit 6
        }else{
            this.f &= 0xBF; //borramos el bit 6
        }
    }
    setZeroFlag(value){
        if(value){
            this.f |= 0x80; //seteamos el bit 7
        }else{
            this.f &= 0x7F; //borramos el bit 7
        }
    }
}