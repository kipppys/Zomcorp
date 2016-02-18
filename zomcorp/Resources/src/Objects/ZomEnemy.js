ZomEnemy = function(game, x, y, img, type, indexArray){
    Phaser.Sprite.call(this, game, x, y, img);

    this.frame = 1;
    this.type = type;
    this.attackDamage = 0;
    this.attackSpeed = 0;
    this.timeTillAttack = 0;
    this.canAttack = true;

    if(this.type == "Vanilla"){
        this.attackDamage = 10;
        this.attackSpeed = 2;
        this.health = 10;
    }

    game.physics.enable(this, Phaser.Physics.ARCADE);

    console.log(indexArray);

    this.grid = new PF.Grid(20, 15, indexArray);
    this.gridBackup = this.grid.clone();
    this.finder = new PF.AStarFinder({allowDiagonal: true});

    this.lastPathed = 0;
    this.pathingDelay = 500;

    this.direction = "";
    this.moveSpeed = 50;

};

ZomEnemy.prototype = Object.create(Phaser.Sprite.prototype);
ZomEnemy.prototype.constructor = ZomEnemy;

ZomEnemy.prototype.updateMovement = function(player){


   // game.physics.arcade.moveToObject(this, player, 50);


    if(this.timeTillAttack < this.game.time.totalElapsedSeconds()){
        this.canAttack = true;
    }else{
        this.canAttack = false;
    }

    if(this.lastPathed < this.game.time.now){
        this.lastPathed = this.game.time.now + this.pathingDelay;
        this.findNewPath(player);
    }

    switch(this.direction){
        case "Up":
            this.body.velocity.y = -this.moveSpeed;
            this.body.velocity.x = 0;
            break;
        case "Up Right":
            this.body.velocity.y = -this.moveSpeed;
            this.body.velocity.x = +this.moveSpeed;
            break;
        case "Right":
            this.body.velocity.x = this.moveSpeed;
            this.body.velocity.y= 0;
            break;
        case "Down Right":
            this.body.velocity.y = this.moveSpeed;
            this.body.velocity.x = this.moveSpeed;
            break;
        case "Down":
            this.body.velocity.y = this.moveSpeed;
            this.body.velocity.x = 0;
            break;
        case "Down Left":
            this.body.velocity.y = this.moveSpeed;
            this.body.velocity.x = -this.moveSpeed;
            break;
        case "Left":
            this.body.velocity.x = -this.moveSpeed;
            this.body.velocity.y = 0;
            break;
        case "Up Left":
            this.body.velocity.y = -this.moveSpeed;
            this.body.velocity.x = -this.moveSpeed;
            break;

    }

};

ZomEnemy.prototype.findNewPath = function(player) {

    this.xTile = Math.floor(this.body.position.x / 40);
    this.yTile = Math.floor(this.body.position.y / 40);
    this.playerXTile = Math.floor(player.body.position.x / 40);
    this.playerYTile = Math.floor(player.body.position.y / 40);

    this.gridBackup = this.grid.clone();

    this.path = this.finder.findPath(this.xTile, this.yTile, this.playerXTile, this.playerYTile, this.gridBackup);

    if (this.path != null && this.path.length > 0) {


            this.newTileX = (this.path[1][0] * 40) - 20;
            this.newTileY = (this.path[1][1] * 40) - 20;

            this.xTile = this.body.position.x - 20;
            this.yTile = this.body.position.y - 20;

            if (this.xTile == this.newTileX && this.yTile > this.newTileY) {
                this.direction = "Up";
            } else if (this.xTile < this.newTileX && this.yTile > this.newTileY) {
                this.direction = "Up Right";
            } else if (this.xTile < this.newTileX && this.yTile == this.newTileY) {
                this.direction = "Right";
            } else if (this.xTile < this.newTileX && this.yTile < this.newTileY) {
                this.direction = "Down Right";
            } else if (this.xTile == this.newTileX && this.yTile < this.newTileY) {
                this.direction = "Down";
            } else if (this.xTile > this.newTileX && this.yTile < this.newTileY) {
                this.direction = "Down Left";
            } else if (this.xTile > this.newTileX && this.yTile == this.newTileY) {
                this.direction = "Left";
            } else if (this.xTile > this.newTileX && this.yTile > this.newTileY) {
                this.direction = "Up Left";
            }

            console.log(this.direction);

    }


};
