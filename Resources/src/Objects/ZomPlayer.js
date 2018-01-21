ZomPlayer = function(game, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.drag.x = 50;
    this.body.drag.y = 50;
    this.body.maxVelocity.x = 75;
    this.body.maxVelocity.y = 75;

    this.anchor.setTo(.5,.5);

    this.health = 100;
    this.maxHP = 100;
    this.stamina = 50;
    this.ammo = 150;
    this.maxAmmo = 150;

    this.maxStamina = 50;
    this.baseStamina = 50;
    this.staminaRecharge = 0.1;
    this.increasedStamina = false;
    this.increasedStaminaTimeOff = 0;

    this.increasedDamage = false;
    this.increasedDamageTimeOff = 0;

    this.experience = 0;
    this.previousLevelUp = 0;
    this.levelUp = false;

    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.sprintKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    this.guns = [
        new ZomGun("Pistol", game, 0, 0, 'bullet', 1, 3, 0.5, 1),
        new ZomGun("Dual Pistols", game, 0, 0, 'bullet', 1, 3, 0.25, 1),
        new ZomGun("SMG", game, 0, 0, 'bullet', 1, 1, 0.1, 5),
        new ZomGun("Rocket Launcher", game, 0, 0, 'bullet', 15, 15, 5, 5),
        new ZomGun("Shotgun", game, 0, 0, 'bullet', 5, 10, 1.5, 15)];

    this.currentGun = this.guns[0];
    this.addChild(this.currentGun);

};

ZomPlayer.prototype = Object.create(Phaser.Sprite.prototype);
ZomPlayer.prototype.constructor = ZomPlayer;

ZomPlayer.prototype.update = function(){

    if(this.upKey.isDown){
        this.body.velocity.y -= 5;
    }
    if(this.downKey.isDown){
        this.body.velocity.y += 5;
    }
    if(this.leftKey.isDown){
        this.body.velocity.x -= 5;
    }
    if(this.rightKey.isDown){
        this.body.velocity.x += 5;
    }

    if(this.sprintKey.isDown && this.stamina > 0){
        this.body.maxVelocity.x = 125;
        this.body.maxVelocity.y = 125;
        this.stamina -= 0.2;
        this.addChild(this.currentGun);

    } else{
        this.body.maxVelocity.x = 75;
        this.body.maxVelocity.y = 75;
        if(this.stamina < this.maxStamina){
            this.stamina += this.staminaRecharge;
        }
    }

    if(this.increasedDamage == true){
        if(this.increasedDamageTimeOff < this.game.time.totalElapsedSeconds()){
            this.increasedDamage = false;
        }
    }

    if(this.increasedStamina == true){
        this.staminaRecharge = 0.3;
        if(this.increasedStaminaTimeOff < this.game.time.totalElapsedSeconds()){
            this.increasedStamina = false;
            this.staminaRecharge = 0.1;
        }
    }


    if(this.health > this.maxHP){
        this.health = this.maxHP;
    }

    if(this.ammo > this.maxAmmo){
        this.ammo = this.maxAmmo;
    }

    this.currentGun.update(this);
};

ZomPlayer.prototype.pickedUpDrop = function(drop){
    console.log(drop);

    switch (drop){
        case "Increased Damage":
            this.increasedDamage = true;
            this.increasedDamageTimeOff = this.game.time.totalElapsedSeconds() + 10;
            break;
        case "Increased Stamina":
            this.increasedStamina = true;
            this.increasedStaminaTimeOff = this.game.time.totalElapsedSeconds() + 25;
            break;
        case "Health":
            this.health += 50;
            break;
        case "SMG":
            this.currentGun = this.guns[2];
            this.ammo += 100;
            this.addChild(this.currentGun);
            break;
        case "Rocket Launcher":
            this.currentGun = this.guns[3];
            this.ammo += 100;
            this.addChild(this.currentGun);
            break;
        case "Dual Pistols":
            this.currentGun = this.guns[1];
            this.ammo += 100;
            this.addChild(this.currentGun);
            break;
        case "Shotgun":
            this.currentGun = this.guns[4];
            this.ammo += 100;
            this.addChild(this.currentGun);
            break;
    }
    this.currentGun.lastFired = this.game.time.totalElapsedSeconds()+1;
};
