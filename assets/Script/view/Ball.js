cc.Class({
    extends: cc.Component,

    properties: {
        _directionX:0,
        _directionY:0,
        _isRight:false,
        _isAdd:false,
    },

    init(gameCtrl){
        this.gameCtrl = gameCtrl;
        this.ballIndex = 0;
        this._isAdd = false;
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                this.getComponent(cc.PhysicsCollider).restitution = 0.8;
                break;
            case 3://球碰到border
            case 7://球碰到上面板的下面一部分
                this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                this.getComponent(cc.PhysicsCollider).restitution = 0.8;
                break;
        }
    },
    onPostSolve(contact, self, other){
        let velocity  = cc.v2(0,0);
        switch (other.tag) {
            case 1://球碰到砖块
                {
                    let value =  this.getComponent(cc.PhysicsCollider).restitution;
                    this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                    this.getComponent(cc.PhysicsCollider).restitution = 0.8;
                    this.gameCtrl.onBallContactBrick(self.node,other.node);
                    break;
                }
               
            case 2://球碰到左边地面
                {
                    this._isRight = false;
                    self.node.getChildByName('ballSpr').color = cc.Color.YELLOW;
                    this.getComponent(cc.PhysicsCollider).restitution = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);//初始化速度
                    this.getComponent(cc.RigidBody).gravityScale = 0;
                    this.getComponent(cc.RigidBody).angularVelocity = -30;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(-600,0);
                    break;
                }
            case 3://球碰到border
            case 7://球碰到上面板的下面一部分
                {
                    this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                    this.getComponent(cc.PhysicsCollider).restitution = 0.8;
                    break;
                }
            case 4://球碰到墙
            case 8://球碰到border外部
                {
                    this.getComponent(cc.RigidBody).gravityScale = 0;
                    this.getComponent(cc.RigidBody).angularVelocity = 90;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,2000);
                    break;
                }
            case 5://球碰到右边地面
                {
                    this._isRight = true;
                    self.node.getChildByName('ballSpr').color = cc.Color.YELLOW;
                    this.getComponent(cc.PhysicsCollider).restitution = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);//初始化速度
                    this.getComponent(cc.RigidBody).gravityScale = 0;
                    this.getComponent(cc.RigidBody).angularVelocity = 30;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(600,0);
                    break;
                }
             case 6://球碰到上边左边界
                {
                    this.getComponent(cc.PhysicsCollider).restitution = 0;
                    this.getComponent(cc.RigidBody).gravityScale = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                    this.getComponent(cc.RigidBody).angularVelocity = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(30,0);
                    this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                    this.getComponent(cc.RigidBody).angularVelocity = -30;
                    if(!this._isAdd){
                        this._isAdd = true;
                        this.gameCtrl.ballIndex++;
                        if((this.gameCtrl.ballIndex === this.gameCtrl.gameModel._ballNum) && !this.gameCtrl._IsFirstIn){
                            this.gameCtrl.resetNewRound();
                        }
                    }
                    break;
                }
            case 9://球碰到上边右边界
                {
                    this.getComponent(cc.PhysicsCollider).restitution = 0;
                    this.getComponent(cc.RigidBody).gravityScale = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                    this.getComponent(cc.RigidBody).angularVelocity = 0;
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(-30,0);
                    this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                    this.getComponent(cc.RigidBody).angularVelocity = 30;
                    if(!this._isAdd){
                        this._isAdd = true;
                        this.gameCtrl.ballIndex++;
                        if((this.gameCtrl.ballIndex === this.gameCtrl.gameModel._ballNum) && !this.gameCtrl._IsFirstIn){
                            this.gameCtrl.resetNewRound();
                        }
                    }
                    break;
                }
        }
    },

    shoot(x,y){
        this._isAdd = false;
        this.targetPos = cc.p(0,0);
        this.getComponent(cc.RigidBody).enabledContactListener = true;
        this.getComponent(cc.RigidBody).gravityScale = 0;
        this.getComponent(cc.PhysicsCollider).restitution = 0.8;
        this.getComponent(cc.RigidBody).linearDamping = 0;
        this.getComponent(cc.RigidBody).angularVelocity = 0;
        this.node.position = cc.v2(this.gameCtrl.trackLineStartPosX,this.gameCtrl.trackLineStartPosY);
        this._directionX = x;
        this._directionY = y;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this._directionX,this._directionY);//初始化速度 
    },

    update (dt) {
        if(this.node.position.y > 1000 && this.node.position.y < 1020){
            if(this._isRight){
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);//初始化速度
                this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                this.getComponent(cc.PhysicsCollider).restitution = 1;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(-100,0);
            }
            else{
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);//初始化速度
                this.getComponent(cc.RigidBody).gravityScale = this.gameCtrl._Gravity;
                this.getComponent(cc.PhysicsCollider).restitution = 1;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(100,0);
            }
        }
        else if(this.node.position.y > 1020){
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,-300);
        }

        
    },
});
