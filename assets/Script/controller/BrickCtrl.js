cc.Class({
    extends: cc.Component,

    
    properties: {
        boxBrickPrefab:cc.Prefab,           //矩形
        circleBrickPrefab:cc.Prefab,        //圆形
        triangleBrickPrefab:cc.Prefab,      //三角
        cloneBrickPrefab:cc.Prefab,         //克隆
        paddingY:0,
        startPosY:0,
        addDistanceY:0,                     //每轮往上增加多少0
        startBrickNum:0,                    //起始的总砖块数
        startCloneNum:0,                    //起始的Clone砖块数
        randomPosX1:0,
        randomPosX2:0,
        randomPosX3:0,
        randomPosX4:0,
        randomPosX5:0,
        randomPosX6:0,
    },

    init(gameCtrl){
        this.brickNodeMap = new Map();
        this.brickNodeMap.clear();
        this.brickNumber = 0;
        this.mapIndex = 0;
        this.isRising = false;
        
        this.Xposition = [this.randomPosX1,this.randomPosX2,this.randomPosX3,this.randomPosX4,this.randomPosX5,this.randomPosX6];

        this.gameCtrl = gameCtrl;
        let minHP = this.gameCtrl.gameModel._minRandHp;
        let maxHP = this.gameCtrl.gameModel._maxRandHp;
        //初始化三列
        let curMapIndex = this.mapIndex;
        this.addBricks(3,1,minHP,maxHP);
        this.setNewBrickPos(3,curMapIndex,0);
    },

    reset(){
        if(this.brickNodeMap){
        this.brickNodeMap.forEach(function (brickNode, key, map) {
                brickNode.getComponent("Brick")._HP = 0;
            });
        }
        this.brickNumber = 0;
        this.mapIndex = 0;
    },

    // LIFE-CYCLE CALLBACKS:
    //第一次进入游戏初始化的砖块的数量(克隆的数量受到限制)
    addBricks(brickNum,cloneNum,minHp,maxHp){
       this.brickNumber += brickNum;
       if(cloneNum>0){
            for(let i = 0;i<cloneNum;i++){
                this.buildBrick(this.gameCtrl.BRICKTYPE.CLONE,0);
            }
       }
       if((brickNum-cloneNum) > 0){
            for(let i = 0;i<brickNum-cloneNum;i++){
                let brickTypeTmp = parseInt(Math.random() * (3) + 1);
                let brickHP = parseInt(Math.random() * (maxHp-minHp) + minHp);
                this.buildBrick(brickTypeTmp,brickHP);
            }
       }
    },

    createNewBrickLayout(randBrickNum,minHp,maxHp){
        let randTotalNum  = 0;
        let randCloneNum  = 0;
        do{
            randTotalNum = parseInt(Math.random() * (randBrickNum) + 1);
            randCloneNum = parseInt(Math.random() * (2));
        }while(randTotalNum<randCloneNum)
        let curMapIndex = this.mapIndex;
        this.addBricks(randTotalNum,randCloneNum,minHp,maxHp);
        this.setNewBrickPos(randTotalNum,curMapIndex,0);
    },

    setNewBrickPos(newBrickNum,curMapIndex,yRate){
        let pos = this.producePoss(newBrickNum);
        let posIndex  = 0;
        for(let i = 0;i < newBrickNum;i++){
            this.brickNodeMap.get(curMapIndex).x = pos[posIndex];
            this.brickNodeMap.get(curMapIndex).y = this.startPosY + this.paddingY*yRate;
            posIndex++;
            curMapIndex++;
        }
    },

    buildBrick(brickType,hp){
        let brickNode = null;
        let randRotation = 0;
        let curRotation = 0; 
        switch(brickType){
            case this.gameCtrl.BRICKTYPE.BOX:
                brickNode = cc.instantiate(this.boxBrickPrefab);
                brickNode.getChildByName("HP").getComponent(cc.Label).string = hp+"";
                brickNode.getComponent("Brick").initLife(hp,this);
                randRotation = Math.floor(Math.random()*360);
                brickNode.rotation = randRotation;
                curRotation = brickNode.getChildByName("HP").rotation;
                brickNode.getChildByName("HP").rotation =curRotation - randRotation;
                brickNode.TAG = this.gameCtrl.BRICKTYPE.BOX;
                break;
            case this.gameCtrl.BRICKTYPE.CIRCLE:
                brickNode = cc.instantiate(this.circleBrickPrefab);
                brickNode.getChildByName("HP").getComponent(cc.Label).string = hp+"";
                brickNode.getComponent("Brick").initLife(hp,this);
                brickNode.TAG = this.gameCtrl.BRICKTYPE.CIRCLE;
                break;
            case this.gameCtrl.BRICKTYPE.TRIANGLE:
                brickNode = cc.instantiate(this.triangleBrickPrefab);
                brickNode.getChildByName("HP").getComponent(cc.Label).string = hp+"";
                brickNode.getComponent("Brick").initLife(hp,this);
                randRotation = Math.floor(Math.random()*360);
                brickNode.rotation = randRotation;
                curRotation = brickNode.getChildByName("HP").rotation;
                brickNode.getChildByName("HP").rotation = curRotation - randRotation;
                brickNode.TAG = this.gameCtrl.BRICKTYPE.TRIANGLE;
                break;
            case this.gameCtrl.BRICKTYPE.CLONE:
                brickNode = cc.instantiate(this.cloneBrickPrefab);
                brickNode.getComponent("Brick").initLife(1,this);
                brickNode.TAG = this.gameCtrl.BRICKTYPE.CLONE;
                break;
        }
        brickNode.parent = this.node;
        brickNode.KEY = this.mapIndex;
        this.brickNodeMap.set(this.mapIndex,brickNode);
        this.mapIndex++;
    },


    producePoss(num){
        let pos = [];
        let tempX = this.Xposition;
        let index = 0;
        let randSize = 6;
        while(index < num){
            let randNum = parseInt(Math.random() * randSize);
            pos.push(tempX[randNum]);
            let tempValue = tempX[randSize-1];
            tempX[randSize-1] = tempX[randNum];
            tempX[randNum] = tempValue;
            randSize--;
            index++;
        }
        return pos;
    },

    getMaxTopBrickPosY(){
        let maxPosY = 0;
        let nodeArray = [];
        this.brickNodeMap.forEach(function (brickNode, key, map) {
            nodeArray.push(brickNode.y);
        });

        if(nodeArray.length > 0){
            maxPosY = nodeArray[0];
            for(let j = i+1;j<nodeArray.length;j++){
                if(maxPosY<nodeArray[j]){
                    maxPosY = nodeArray[j];
                }
            }
        }
        return maxPosY+20;
    },

    reduceBrick(brickNode){
        this.brickNumber -= 1;
        brickNode.removeFromParent();
        this.brickNodeMap.delete(brickNode.KEY);
    },

    riseUpdatePos(){
       this.isRising = true;
    },

    update(dt){
        if(this.isRising){
            this.isRising = false;
            let self = this;
            this.brickNodeMap.forEach(function (brickNode, key, map) {
                let posY = brickNode.y;
                let posX = brickNode.x;
                brickNode.x = posX;
                brickNode.y =  posY + self.addDistanceY;
            });
            self.createNewBrickLayout(self.gameCtrl.gameModel._RandomBrickNum,self.gameCtrl.gameModel._minRandHp,self.gameCtrl.gameModel._maxRandHp);
        }
        
    }
});
