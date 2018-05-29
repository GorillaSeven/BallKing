
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onStartClicked:function(){
        cc.director.loadScene("Game");
    },
});
