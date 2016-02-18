ZomDoor = function(side, game, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.side = side;
    this.frame = 4;
};

ZomDoor.prototype = Object.create(Phaser.Sprite.prototype);
ZomDoor.prototype.constructor = ZomDoor;

ZomDoor.prototype.update = function(){


}
