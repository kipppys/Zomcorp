ZomBullet = function(game, x, y, img, dmg, mass, gun){
    Phaser.Sprite.call(this, game, x, y, img);

    this.dmg = dmg;
    this.gun = gun;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    if(this.gun == "Rocket Launcher")
        this.exploding = false;

    this.expW = 5;
    this.expH = 5;
};

ZomBullet.prototype = Object.create(Phaser.Sprite.prototype);
ZomBullet.prototype.constructor = ZomBullet;

ZomBullet.prototype.update = function(){
    //this.game.debug.body(this);
    if(this.gun == "Rocket Launcher"){
        if(this.exploding == true){
            this.expW += 1.2;
            this.expH += 1.2;
            this.body.setSize(this.expW, this.expH);
            this.body.immovable = true;
        }
        this.events.onAnimationComplete.add(function(){
            this.body.setSize(5, 5);
            this.expW = 5;
            this.expH = 5;
            this.exploding = false;
        }, this);
    }




};
