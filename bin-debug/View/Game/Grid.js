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
/**
 * 格子的状态
 */
var EnumGridState;
(function (EnumGridState) {
    /**玩家所占的 */
    EnumGridState[EnumGridState["PLAYER_USED"] = 0] = "PLAYER_USED";
    /**可以使用 */
    EnumGridState[EnumGridState["CAN_USED"] = 1] = "CAN_USED";
    /**正在被使用 */
    EnumGridState[EnumGridState["USING"] = 2] = "USING";
    /**已经被使用 */
    EnumGridState[EnumGridState["USED"] = 3] = "USED";
    /**禁止使用 */
    EnumGridState[EnumGridState["NOT_USED"] = 4] = "NOT_USED";
})(EnumGridState || (EnumGridState = {}));
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(i, j) {
        var _this = _super.call(this) || this;
        _this._f = 0;
        _this._g = 0;
        _this._h = 0;
        _this._rank = 0;
        // private _txt: egret.TextField;
        // private _gTxt: egret.TextField;
        // private _hTxt: egret.TextField;
        // private _fTxt: egret.TextField;
        _this._isObstacle = false;
        _this._i = i;
        _this._j = j;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Grid.prototype.onRemoveFromStage = function (e) {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        if (this._isObstacle) {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        }
    };
    Grid.prototype.onAddToStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var p = Math.random() * 100;
        if (p <= 30) {
            this._isObstacle = true;
            this._state = EnumGridState.NOT_USED;
        }
        else {
            this._state = EnumGridState.CAN_USED;
            this._isObstacle = false;
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        }
        this.init();
    };
    Grid.prototype.init = function () {
        this.graphics.beginFill(this._isObstacle ? 0x747474 : 0xffffff);
        this.graphics.drawRect(0, 0, Global.instance.mapWidth, Global.instance.mapHeight);
        this.graphics.endFill();
        /**测试代码 */
        // this._txt = new egret.TextField();
        // this._txt.size = 16;
        // this._txt.textColor = this._isObstacle ? 0xfc2a2a : 0x000000;
        // this._txt.text = this._i + "," + this._j;
        // this.addChild(this._txt);
        // this._gTxt = new egret.TextField();
        // this._gTxt.size = 16;
        // this._gTxt.y = 34;
        // this._gTxt.x = 0;
        // this._gTxt.textColor = this._isObstacle ? 0xfc2a2a : 0x000000;
        // this._gTxt.text = this._g + "";
        // this.addChild(this._gTxt);
        // this._hTxt = new egret.TextField();
        // this._hTxt.size = 16;
        // this._hTxt.y = 34;
        // this._hTxt.x = 30;
        // this._hTxt.textColor = this._isObstacle ? 0xfc2a2a : 0xe91a9e;
        // this._hTxt.text = this._h + "";
        // this.addChild(this._hTxt);
        // this._fTxt = new egret.TextField();
        // this._fTxt.size = 16;
        // this._fTxt.y = 0;
        // this._fTxt.x = 30;
        // this._fTxt.textColor = this._isObstacle ? 0xfc2a2a : 0x2484fe;
        // this._fTxt.text = this._f + "";
        // this.addChild(this._fTxt);
        this.debugging();
        this.width = Global.instance.mapWidth;
        this.height = Global.instance.mapHeight;
    };
    Grid.prototype.touchHandler = function (e) {
        console.log(this._i, this._j);
        GameMainEvent.instance.dispatchEventWith(GameMainEvent.TOUCH_GRID, false, this);
    };
    Object.defineProperty(Grid.prototype, "isObnstacle", {
        get: function () { return this._isObstacle; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "i", {
        get: function () { return this._i; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "j", {
        get: function () { return this._j; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "state", {
        get: function () { return this._state; },
        set: function (value) { this._state = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "parent", {
        get: function () { return this._parent; },
        set: function (value) { this._parent = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "g", {
        get: function () { return this._g; },
        set: function (value) {
            this._g = value;
            // this._gTxt.text = this._g + "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "h", {
        get: function () { return this._h; },
        set: function (value) {
            this._h = value;
            // this._hTxt.text = this._h + "";
            this.setF();
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.setF = function () {
        this._f = this._g + this._h;
        // this._fTxt.text = this._f + "";
    };
    Object.defineProperty(Grid.prototype, "f", {
        get: function () { return this._f; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "pathVis", {
        get: function () { return this._path.visible; },
        set: function (value) { this._path.visible = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "rank", {
        get: function () { return this._rank; },
        set: function (value) { this._rank = value; this._rankTxt.text = this._rank + ""; this._rankTxt.visible = value != 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "distance", {
        get: function () { return this._distance; },
        set: function (value) { this._distance = value; },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.debugging = function () {
        this._path = new egret.Shape();
        this.addChild(this._path);
        this._path.graphics.beginFill(0xCCCCCC);
        this._path.graphics.drawCircle(25, 25, Global.instance.mapWidth / 5);
        this._path.graphics.endFill();
        this._path.visible = false;
        this._rankTxt = new egret.TextField();
        this._rankTxt.size = 16;
        this._rankTxt.y = 25 - 5;
        this._rankTxt.x = 25 - 5;
        this._rankTxt.textColor = this._isObstacle ? 0xfc2a2a : 0x2484fe;
        this._rankTxt.text = this._rank + "";
        this.addChild(this._rankTxt);
    };
    return Grid;
}(egret.Sprite));
__reflect(Grid.prototype, "Grid");
