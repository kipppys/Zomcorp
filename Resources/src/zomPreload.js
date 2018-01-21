var zomPreload = function(game){

};

zomPreload.prototype = {
    preload: function(){
        this.game.load.tilemap('map1', 'Resources/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map2', 'Resources/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('map3', 'Resources/maps/map3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tileset', 'Resources/Images/Game/tileset.PNG');
        this.game.load.image('walls', 'Resources/Images/Game/walls.png');
        this.game.load.image('bullet', 'Resources/Images/Game/bullet.png');
        this.game.load.image('drop', 'Resources/Images/Game/drop.png');
        this.game.load.image('healthUp', 'Resources/Images/Game/heart.png');
        this.game.load.image('ammoUp', 'Resources/Images/Game/ammo.PNG');
        this.game.load.image('staminaUp', 'Resources/Images/Game/stamina.png');
        this.game.load.image('damage', 'Resources/Images/Game/drops/damage.PNG');
        this.game.load.image('gunIMG', 'Resources/Images/Game/drops/gun.PNG');
        this.game.load.image('stamina', 'Resources/Images/Game/drops/stamina.PNG');
        this.game.load.image('health', 'Resources/Images/Game/drops/health.png');
        this.game.load.spritesheet('testsheet', 'Resources/Images/Game/tileset.PNG', 40, 40);
        this.game.load.spritesheet('explosion', 'Resources/Images/Game/Explosion.png', 96, 96);

    },
    create: function(){

        this.game.state.start('zomMenu');
    }
};