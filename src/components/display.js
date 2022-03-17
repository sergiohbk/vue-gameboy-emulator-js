import { DISPLAY_WIDTH, DISPLAY_HEIGHT, DISPLAY_MULTIPLY } from "./variables/displayConstants";

export class Display{
    constructor(){
        /*this.screen = document.getElementById('canvas');
        this.ctx = this.screen.getContext('2d');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.screen.style.backgroundColor = '#000';
        this.screen.style.border = '3px solid #AAA';
        this.frameBuffer = [];
        this.resetPixel();*/
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
}