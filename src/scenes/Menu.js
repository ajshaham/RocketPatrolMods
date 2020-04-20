class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('menuscreen', './assets/rocketpatrolmainmenu.png');
    }

    create() {
        // place tile sprite
        this.menuscreen = this.add.tileSprite(0, 0, 640, 480, 'menuscreen').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(0, 0, 640, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(0, 450, 640, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(0, 0, 32, 455, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(608, 0, 32, 455, 0xFACADE).setOrigin(0, 0);

        // score display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        this.add.text(centerX, centerY - 2*textSpacer, 'ROCKET PATROL MOD', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'P1: use (A) & (D) to move & (W) to Fire', menuConfig).setScale(0.8, 0.8).setOrigin(0.5);
        this.add.text(centerX, centerY + 0.5*textSpacer, 'P2: use (←) & (→) to move & (↑) to Fire', menuConfig).setScale(0.8, 0.8).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + 2.5*textSpacer, 'Press <- for Easy or -> for Hard', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}