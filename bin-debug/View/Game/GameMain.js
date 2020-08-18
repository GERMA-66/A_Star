var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameMain = (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = _super.call(this) || this;
        _this._indx = 0;
        _this._x = 0;
        _this._y = 0;
        _this._time = 0;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GameMain.prototype.onRemoveFromStage = function (e) {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        GameMainEvent.instance.removeEventListener(GameMainEvent.TOUCH_GRID, this.touchGridHandler, this);
        this._bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGridState, this);
    };
    GameMain.prototype.onAddToStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
        GameMainEvent.instance.addEventListener(GameMainEvent.TOUCH_GRID, this.touchGridHandler, this);
        this._bg.touchEnabled = true;
        this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGridState, this);
    };
    GameMain.prototype.init = function () {
        this.createGameBg();
        this.createGameMap();
        this.createPlayer();
    };
    GameMain.prototype.createGameBg = function () {
        this._bg = new egret.Shape();
        this._bg.graphics.beginFill(0xe5d6b6);
        this._bg.x = this._bg.y = 0;
        this._bg.graphics.drawRect(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        this._bg.graphics.endFill();
        this.addChild(this._bg);
    };
    GameMain.prototype.createGameMap = function () {
        Global.instance.mapArr = [];
        Global.instance.canUsePoint = [];
        for (var i = 0; i < Global.instance.mapRow; i++) {
            Global.instance.mapArr[i] = [];
            for (var j = 0; j < Global.instance.mapCol; j++) {
                Global.instance.mapArr[i][j] = new Grid(i, j);
                this.addChild(Global.instance.mapArr[i][j]);
                Global.instance.mapArr[i][j].anchorOffsetX = Global.instance.mapArr[i][j].width / 2;
                Global.instance.mapArr[i][j].anchorOffsetY = Global.instance.mapArr[i][j].height / 2;
                Global.instance.mapArr[i][j].x = j * (Global.instance.mapWidth + Global.instance.mapOffset) + Global.instance.mapStartOffsetPos;
                Global.instance.mapArr[i][j].y = i * (Global.instance.mapHeight + Global.instance.mapOffset) + Global.instance.mapStartOffsetPos;
                if (!Global.instance.mapArr[i][j].isObnstacle) {
                    var point = new egret.Point();
                    point.x = i;
                    point.y = j;
                    Global.instance.canUsePoint.push(point);
                }
            }
        }
    };
    GameMain.prototype.createPlayer = function () {
        this._player = new Player();
        this.addChild(this._player);
        var idx = Math.floor(Math.random() * Global.instance.canUsePoint.length);
        var point = Global.instance.canUsePoint[idx];
        this._player.x = Global.instance.mapArr[point.x][point.y].x;
        this._player.y = Global.instance.mapArr[point.x][point.y].y;
    };
    GameMain.prototype.touchGridHandler = function (e) {
        var grid = e.data;
        this._endGrid = grid;
        this.move();
        // egret.log(Global.instance.openPosArr);
        // this.setOpenArr(grid.point.x, grid.point.y);
        // var gridPos: egret.Point = Global.instance.positionChangeIndex(grid.x, grid.y);
        // console.log(gridPos);
        // this._player.x = grid.x;
        // this._player.y = grid.y;
    };
    GameMain.prototype.resetGridState = function () {
        Global.instance.openPosArr.length = 0;
        egret.Tween.removeTweens(this._player);
        egret.clearInterval(this._time);
        for (var _i = 0, _a = Global.instance.canUsePoint; _i < _a.length; _i++) {
            var v = _a[_i];
            Global.instance.mapArr[v.x][v.y].state = EnumGridState.CAN_USED;
            Global.instance.mapArr[v.x][v.y].g = 0;
            Global.instance.mapArr[v.x][v.y].h = 0;
            Global.instance.mapArr[v.x][v.y].rank = 0;
            Global.instance.mapArr[v.x][v.y].distance = 0;
            Global.instance.mapArr[v.x][v.y].parent = null;
            Global.instance.mapArr[v.x][v.y].pathVis = false;
        }
    };
    GameMain.prototype.move = function () {
        var _this = this;
        this.resetGridState();
        var playerPos = Global.instance.positionChangeIndex(this._player.x, this._player.y);
        var playerGrid = Global.instance.mapArr[playerPos.x][playerPos.y];
        Global.instance.dfs(playerGrid, this._endGrid, true);
        var arr = Global.instance.openPosArr;
        /**测试代码 */
        for (var i = 0; i < arr.length; i++) {
            arr[i].rank = i + 1;
            arr[i].pathVis = true;
        }
        if (arr.length > 0) {
            this._indx = 0;
            this._x = arr[this._indx].x;
            this._y = arr[this._indx].y;
            // egret.log(this._x, this._y);
            this._time = egret.setInterval(function () {
                egret.Tween.get(_this._player).to({
                    x: _this._x,
                    y: _this._y
                }, 100).call(function () {
                    // egret.log(this._x, this._y);
                    _this._indx++;
                    if (!arr[_this._indx] || (playerPos.x == _this._endGrid.i && playerPos.y == _this._endGrid.j)) {
                        egret.clearInterval(_this._time);
                        return;
                    }
                    _this._x = arr[_this._indx].x;
                    _this._y = arr[_this._indx].y;
                    // this.move();
                }, _this);
            }, this, 101);
        }
    };
    return GameMain;
}(egret.Sprite));
__reflect(GameMain.prototype, "GameMain");
//# sourceMappingURL=GameMain.js.map