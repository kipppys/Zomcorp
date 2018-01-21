ZomBarrel = function(game, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);

    this.frame = 3;

    this.mass = 10;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.immovable = true;

    this.health = 3;
    this.exploding = false;
    this.expW = 40;
    this.expH = 40;

    this.anchor.setTo(0.5,0.5);

};

ZomBarrel.prototype = Object.create(Phaser.Sprite.prototype);
ZomBarrel.prototype.constructor = ZomBarrel;

ZomBarrel.prototype.update = function(){
   // this.game.debug.body(this);
    if(this.exploding == true){
        this.expW += 1;
        this.expH += 1;
        //this.x -= 0.05;
        //this.y -= 0.05;
        this.body.setSize(this.expW, this.expH);
        this.body.immovable = true;

    }
    this.events.onAnimationComplete.add(function(){
        this.body.setSize(40, 40);
        this.expW = 5;
        this.expH = 5;
        this.exploding = false;
    }, this);
};
