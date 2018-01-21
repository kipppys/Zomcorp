ZomPowerUp = function(name, game, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.name = name;
    this.inputEnabled = true;

};

ZomPowerUp.prototype = Object.create(Phaser.Sprite.prototype);
ZomPowerUp.prototype.constructor = ZomPowerUp;
