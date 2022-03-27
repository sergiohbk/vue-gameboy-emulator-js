import { DISPLAY_WIDTH, DISPLAY_HEIGHT, DISPLAY_MULTIPLY } from "./variables/displayConstants";

export class Display{
    constructor(bus){
        this.bus = bus;
        this.createDisplay();
        this.tileset = new Array();
        this.bytehigh = 0;
        this.bytelow = 0;
        this.bytesTile = new Array();
        this.inicialiceGraphics();
    }
    createDisplay(){
        this.screen = document.getElementById('canvas');
        this.ctx = this.screen.getContext('2d');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.screen.style.backgroundColor = '#000';
        this.screen.style.border = '3px solid #AAA';
        this.frameBuffer = [];
        this.resetPixel();
    }

    resetPixel(){
        for (let x = 0; x < DISPLAY_HEIGHT; x++){
            this.frameBuffer.push([]);
            for (let y = 0; y < DISPLAY_WIDTH; y++){
                this.frameBuffer[x].push(0);
            }
        }
        this.ctx.clearRect(0, 0, DISPLAY_WIDTH * DISPLAY_MULTIPLY, DISPLAY_HEIGHT * DISPLAY_MULTIPLY);
    }
    inicialiceGraphics(){
        this.tilesetAssembling();
    }
    getTile(address){
        //0 - white 1 - light gray 2 - dark gray 3 - black
        //let index = address & 0xFFFE;
        this.bytesTile = this.bus.readTile(address);
        let tile = new Array();
        for (let i = 0; i < 8; i++){
            this.bytelow = this.bytesTile[i];
            this.bytehigh = this.bytesTile[i + 1];
            let pixelrow = new Array();
            for(let x = 0; x < 8; x++){
                let pixel = ((this.bytehigh >> (7 - x)) & 1) << 1 | ((this.bytelow >> (7 - x)) & 1);
                pixelrow.push(pixel);
            }
            tile.push(pixelrow);
        }
        return tile;
    }
    tilesetAssembling(){
        for(let i = 0; i < 4096; i+=16){
             this.tileset.push(this.getTile(0x8000 + i));
        }
    }
}