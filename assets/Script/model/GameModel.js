cc.Class({
    extends: cc.Component,

    properties: {
       _score:0,                      //分数
       _bricksNumber:0,               //格子数
       _ballNum:0,                    //小球数
       _riseCount:0,                  //游戏轮数（上升次数）
       _minRandHp:0,                  //随机产生的格子的血量值的最小值
       _maxRandHp:0,                  //随机产生的格子的血量值的最大值  依据游戏轮数的增加进行递增  
       _startSpeedRate:0,             //小球其实依据选择的方向提高其速度系数 
       _deadLineY:0,                  //游戏结束的线
       _RandomBrickNum:0,             //新生产的砖块的随机最大值   
       _startSpeedPowerLen:0,         //起始瞄准产生的力的长度 
    },

    init(){
        this._score = 0;
        this._bricksNumber = 0;
        this._ballNum = 0;
        this._riseCount = 0;
        this._minRandHp = 1;//最小1
        this._maxRandHp = 5;//最大5
        this._startSpeedRate = 3;
        this._deadLineY = 700;
        this._RandomBrickNum = 4;
        this._startSpeedPowerLen = 220;
    },

    addScore(score){
        this._score += score;
    },

    minusBrick(n){
        this._bricksNumber -= n;
    },

    isTouchTopLine(isTouched){
        this._touchTopLine = isTouched;
    },

    updateRiseCount(){
        this._riseCount += 1;

    },

    updateRandHpConfig(){
        switch(this._riseCount){
            case 5:
                this._minRandHp = 1;//最小1
                this._maxRandHp = 10;//最大5
                break;
            case 10:
                this._minRandHp = 3;//最小1
                this._maxRandHp = 15;//最大5
                break;
            case 15:
                this._minRandHp = 5;//最小1
                this._maxRandHp = 20;//最大5
                break;
            case 25:
                this._minRandHp = 8;//最小1
                this._maxRandHp = 25;//最大5
                break;
            case 30:
                this._minRandHp = 10;//最小1
                this._maxRandHp = 30;//最大5
                break;
            case 35:
                this._minRandHp = 12;//最小1
                this._maxRandHp = 65;//最大5
                break;
            case 40:
                this._minRandHp = 15;//最小1
                this._maxRandHp = 90;//最大5
                break;
            case 45:
                this._minRandHp = 17;//最小1
                this._maxRandHp = 120;//最大5
                break;
            case 55:
                this._minRandHp = 20;//最小1
                this._maxRandHp = 150;//最大5
                break;
            case 70:
                this._minRandHp = 22;//最小1
                this._maxRandHp = 200;//最大5
                break;
            case 90:
                this._minRandHp = 25;//最小1
                this._maxRandHp = 250;//最大5
                break;
        }
    },

});
