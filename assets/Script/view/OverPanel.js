cc.Class({
    extends: cc.Component,

    properties: {
       scoreLabel:cc.Label
    },

    init(gameCtrl){
        this.gameCtrl = gameCtrl;
        this.node.active = false;
    },

    show(score){
        this.node.active = true;
        this.scoreLabel.string = score +"";
    },

    onBtnReStart(){
        this.gameCtrl.resetGame();
    }
});
