export class Controller{
    
    constructor(bus){
        this.keyboard = true;
        this.gamepad = false;
        this.keysPressed = new Array(8);
        this.PLAYER_1 = 0xFF00;
        this.activateKeyboard();
        this.buttons = false;
        this.directions = false;
        this.bus = bus;
        this.bus.controller = this;

        this.downPressed = false;
        this.upPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.aPressed = false;
        this.bPressed = false;
        this.startPressed = false;
        this.selectPressed = false;

        this.direction = false;
        this.button = false;
    }

    activateKeyboard(){
        if(!this.keyboard) return;

        this.down = 'KeyS';
        this.up = 'KeyW';
        this.left = 'KeyA';
        this.right = 'KeyD';
        this.a = 'KeyJ';
        this.b = 'KeyK';
        this.start = 'Enter';
        this.select = 'Space';

        document.addEventListener('keydown', event => this.keyEvent(event.code, true));
        document.addEventListener('keyup', event => this.keyEvent(event.code, false));
    }

    keyEvent(keycode, isPressed){
        if(keycode == this.a) 
            this.aPressed = isPressed;
        if(keycode == this.b) 
            this.bPressed = isPressed;
        if(keycode == this.start) 
            this.startPressed = isPressed;
        if(keycode == this.select) 
            this.selectPressed = isPressed;
        if(keycode == this.down)
            this.downPressed = isPressed;
        if(keycode == this.up) 
            this.upPressed = isPressed;
        if(keycode == this.left)
            this.leftPressed = isPressed;
        if(keycode == this.right) 
            this.rightPressed = isPressed;

        
        //hacer log de todos los botones presionados
        console.log("a " + this.aPressed + " b " + this.bPressed + " start " + this.startPressed + " select " + this.selectPressed + " down " + this.downPressed + " up " + this.upPressed + " left " + this.leftPressed + " right " + this.rightPressed);
    }
    write(value){
        this.button = (value & 0x10) == 0x10;
        this.direction = (value & 0x20) == 0x20;
    }

    read(){
        let byte = 0xC0;
        if(this.button){
            if(this.aPressed) 
                byte = (byte | 0x01);
            if(this.bPressed) 
                byte = (byte | 0x02);
            if(this.startPressed) 
                byte = (byte | 0x08);
            if(this.selectPressed)
                byte = (byte | 0x04);

            byte = (byte | 0x20);
        }
        if(this.direction){
            if(this.downPressed)
                byte = (byte | 0x08);
            if(this.upPressed) 
                byte = (byte | 0x04);
            if(this.leftPressed)
                byte = (byte | 0x02);
            if(this.rightPressed) 
                byte = (byte | 0x01);
        
            byte = byte | 0x10;
        }
        return byte;
    }
    flushPressed(){
        this.aPressed = false;
        this.bPressed = false;
        this.startPressed = false;
        this.selectPressed = false;
        this.downPressed = false;
        this.upPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
}