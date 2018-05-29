cc.Class({
    extends: cc.Component,

    properties: {
        _HP:0,                  //生命值
        lableHP:{
            type:cc.Label,
            default:null
        }
    },

    initLife(hp,brickCtrl){
        this._HP = hp;
        this.brickCtrl = brickCtrl;
    },

    dead(){
        if(this._HP <= 0){
            //this.node.parent = null;
            this.brickCtrl.reduceBrick(this.node);
        }
    },

    reduceLife(){
        this._HP -= 1;
        if(this.lableHP){
            this.lableHP.string = ""+this._HP;
        }
    },

    update (dt) {
        this.dead();
    },
});
