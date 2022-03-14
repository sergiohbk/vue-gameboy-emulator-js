export class Registers{
    constructor(){
        this.a = 0x00;
        this.b = 0x00;
        this.c = 0x00;
        this.d = 0x00;
        this.e = 0x00;
        this.h = 0x00;
        this.l = 0x00;
        //el bit 7 es el flag de zero
        //el bit 6 es el flag de subtraction
        //el bit 5 es el flag de half carry
        //el bit 4 es el flag de carry
        this.zero = false;
        this.subtraction = false;
        this.halfcarry = false;
        this.carry = false;

        this.sp = 0x0000; //stack pointer
        this.pc = 0x0000; // hay que ver cuantos bytes tiene
        this.setInitialValues();
        //port registers
        this.p1 = 0;
        this.sc = 0;
        this.tima = 0;
        this.tac = 0;
        this.ie = 0;
        this.lcdc = 0x00;
        this.scy = 0;
        this.scx = 0;
        this.wy = 0;
        this.w = 0;
        this.lyc = 0;
    }
    
    setInitialValues(){
        //la gameboy inicializa valores de los registros en el bootstrap, de momento los añado aqui
        this.a = 0x01;
        this.b = 0x00;
        this.c = 0x13;
        this.d = 0x00;
        this.e = 0xD8;
        this.h = 0x01;
        this.l = 0x4D;
        this.sp = 0xFFFE;
        this.pc = 0x0100;
        this.carry = true;
        this.zero = true;
        this.subtraction = false;
        this.halfcarry = true;
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
}