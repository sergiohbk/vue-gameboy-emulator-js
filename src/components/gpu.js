import { DISPLAY_WIDTH, DISPLAY_HEIGHT, DISPLAY_MULTIPLY, DISPLAY_DEBUG_TILES_WIDTH, DISPLAY_DEBUG_TILES_HEIGHT } from "./variables/displayConstants";

export class GPU{
    //(OAM - Object Attribute Memory) at $FE00-FE9F
    //(VRAM - Video RAM TILE DATA) at $8000-97FF
    //(VRAM - Video RAM MAP DATA) at $9800-9BFF
    //(VRAM - Video RAM ATTRIBUTE DATA) at $9C00-9FFF
    constructor(bus){
        this.bus = bus;
        this.createDisplay();
        this.tileset = new Array();
        this.bytehigh = 0;
        this.bytelow = 0;
        this.x = 0;
        this.y = 0;
        this.tile = 0;
        this.flags = 0;
        this.LCDC = 0;
        this.bytesTile = new Array();
        this.inicialiceGraphics();
        this.backgroundloading = false;
    }
    createDisplay(){
        this.screen = document.getElementById('canvas');
        this.debugscreen = document.getElementById('debug');
        this.ctx = this.screen.getContext('2d');
        this.debugcontext = this.debugscreen.getContext('2d');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.debugscreen.width = DISPLAY_DEBUG_TILES_WIDTH;
        this.debugscreen.height = DISPLAY_DEBUG_TILES_HEIGHT;
        this.screen.style.backgroundColor = '#FFF';
        this.screen.style.border = '1px solid #000';
        this.screen.style.display = 'block';
        this.screen.style.boxShadow = '0px 0px 20px #222';
        this.debugscreen.style.backgroundColor = '#FFF';
        this.debugscreen.style.border = '2px solid #000';
        this.debugscreen.style.display = 'block';
        this.debugscreen.style.boxShadow = '0px 0px 20px #222';
        this.frameBuffer = [];
        this.debugTilesFrameBuffer = [];
        this.resetPixel();
        this.resetDebugPixels();
    }

    tick(){
        this.LCDC = this.bus.read(0xFF40);
        if((this.LCDC & 0x80) == 0x80){
            console.log(this.LCDC);
            this.tilesetAssembling(this.LCDC);
            this.tileSetToDebugTiles(this.tileset)
            this.drawDebugTiles();
        }  
    }

    resetPixel(){
        for (let y = 0; y < DISPLAY_HEIGHT; y++){
            this.frameBuffer.push([]);
            for (let x = 0; x < DISPLAY_WIDTH; x++){
                this.frameBuffer[y].push(0);
                
            }
        }
        this.ctx.clearRect(0, 0, DISPLAY_WIDTH * DISPLAY_MULTIPLY, DISPLAY_HEIGHT * DISPLAY_MULTIPLY);
    }
    resetDebugPixels(){
        for (let y = 0; y < DISPLAY_DEBUG_TILES_HEIGHT; y++){
            this.debugTilesFrameBuffer.push([]);
            for (let x = 0; x < DISPLAY_DEBUG_TILES_WIDTH; x++){
                this.debugTilesFrameBuffer[y].push(0);
            }
        }
        this.debugcontext.clearRect(0, 0, DISPLAY_DEBUG_TILES_WIDTH, DISPLAY_DEBUG_TILES_HEIGHT);
    }
    inicialiceGraphics(){

    }
    getTile(address){
        //0 - white 1 - dark gray - light gray 2 - black
        //let index = address & 0xFFFE;
        this.bytesTile = this.bus.readTile(address);
        let tile = new Array();
        for (let i = 0; i < 16; i+=2){
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
    tilesetAssembling(LCDC){
        if((LCDC & 0x10) == 0x10){
            if(!this.backgroundloading){
                let index = 0x8000
                for(let i = 0; i < 0xFFF; i+=16){
                    this.tileset.push(this.getTile(index + i));
                }
                console.log(this.tileset);
            }
        }else{
            if(!this.backgroundloading){
                let index = 0x8800
                for(let i = 0; i < 0xFFF; i+=16){
                    this.tileset.push(this.getTile(index + i));
                }
            }
        }
    }
    drawDebugTiles(){
        for(let y = 0; y < DISPLAY_DEBUG_TILES_HEIGHT; y++){
            for(let x = 0; x < DISPLAY_DEBUG_TILES_WIDTH; x++){
                this.drawPixel(x,y, this.getPixelColor(this.debugTilesFrameBuffer[y][x])) 
            }
        }
    }
    tileSetToDebugTiles(tileset){
        if(!this.backgroundloading){
            let column = -1;
            let row = 0;
            for(let tile = 0; tile < (tileset.length - 1); tile++){
                //tiles 256
                column++
                for(let tira = 0; tira < 8; tira++){
                    //8 tiras
                    for(let pixel = 0; pixel < 8; pixel++){
                        //8 pixels
                        if(pixel + (column * 8) > DISPLAY_DEBUG_TILES_WIDTH){
                            column = 0;
                            row++;
                        }
                        //console.log(tileset[tile][tira][pixel]);
                        if(pixel + (column * 8) <= DISPLAY_DEBUG_TILES_WIDTH || tira + (row * 8) <= DISPLAY_DEBUG_TILES_HEIGHT){
                            console.log("guardando en la posicion x " + (pixel + (column * 8)) + " , eje Y " + (tira + (row * 8) + " el tile " + (tile + 1)));
                            this.debugTilesFrameBuffer[tira + (row * 8)][pixel + (column * 8)] = tileset[tile][tira][pixel];
                        }
                    }
                }
            }
            console.log(this.debugTilesFrameBuffer);
            this.backgroundloading = true;
        }
    }
    drawPixel(x, y, color){
        this.debugcontext.fillStyle = color;
        this.debugcontext.fillRect(x, y, 1, 1);
    }
    getPixelColor(pixel){
        switch(pixel){
            case 0:
                //blanco
                return '#FFF';
            case 1:
                //gris oscuro
                return '#545454';
            case 2:
                //gris claro
                return '#A9A9A9';
            case 3:
                //negro
                return '#000';
            default:
                return '#FFF';
        }
    }
}