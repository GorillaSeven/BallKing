const GameModel = require('GameModel');
var BrickType = {
    BOX:1,
    CIRCLE:2,
    TRIANGLE:3,
    CLONE:4
};
cc.Class({
    extends: cc.Component,

    properties: {
        ballCtrl:require('BallCtrl'),
        brickCtrl:require('BrickCtrl'),
        gameView:require('GameView'),
        overPanel:require('OverPanel'),
        rankView:require('RankView'),
        _Gravity:0,
        _IsFirstIn:true,
        trackLineStartPosX:0,
        trackLineStartPosY:0,
        trackLayout:cc.Layout
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.physicsManager = cc.director.getPhysicsManager();
        this.gameModel = new GameModel();
        this.startGame();
    },

    startGame(){
        this.init();
    },

    resetGame(){
        this.physicsManager.enabled = true;
        this.gameModel.init();
        this.BRICKTYPE = BrickType;
        this._Gravity = 9.8;
        this.ballIndex = 0;

        this.startPos = cc.p(this.trackLineStartPosX, this.trackLineStartPosY);  //开始位置  
        this.endPos = cc.p(0, 0);    //结束位置  
        this.touchPos = cc.p(0,0);
        this.trackSprites = [];      //装轨迹点

        this.shootPos = cc.v2(0,0);

        //轨迹不显示  
        this.trackLayout.node.active = false; 
        this.gameView.init(this);
        this.ballCtrl.init(this);
        this.brickCtrl.reset();
        this.overPanel.init(this);
        

        this.onTouch();
        this.gameView.updateBall(this.gameModel._ballNum);
    },

    init(){
        this.physicsManager.enabled = true;
        this.gameModel.init();
        this.BRICKTYPE = BrickType;
        this._Gravity = 9.8;
        this.ballIndex = 0;

        this.startPos = cc.p(this.trackLineStartPosX, this.trackLineStartPosY);  //开始位置  
        this.endPos = cc.p(0, 0);    //结束位置  
        this.touchPos = cc.p(0,0);
        this.trackSprites = [];      //装轨迹点

        this.shootPos = cc.v2(0,0);

        //轨迹不显示  
        this.trackLayout.node.active = false; 
        this.gameView.init(this);
        this.ballCtrl.init(this);
        this.brickCtrl.init(this);
        this.overPanel.init(this);
        this.rankView.init(this);

        this.onTouch();
        this.gameView.updateBall(this.gameModel._ballNum);
    },

    addBall(){
        this.gameModel._ballNum++;
    },

    resetNewRound(){
        /*
        1.获取最高的砖块是否到达deadline
        2.设置可点击
        3.设置小球重置颜色
        4.添加轮数
        5.更新砖块的位置
        6.创建初始化新的砖块
        */
       this.updateColor();
       this.gameModel._riseCount++;
       this.gameModel.updateRandHpConfig();
       this.brickCtrl.riseUpdatePos();
       this.gameView.updateBall(this.gameModel._ballNum);
       this.ballIndex = 0;
       let maxTopBrickPosY = this.brickCtrl.getMaxTopBrickPosY();
       if(maxTopBrickPosY >= this.gameModel._deadLineY){
            //游戏结束 弹出结束窗口
            this.gameOver();
            return;
       }
       this.onTouch();
    },

    onTouch(){
        //触摸开始事件  
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //触摸移动事件 
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        //触摸结束事件  
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    offTouch(){
        //触摸开始事件  
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //触摸移动事件 
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        //触摸结束事件  
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    updateColor(){
        this.ballCtrl.resetColor();
    },

    onTouchStart(event){
        this.removeTrackSprites();
        this.touchPos = cc.p(event.getLocation().x,event.getLocation().y);
        if(this.touchPos.y < this.trackLineStartPosY){
            this.drawTrack();
        }
    },

    onTouchMove(event){
        this.removeTrackSprites();
        this.touchPos = cc.p(event.getLocation().x,event.getLocation().y);
        if(this.touchPos.y < this.trackLineStartPosY){
            this.drawTrack();
        }
    },

    onTouchEnd(event){
        this.trackLayout.node.active = false; 
        this.removeTrackSprites();
        this.endPos = cc.p(event.getLocation().x,event.getLocation().y);
        this.calculatePowerPos();
        if(this.touchPos.y < this.trackLineStartPosY){
            this.offTouch();
            if(this._IsFirstIn){
                this._IsFirstIn = false;
            }
            this.shootPos = (this.endPos.sub(this.startPos));  
            this.ballCtrl.startShoot(this.shootPos.x*this.gameModel._startSpeedRate,this.shootPos.y*this.gameModel._startSpeedRate);
        }
       
    },
    //  
    calculatePowerPos(){
        let k = (this.endPos.y - this.trackLineStartPosY)/(this.endPos.x-this.trackLineStartPosX);
        let n = this.endPos.y - k*this.endPos.x;
        let curLen = Math.sqrt(Math.pow((this.endPos.y - this.trackLineStartPosY),2)+Math.pow((this.endPos.x-this.trackLineStartPosX),2));

        if(this.gameModel._startSpeedPowerLen > curLen){
            let distance = this.gameModel._startSpeedPowerLen - curLen;
            if(distance > 150){
                this.gameModel._startSpeedRate = 10;
            }
            else if(distance > 100){
                this.gameModel._startSpeedRate = 8;
            }
            else if(distance > 50){
                this.gameModel._startSpeedRate = 6;
            }
            else if(distance > 25){
                this.gameModel._startSpeedRate = 4;
            }
        }
        else{
            let distance = curLen - this.gameModel._startSpeedPowerLen;
            if(distance > 200){
                this.gameModel._startSpeedRate = 2;
            }
            else if(distance > 150){
                this.gameModel._startSpeedRate = 2.5;
            }
            else if(distance > 100){
                this.gameModel._startSpeedRate = 3;
            }
            else if(distance > 50){
                this.gameModel._startSpeedRate = 3.5;
            }
        }
    },

    //移除轨迹点  
    removeTrackSprites() {  
        for (i = 0; i < this.trackSprites.length; i++ ) {  
            let trackSprite = this.trackSprites[i];  
            if (trackSprite) {  
                trackSprite.removeFromParent();  
            }  
        }  
    }, 

    onBallContactBrick(ballNode,brickNode){
        //区分克隆还是砖块
        switch(brickNode.TAG){
            case BrickType.BOX:
            case BrickType.CIRCLE:
            case BrickType.TRIANGLE:
                brickNode.getComponent('Brick').reduceLife();
                this.updateScore();
                break;
            case BrickType.CLONE:
                this.ballCtrl.createBall(ballNode.x,ballNode.y,cc.v2(45,45));
                brickNode.getComponent('Brick').reduceLife();
                break;
        }
    },

    updateScore(){
        this.gameModel._score++;
        this.gameView.updateScore(this.gameModel._score);
    },

      //绘制轨迹路线  
      drawTrack: function () {  
        this.trackLayout.node.active = true;  
        this.trackLayout.node.setPosition(this.startPos);  
        let distance = cc.pDistance(this.startPos, this.touchPos);  
        //获得轨迹点  
        this.trackSprite = this.trackLayout.node.getChildByName("shootSprite");  
          
        //轨迹点数量  
        let trackNum = Math.floor(distance / (this.trackSprite.width + this.trackLayout.spacingX));  
          
        for (i = 1; i < trackNum; i++) {  
            //克隆轨迹点  
            let trackSpriteTemplate = cc.instantiate(this.trackSprite);  
            this.trackLayout.node.addChild(trackSpriteTemplate);  
            this.trackSprites.push(trackSpriteTemplate);  
        }  
        //向量差计算,结束点-开始点，向量的指向是朝着结束点  
        var posSub = this.touchPos.sub(this.startPos);  
        //向量的角度计算，cc.pToAngle是获得弧度值，角度 = 弧度/PI*180  
        var angle = cc.pToAngle(posSub) / Math.PI * 180;  
        //rotation 是逆时针旋转的，在角度添加负号才正确  
        this.trackLayout.node.rotation = -angle;  
    },  

    gameOver(){
        this.offTouch();
        this.physicsManager.enabled = false;
        this.overPanel.show(this.gameModel._score);
    },

    ontest(){
        this.ballCtrl.startShoot(600,-600);
    },
});
