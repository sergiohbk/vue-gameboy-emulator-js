import { Display } from "./display";
import { Bus } from "./bus";
import { Registers } from "./registers";

export class CPU{
    constructor(){
        this.registers = new Registers();
        this.display =  new Display();
        this.bus = new Bus();
    }
}