class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('newrocket', './assets/newrocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/rocketpatrolbgart.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('bgm', './assets/rocketpatrolmusic.mp3');
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
    
        // add rocket {p1}
        this.p1Rocket = new Rocket(this, game.config.width/2 - 15, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0,0);
        this.p2Rocket = new Rocket2(this, game.config.width / 2 + 15, 431, 'newrocket').setScale(0.5, 0.5).setOrigin(0, 0);
        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0, 0);

        // play music
        //this.sound.play('bgm');
        this.music = this.sound.add('bgm');
        this.music.play();

        // define keyboard keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // animation config
        this.anims.create({
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;
        this.p2Score = 0;
        // time
        //this.gTime = game.settings.gameTimer/1000;

        // score display
        let p1ScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, p1ScoreConfig);
        let p2ScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreRight = this.add.text(472, 54, this.p2Score, p2ScoreConfig);

        /*
       // time display
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FACADE',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(273, 54, this.gTime, timeConfig);
        */

        // game over flag
        this.gameOver = false;
        // speed increase flag
        this.speedIncrease = false;

        // 45/60-second play clock
        p1ScoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', p1ScoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(↑) to Restart or (←) for Menu', p1ScoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.music.stop();
        }, null, this);
        // 30-second timer
        this.speedTimer = this.time.delayedCall(30000, () => {
            this.speedIncrease = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Speed increase after 30 seconds
        if (this.speedIncrease == true) {
            game.settings.spaceshipSpeed += 2;
            this.speedIncrease = false;
        }

        /*
        // clock handling
        if (this.gTime > 0) {
            //this.gTime -= 1;
            this.timeLeft.text = this.gTime;
        }
        */

        // scroll starfield
        this.starfield.tilePositionX -= 4;

        // update rocket
        this.p1Rocket.update();
        this.p2Rocket.update();
        // update spaceship
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket);
        }
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, this.p2Rocket);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02, this.p2Rocket);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01, this.p2Rocket);
        }

        if (!this.gameOver) {
            this.p1Rocket.update();         // update rocket sprite
            this.p2Rocket.update();
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }
    }

    // simple Axis-Aligned Bounding Boxes (AABB) checking
    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, rocket) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        if (rocket == this.p1Rocket) {
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        } 
        if (rocket == this.p2Rocket) {
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
        this.sound.play('sfx_explosion');
        // time increment anmd repaint
        //this.gTime += 1;
        //this.timeLeft.text = this.gTime;
    }
}