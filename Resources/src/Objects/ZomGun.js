ZomGun = function(name, game, x, y, img, ACPB, gunDmg, fireRate, mass){
    Phaser.Sprite.call(this, game, x, y, img);

    this.gunName = name;
    this.game = game;
    this.x = x;
    this.y = y;
    this.ACperBullet = ACPB;
    this.gunDmg = gunDmg;
    this.fireRate = fireRate;
    this.lastFired = 0;

    this.bullets = this.game.add.group();

    for(var i = 0; i < 100; i++){
        this.bullet = new ZomBullet(game, 0, 0, 'bullet', this.gunDmg, mass, this.gunName);
        this.bullets.add(this.bullet);
        this.bullet.kill();
    }

    //this.visible = false;

};

ZomGun.prototype = Object.create(Phaser.Sprite.prototype);
ZomGun.prototype.constructor = ZomGun;

ZomGun.prototype.update = function(player){

    if(this.game.input.activePointer.leftButton.isDown && this.lastFired < this.game.time.totalElapsedSeconds() && player.ammo >= this.ACperBullet ||
        this.game.input.activePointer.leftButton.isDown && this.lastFired < this.game.time.totalElapsedSeconds() && player.currentGun == player.guns[0]){
        this.bullet = this.bullets.getFirstDead();
        if(this.bullet != null) {
            if(this.gunName == "Rocket Launcher") {
                this.bullet.loadTexture("bullet");
                this.bullet.body.immovable = false;
                this.bullet.exploding = false;
                this.bullet.body.setSize(5,5);
            }
            this.bullet.revive();
            this.bullet.x = this.worldPosition.x;
            this.bullet.y = this.worldPosition.y;
            this.game.physics.arcade.moveToXY(this.bullet, this.game.input.mousePointer.x, this.game.input.mousePointer.y, 100);

            this.lastFired = this.game.time.totalElapsedSeconds() + this.fireRate;
            if(player.ammo > 0)
                player.ammo -= this.ACperBullet;
        }
    }

    if(this.game.input.activePointer.leftButton.isDown && this.lastFired < this.game.time.totalElapsedSeconds() && player.ammo <= this.ACperBullet) {
       player.currentGun = player.guns[0];
        player.addChild(player.currentGun);
    }

    if(player.ammo == 0){
        player.removeChild(player.currentGun);
        player.currentGun = player.guns[0];
        player.addChild(player.currentGun);
        console.log("out of ac");
    }
};
