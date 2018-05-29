cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        ballLabel:cc.Label
    },

    init(gameCtrl){
        this.gameCtrl = gameCtrl;
        this.scoreLabel.string = '0';
        this.ballLabel.string = '0';
    },

    updateScore(score){
        this.scoreLabel.string = score;
    },

    updateBall(ballCount){
        this.ballLabel.string = ballCount;
    }
});
