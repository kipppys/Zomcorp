

var zomGame = function(game){

};

var map;
var layers = [];
var doors = [];

var player;
var enemies;
var barrels;
var gameDoors;

var drops;
var dropList = [];

var displayItems = [];
var zomText = {font: "17px Arial", fill: "#000000"};

var roomsCleared = 0;



zomGame.prototype = {
    preload: function(){

    },
    create: function(){
        this.game.stage.backgroundColor = '#a2a2a2';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 0;

        drops = this.game.add.group();
        enemies = this.game.add.group();
        gameDoors = this.game.add.group();
        barrels = this.game.add.group();


        this.LoadLevel("Top");


    },
    update: function(){

        this.game.physics.arcade.collide(player, layers[0], null);

        this.game.physics.arcade.collide(enemies, layers[0], null);

        this.game.physics.arcade.collide(player, enemies, function(p, e){
            if(e.canAttack == true){
                p.damage(e.attackDamage);
                e.timeTillAttack = game.time.totalElapsedSeconds() + e.attackSpeed;
                console.log(p.health);
            }
        });

        this.game.physics.arcade.collide(player, barrels, function(p, b){

        });

        this.game.physics.arcade.collide(enemies, barrels, function(e, b){
            if(b.exploding == true){
                e.damage(1);
            }
        });

        this.game.physics.arcade.collide(player, drops, function(p, d){
            p.pickedUpDrop(d.name);
            d.kill();
        });


        this.game.physics.arcade.collide(player, gameDoors, function(p, d){

            if(enemies.countLiving() < 1){
                roomsCleared += 1;
                if(player.levelUp == true){

                    this.LifeText = this.game.add.text(400, 150, "Upgrade Life", zomText);
                    this.LifeText.anchor.setTo(.5,.5);
                    this.LifeUpgrade = game.add.sprite(400,200, "healthUp");
                    this.LifeUpgrade.anchor.setTo(.5,.5);

                    this.AmmoText = this.game.add.text(200, 360, "Upgrade Ammo", zomText);
                    this.AmmoText.anchor.setTo(.5,.5);
                    this.AmmoUpgrade = game.add.sprite(200, 400, "ammoUp");
                    this.AmmoUpgrade.anchor.setTo(.5,.5);

                    this.StaminaText = this.game.add.text(600, 340, "Upgrade Stamina", zomText);
                    this.StaminaText.anchor.setTo(.5,.5);
                    this.StaminaUpgrade = game.add.sprite(600,400, "staminaUp");
                    this.StaminaUpgrade.anchor.setTo(.5,.5);

                    game.input.onDown.add(function(event){
                        if(game.paused == true){

                            if(event.x >= 350 && event.x <= 450 &&
                            event.y >= 159 && event.y <= 241){
                                console.log("Health Upgraded");
                                game.paused = false;

                                player.maxHP += 10;
                                player.health = player.maxHP;

                                this.LoadLevel(d.side);
                                player.levelUp = false;

                                this.LifeText.kill();
                                this.LifeUpgrade.kill();
                                this.AmmoText.kill();
                                this.AmmoUpgrade.kill();
                                this.StaminaText.kill();
                                this.StaminaUpgrade.kill();
                            }

                            if(event.x >= 550 && event.x <= 650 &&
                                event.y >= 350 && event.y <= 450){
                                console.log("Stamina Upgraded");
                                game.paused = false;

                                player.maxStamina += 5;

                                this.LoadLevel(d.side);
                                player.levelUp = false;

                                this.LifeText.kill();
                                this.LifeUpgrade.kill();
                                this.AmmoText.kill();
                                this.AmmoUpgrade.kill();
                                this.StaminaText.kill();
                                this.StaminaUpgrade.kill();
                            }

                            if(event.x >= 158 && event.x <= 242 &&
                                event.y >= 370 && event.y <= 430){
                                console.log("Ammo Upgraded");
                                game.paused = false;

                                player.maxAmmo += 15;
                                player.ammo = player.maxAmmo;

                                this.LoadLevel(d.side);
                                player.levelUp = false;

                                this.LifeText.kill();
                                this.LifeUpgrade.kill();
                                this.AmmoText.kill();
                                this.AmmoUpgrade.kill();
                                this.StaminaText.kill();
                                this.StaminaUpgrade.kill();
                            }

                        }
                    }, this);

                    game.paused = true;

                }else{

                    this.LoadLevel(d.side);

                }
            }

        }, null, this);



        for(var pg = 0; pg < player.guns.length; pg++){
            this.game.physics.arcade.collide(player.guns[pg].bullets, layers[0], function(b, w){
                b.kill();

                if(b.gun == "Rocket Launcher") {
                    b.revive();
                    b.anchor.setTo(.5,.5);
                    b.body.velocity.y = 0;
                    b.body.velocity.x = 0;
                    b.loadTexture("explosion");
                    b.animations.add("explosion");
                    b.animations.play("explosion", 12, false, true);
                    b.exploding = true;
                }
            });

            this.game.physics.arcade.collide(enemies, player.guns[pg].bullets, this.BulletHitEnemy);

            this.game.physics.arcade.collide(barrels, player.guns[pg].bullets, function(b, pb){
                pb.kill();

                if(pb.gun == "Rocket Launcher") {
                    pb.revive();
                    pb.anchor.setTo(.5,.5);
                    pb.body.velocity.y = 0;
                    pb.body.velocity.x = 0;
                    pb.loadTexture("explosion");
                    pb.animations.add("explosion");
                    pb.animations.play("explosion", 12, false, true);
                    pb.exploding = true;
                }

                if(b.exploding == false) {
                    b.damage(pb.dmg);
                    if (b.alive == false) {
                        b.revive();
                        b.loadTexture("explosion");
                        b.animations.add("explosion");
                        b.animations.play("explosion", 12, false, true);
                        b.exploding = true;

                        var rndSpawn = Math.floor((Math.random() * 5) + 1);
                        if (rndSpawn == 3) {
                            var rndNum = Math.floor((Math.random() * 100) + 1);

                            if (rndNum > 0 && rndNum < 11) {
                                drops.add(new ZomPowerUp("Increased Damage", game, b.x, b.y, "damage"));
                            } else if (rndNum > 10 && rndNum < 21) {
                                drops.add(new ZomPowerUp("Health", game, b.x, b.y, "health"));
                            } else if (rndNum > 20 && rndNum < 31) {
                                drops.add(new ZomPowerUp("Increased Stamina", game, b.x, b.y, "stamina"));
                            } else if (rndNum > 30 && rndNum < 36) {
                                drops.add(new ZomPowerUp("SMG", game, b.x, b.y, "gunIMG"));
                            } else if (rndNum > 35 && rndNum < 41) {
                                drops.add(new ZomPowerUp("Rocket Launcher", game, b.x, b.y, "gunIMG"));
                            } else if (rndNum > 40 && rndNum < 71) {
                                drops.add(new ZomPowerUp("Shotgun", game, b.x, b.y, "gunIMG"));
                            } else if (rndNum > 70 && rndNum < 101) {
                                drops.add(new ZomPowerUp("Dual Pistols", game, b.x, b.y, "gunIMG"));
                            }

                        }
                    }
                }
            });
        }

        enemies.forEachAlive(function(e){

            e.updateMovement(player);

        }, this);

        this.ZomDisplay();

    },
    BulletHitEnemy: function(e,b) {

        if(b.gun == "Rocket Launcher" && b.exploding == false) {
            b.revive();
            b.anchor.setTo(.5,.5);
            b.body.velocity.y = 0;
            b.body.velocity.x = 0;
            b.loadTexture("explosion");
            b.animations.add("explosion");
            b.animations.play("explosion", 12, false, true);
            b.exploding = true;
            //b.body.immovable = true;

        }else if(b.gun != "Rocket Launcher"){
            b.kill();
        }

        if (player.increasedDamage == true) {
            var dmg = b.dmg + (b.dmg / 2);
            e.damage(b.dmg);
        } else {
            e.damage(b.dmg);
        }

        if (e.health < b.dmg) {
            var rndSpawn = Math.floor((Math.random() * 5) + 1);
            if (rndSpawn == 3) {
                var rndNum = Math.floor((Math.random() * 100) + 1);

                if (rndNum > 0 && rndNum < 11) {
                    drops.add(new ZomPowerUp("Increased Damage", game, e.x, e.y, "damage"));
                } else if (rndNum > 10 && rndNum < 21) {
                    drops.add(new ZomPowerUp("Health", game, e.x, e.y, "health"));
                } else if (rndNum > 20 && rndNum < 31) {
                    drops.add(new ZomPowerUp("Increased Stamina", game, e.x, e.y, "stamina"));
                } else if (rndNum > 30 && rndNum < 36) {
                    drops.add(new ZomPowerUp("SMG", game, e.x, e.y, "gunIMG"));
                } else if (rndNum > 35 && rndNum < 41) {
                    drops.add(new ZomPowerUp("Rocket Launcher", game, e.x, e.y, "gunIMG"));
                } else if (rndNum > 40 && rndNum < 71) {
                    drops.add(new ZomPowerUp("Shotgun", game, e.x, e.y, "gunIMG"));
                } else if (rndNum > 70 && rndNum < 101) {
                    drops.add(new ZomPowerUp("Dual Pistols", game, e.x, e.y, "gunIMG"));
                }

            }

            player.experience += 1;

            if (player.experience >= (player.previousLevelUp + 10 + (player.previousLevelUp / 2))) {
                player.previousLevelUp = player.experience;
                player.levelUp = true;
            }
        }

    },
    LoadLevel: function(side){
        var enemyAmmount = roomsCleared+1;
        var barrelAmmount = Math.floor((Math.random() * 6) + 1);
        var enemiesSpawned = 0;
        var barrelsSpawned = 0;

        if(map!= null){
            map.destroy();
            layers[0].destroy();
            layers[1].destroy();
            //layers[2].destroy();
        }

        enemies.removeAll();
        barrels.removeAll();
        drops.removeAll();
        gameDoors.removeAll();

        if(player != null) {

            for(var pg = 0; pg < player.guns.length; pg++){

                player.guns[pg].bullets.forEachAlive(function(bullet){
                    bullet.kill();
                }, this);
            }
        }


        var rndMap = Math.floor((Math.random() * 3) + 1);
        console.log(rndMap);
        switch(rndMap){
            case 1:
                map = game.add.tilemap('map1');
                break;
            case 2:
                map = game.add.tilemap('map2');
                break;
            case 3:
                map = game.add.tilemap('map3');
                break;
        }

       // map = game.add.tilemap('map1');

       // map = game.add.tilemap('testmap');
        map.addTilesetImage('tileset');

        this.layerNames = ['walls', 'boundaries'];

        this.layerNames.forEach(function(c, i, a){

            layers[i] = map.createLayer(c);
        });

        map.setCollision([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], true, layers[0]);
        layers[1].visible = false;

        if(player == null){
            player = new ZomPlayer(game, 400,520, 'testsheet');
        } else {
            switch(side){
                case "Top":
                    player.x = 400;
                    player.y = 80;
                    break;
                case "Right":
                    player.x = 720;
                    player.y = 300;
                    break;
                case "Bottom":
                    player.x = 400;
                    player.y = 520;
                    break;
                case "Left":
                    player.x = 80;
                    player.y = 300;
                    break;
            }
        }


        //map array for placing all the objects
        var mapArray = layers[1].getTiles(0,0,this.game.world.width, this.game.world.height);

        //randomly spawns barrels
        while(barrelsSpawned < barrelAmmount) {
            //loop through all the tiles in the map
            for (var i = 0; i < mapArray.length; i++) {
                //create a variable to test against the tiles
                this.myTile = mapArray[i];

                if (this.myTile.index == -1 && barrelsSpawned < barrelAmmount) {
                    var rndNum = Math.floor((Math.random() * 100) + 1);

                    if (rndNum === 50) {
                        this.myTile.index = 2;
                        barrels.add(new ZomBarrel(game, this.myTile.worldX+20, this.myTile.worldY+20, 'testsheet'));
                        barrelsSpawned += 1;
                    }
                }

            }
        }


        this.indexArray = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];


        console.log(this.indexArray[1][2]);

        this.x = 0;
        this.y = 0;

        this.currentX = 20;

        for (var i = 0; i < mapArray.length; i++) {

            this.myTile = mapArray[i];

            if(i == this.currentX){
                this.y++;
                this.x = 0;
                this.currentX += 20;
            }

            if(this.myTile.index != -1){
                this.indexArray[this.y][this.x] = 1;
            } else {
                this.indexArray[this.y][this.x] = 0;
            }

            this.x++;
        }

        //randomly spawns enemies
        while(enemiesSpawned < enemyAmmount) {
            //loop through all the tiles in the map
            for (var i = 0; i < mapArray.length; i++) {
                //create a variable to test against the tiles
                this.myTile = mapArray[i];

                if (this.myTile.index == -1 && enemiesSpawned < enemyAmmount) {
                    var rndNum = Math.floor((Math.random() * 100) + 1);

                    if (rndNum === 50) {
                        this.myTile.index = 2;
                        enemies.add(new ZomEnemy(game, this.myTile.worldX, this.myTile.worldY, 'testsheet', "Vanilla", this.indexArray));
                        enemiesSpawned += 1;
                    }
                }

            }
        }

        doors[0] = new ZomDoor("Bottom", game, 400,10, "testsheet");
        doors[0].anchor.setTo(0.5,0);
        doors[1] = new ZomDoor("Left", game, 790,300, "testsheet");
        doors[1].anchor.setTo(1,0.5);
        doors[2] = new ZomDoor("Top", game, 400,590, "testsheet");
        doors[2].anchor.setTo(0.5,1);
        doors[3] = new ZomDoor("Right", game, 10,300, "testsheet");
        doors[3].anchor.setTo(0, 0.5);


        for(var d = 0; d < doors.length; d++){
            gameDoors.add(doors[d]);
        }

        game.world.bringToTop(gameDoors);

        displayItems[0] = this.game.add.text(92.5,570,"", zomText);
        displayItems[1] = this.game.add.text(235,570,"", zomText);

        displayItems[2] = this.game.add.text(470,570,"", zomText);
        displayItems[3] = this.game.add.text(630,570,"", zomText);

        this.game.add.existing(player);
    },
    ZomDisplay: function(){

        displayItems[0].setText("Health: "+player.health);
        displayItems[1].setText("Stamina: "+player.stamina.toFixed(0));
        displayItems[2].setText("Ammo: "+player.ammo);
        displayItems[3].setText("Gun: "+player.currentGun.gunName);

    }
};