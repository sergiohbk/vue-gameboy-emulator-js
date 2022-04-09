import { IF_pointer } from "./interrumpts";
import { completeFrameScanlines, cyclesHBlank, cyclesScanline, cyclesScanlineOAM, cyclesScanlineVRAM, SCREEN_DEBUG_TILES_HEIGHT, SCREEN_DEBUG_TILES_WIDTH, SCREEN_HEIGHT, SCREEN_MULTIPLY, SCREEN_WIDTH } from "./variables/GPUConstants";

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
        this.tilesetloading = false;
        this.cyclesCounter = 0;
        this.LCDCstatus = 0;
    }
    getLCDCmode(){
        let mode = this.bus.read(0xFF41) & 0x3;
        switch(mode){
            case 0:
                return 'HBlank';
            case 1:
                return 'VBlank';
            case 2:
                return 'OAM';
            case 3:
                return 'VRAM';
            default:
                return 'HBlank';
        }
    }
    setLCDCmode(mode){
        let lastLCDCstatus = this.bus.read(0xFF41);
        switch(mode){
            case 'HBlank':
                this.bus.write(0xFF41, lastLCDCstatus & 0xFC);
                break;
            case 'VBlank':
                this.bus.write(0xFF41, (lastLCDCstatus & 0xFC) | 0x1);
                break;
            case 'OAM':
                this.bus.write(0xFF41, (lastLCDCstatus & 0xFC) | 0x2);
                break;
            case 'VRAM':
                this.bus.write(0xFF41, (lastLCDCstatus & 0xFC) | 0x3);
                break;
            default:
                this.bus.write(0xFF41, lastLCDCstatus & 0xFC);
                break;
        }
    }
    createDisplay(){
        this.screen = document.getElementById('canvas');
        this.debugscreen = document.getElementById('debug');
        this.ctx = this.screen.getContext('2d');
        this.debugcontext = this.debugscreen.getContext('2d');
        this.screen.width = SCREEN_WIDTH * SCREEN_MULTIPLY;
        this.screen.height = SCREEN_HEIGHT * SCREEN_MULTIPLY;
        this.debugscreen.width = SCREEN_DEBUG_TILES_WIDTH;
        this.debugscreen.height = SCREEN_DEBUG_TILES_HEIGHT;
        this.screen.style.backgroundColor = '#FFF';
        this.screen.style.border = '3px solid #000';
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

    tick(cycles){
        this.cyclesCounter += cycles;
        switch(this.getLCDCmode){
            case 'HBlank':
                if(this.cyclesCounter >= cyclesHBlank){
                    this.cyclesCounter %= cyclesHBlank;
                    this.bufferringScanLine();

                    this.bus.write(0xFF44, (this.bus.read(0xFF44) + 1) & 0xFF);
                    let ly = this.bus.read(0xFF44);
                    if(ly === SCREEN_HEIGHT){
                        this.setLCDCmode('VBlank');
                        this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x1);
                    }else{
                        this.setLCDCmode('OAM');
                    }
                }
                break;
            case 'VBlank':
                if(this.cyclesCounter >= cyclesScanline){
                    let lycompare = this.lyCompare();
                    let lycInterrupt = (this.bus.read(0xFF41) & 0x40) == 0x40;
                    if(lycompare && lycInterrupt){
                        this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x2);
                    }
                    this.bus.write(0xFF44, (this.bus.read(0xFF44) + 1) & 0xFF);
                    this.cyclesCounter %= cyclesScanline;
                    let ly = this.bus.read(0xFF44);
                    if(ly === completeFrameScanlines){
                        this.bus.write(0xFF44, 0);
                        this.setLCDCmode('OAM');
                    }
                }
                break;
            case 'OAM':
                if(this.cyclesCounter >= cyclesScanlineOAM){
                    this.cyclesCounter %= cyclesScanlineOAM;
                    this.setLCDCmode('VRAM');
                }
                break;
            case 'VRAM':
                if(this.cyclesCounter >= cyclesScanlineVRAM){
                    this.cyclesCounter %= cyclesScanlineVRAM;
                    
                    let hBlankInterrupt = (this.bus.read(0xFF41) & 0x8) == 0x8;
                    if(hBlankInterrupt){
                        this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x2);
                    }
                    let lycompare = this.lyCompare();
                    let lycInterrupt = (this.bus.read(0xFF41) & 0x40) == 0x40;
                    if(lycompare && lycInterrupt){
                        this.bus.write(IF_pointer, this.bus.read(IF_pointer) | 0x2);
                    }
                    this.setLCDCmode('HBlank');
                }
                break;
        }
    }
    bufferringScanLine(){
        this.LCDC = this.bus.read(0xFF40);
        if((this.LCDC & 0x80) != 0x80) return;
        
        let backgroundline
        if((this.LCDC & 0x00) == 0x00){
            backgroundline = this.loadBackgroundLine();
        }
        let windowline
        if((this.LCDC & 0x20) == 0x20){
            //implementar menu
        }
        let spriteline
        if((this.LCDC & 0x2) == 0x2){
            //implementar sprites
        }

        this.drawtoScreen(backgroundline, windowline, spriteline);
    }
    loadBackgroundLine(){
        let backgroundline = [];
        this.LCDC = this.bus.read(0xFF40);
        let backgroundMemPos = ((this.LCDC & 0x10) == 0x10) ? 0x8000 : 0x8800;
        let tilemapMemPos = ((this.LCDC & 0x08) == 0x08) ? 0x9C00 : 0x9800;
        let isSigned = ((this.LCDC & 0x10) == 0x00);
        let scrollY = (this.bus.read(0xFF44) + this.bus.read(0xFF42)) & 0xFF;
        
        for(let x = 0; x < SCREEN_WIDTH; x++){
          if((this.LCDC & 0x1) == 0x1){
            let scrollX = (x + this.bus.read(0xFF43)) & 0xFF;
            let tileMapIndex = Math.floor((scrollY / 8) * 32 + (scrollX / 8));
            let upleftpixel = this.getTileUpperLeftPixel(tileMapIndex);
            
            let xPosTile = scrollX - upleftpixel[0];
            let yPosTile = scrollY - upleftpixel[1];

            let signedoffset = isSigned ? 128 : 0;

            tileMapIndex = (tilemapMemPos + tileMapIndex) + signedoffset;
            //mirar como sacar el offset con los signed
            let tilePixelPos = backgroundMemPos + (tileMapIndex * 16) + (yPosTile * 2);
            let tileLow = this.bus.read(tilePixelPos);
            let tileHigh = this.bus.read(tilePixelPos + 1);
            let pixel = this.getPixelTile(xPosTile,tileHigh, tileLow);
            backgroundline.push(pixel);
          }else{
              let color = this.getPixelColor(0);
              backgroundline.push(color);
          }
        }
        return backgroundline;
    }
    drawtoScreen(background, window, sprite){
        let ly = this.bus.read(0xFF44);
        if(background)
            var backgroundline = background;
        if(window)
            //var windowline = window;
        if(sprite)
            //var spriteline = sprite;

        for(let x = 0; x < SCREEN_WIDTH; x++){
            this.ctx.fillStyle = backgroundline[x];
            this.ctx.fillRect(x * SCREEN_MULTIPLY, ly * SCREEN_MULTIPLY, SCREEN_MULTIPLY, SCREEN_MULTIPLY);
        }
    }
    getTileUpperLeftPixel(tileMapIndex){
        let y = (tileMapIndex / 32) * 8;
        let x = (tileMapIndex % 32) * 8;
        let tile = [];
        tile.push(x)
        tile.push(y)
        return tile;
    }
    resetPixel(){
        for (let y = 0; y < SCREEN_HEIGHT; y++){
            this.frameBuffer.push([]);
            for (let x = 0; x < SCREEN_WIDTH; x++){
                this.frameBuffer[y].push(0);
                
            }
        }
        this.ctx.clearRect(0, 0, SCREEN_WIDTH * SCREEN_MULTIPLY, SCREEN_HEIGHT * SCREEN_MULTIPLY);
    }
    getPixelTile(xpos, tileHigh, tileLow){
        let pixel = ((tileHigh >> (7 - xpos)) & 1) << 1 | ((tileLow >> (7 - xpos)) & 1);
        return this.getPixelColor(pixel);
    }
    lyCompare(){
        let lyc = this.bus.read(0xFF45);
        let ly = this.bus.read(0xFF44);
        if(ly == lyc){
            this.bus.write(0xFF41, this.bus.read(0xFF41) | 0x4);
            return true;
        }
        else{
            this.bus.write(0xFF41, this.bus.read(0xFF41) & 0xFB);
            return false;
        }
    }
    resetDebugPixels(){
        for (let y = 0; y < SCREEN_DEBUG_TILES_HEIGHT; y++){
            this.debugTilesFrameBuffer.push([]);
            for (let x = 0; x < SCREEN_DEBUG_TILES_WIDTH; x++){
                this.debugTilesFrameBuffer[y].push(0);
            }
        }
        this.debugcontext.clearRect(0, 0, SCREEN_DEBUG_TILES_WIDTH, SCREEN_DEBUG_TILES_HEIGHT);
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
        if(!this.tilesetloading){
            if((LCDC & 0x10) == 0x10){
                let index = 0x8000
                for(let i = 0; i < 0xFFF; i+=16){
                    this.tileset.push(this.getTile(index + i));
                }
                console.log(this.tileset);
            }
            else{
                let index = 0x8800
                for(let i = 0; i < 0xFFF; i+=16){
                    this.tileset.push(this.getTile(index + i)); 
                }
            }
        }
    }
    drawDebugTiles(){
        for(let y = 0; y < SCREEN_DEBUG_TILES_HEIGHT; y++){
            for(let x = 0; x < SCREEN_DEBUG_TILES_WIDTH; x++){
                this.drawPixelDebug(x,y, this.getPixelColor(this.debugTilesFrameBuffer[y][x])) 
            }
        }
    }
    tileSetToDebugTiles(tileset){
        if(!this.tilesetloading){
            let column = -1;
            let row = 0;
            for(let tile = 0; tile < (tileset.length - 1); tile++){
                //tiles 256
                column++
                for(let tira = 0; tira < 8; tira++){
                    //8 tiras
                    for(let pixel = 0; pixel < 8; pixel++){
                        //8 pixels
                        if(pixel + (column * 8) > SCREEN_DEBUG_TILES_WIDTH){
                            column = 0;
                            row++;
                        }
                        //console.log(tileset[tile][tira][pixel]);
                        if(pixel + (column * 8) <= SCREEN_DEBUG_TILES_WIDTH || tira + (row * 8) <= SCREEN_DEBUG_TILES_HEIGHT){
                            this.debugTilesFrameBuffer[tira + (row * 8)][pixel + (column * 8)] = tileset[tile][tira][pixel];
                        }
                    }
                }
            }
            this.tilesetloading = true;
        }
    }
    drawPixelDebug(x, y, color){
        this.debugcontext.fillStyle = color;
        this.debugcontext.fillRect(x, y, 1, 1);
    }
    drawPixel(x, y, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * SCREEN_MULTIPLY, y * SCREEN_MULTIPLY, SCREEN_MULTIPLY, SCREEN_MULTIPLY);
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
    getTileMap(){
        //que el tile map no se ejecute constantemente
        let tileMap = new Array()
        let index = 0;
        if((this.LCDC & 0x8) == 0x8){
            index = 0x9C00;
        }else{
            index = 0x9800;
        }
        for(let y = 0; y < 32; y++){
            for(let x = 0; x < 32; x++){
                tileMap.push(this.bus.read(index + (x + (y * 32))));
            }
        }
        return tileMap;
    }
    calculateBackground(){
        let tileMap = this.getTileMap();
        let tileset = this.tileset;
        let tile = 0;
        for(let map = 0; map < tileMap.length; map++){
            tile = tileMap[map];
            let tileX = (map % 32) * 8;
            let tileY = Math.floor(map / 32) * 8;
            for(let y = 0; y < 8; y++){
                for(let x = 0; x < 8; x++){
                    let pixel = tileset[tile][y][x];
                    let color = this.getPixelColor(pixel);
                    this.drawPixel(tileX + x, tileY + y, color);
                }
            }
        }
    }
}