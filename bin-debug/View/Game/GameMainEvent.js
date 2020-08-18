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
var GameMainEvent = (function (_super) {
    __extends(GameMainEvent, _super);
    function GameMainEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GameMainEvent, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new GameMainEvent();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    GameMainEvent.TOUCH_GRID = "TOUCH_GRID";
    return GameMainEvent;
}(egret.EventDispatcher));
__reflect(GameMainEvent.prototype, "GameMainEvent");
//# sourceMappingURL=GameMainEvent.js.map