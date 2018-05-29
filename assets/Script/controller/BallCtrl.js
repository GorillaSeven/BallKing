cc.Class({
    extends: cc.Component,

    properties: {
       ball:cc.Prefab,
       shootTimeInterval:0,
    },

    init(gameCtrl){
        this.clearBall();
        this.gameCtrl = gameCtrl;
        this.ballNodeArray = [];
        this.ballScriptArray = [];
        this.createBall(300,780,cc.v2(0,0));
    },
    clearBall(){
        if(this.ballNodeArray){
            if(this.ballNodeArray.length>0){
                for(let i = 0;i<this.ballNodeArray.length;i++){
                    this.ballNodeArray[i].removeFromParent();
                }
            }
        }
    },

    //创建一个小球的节点，并加入场景中，给一个反弹的速度
    createBall(x,y,velocity)
    {
        let ballNode = cc.instantiate(this.ball);
        ballNode.parent = this.node;
        ballNode.x = x;
        ballNode.y = y;
        ballNode.getComponent(cc.RigidBody).linearVelocity = velocity;
        let ballScript = ballNode.getComponent('Ball');
        ballScript.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
        ballScript.init(this.gameCtrl);
        this.ballNodeArray.push(ballNode);
        this.ballScriptArray.push(ballScript);
        this.gameCtrl.addBall();//添加小球计数
    },

    //起始玩家确定方向后，发射所有的ball
    startShoot(x,y){
        this.gameCtrl.ballIndex = 0;
        let self = this; 
        let ballNum = this.gameCtrl.gameModel._ballNum;
        for(let i = 0;i<this.ballNodeArray.length;i++){
            this.scheduleOnce(function(){
                self.ballScriptArray[i].shoot(x,y);
                ballNum--;
                self.gameCtrl.gameView.updateBall(ballNum);
            },this.shootTimeInterval*i);
        }
    },

    resetColor(){
        this.gameCtrl.ballIndex = 0; 
        for(let i = 0;i<this.ballNodeArray.length;i++){
            this.ballNodeArray[i].getChildByName('ballSpr').color = cc.Color.WHITE;
        }
    },

});
