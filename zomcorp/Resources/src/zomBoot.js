var zomBoot = function(game){

};

zomBoot.prototype = {
    preload: function(){

    },
    create: function(){
        this.game.state.start('zomPreload');
    }
};