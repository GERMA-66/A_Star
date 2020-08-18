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
var MainModule = (function (_super) {
    __extends(MainModule, _super);
    function MainModule() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MainModule.prototype.onRemoveFromStage = function (e) {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    };
    MainModule.prototype.onAddToStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
    };
    MainModule.prototype.init = function () {
        this._view = new egret.Sprite();
        this.addChild(this._view);
        // this._view.addChild(new Game());
        this._view.addChild(new GameMain());
    };
    return MainModule;
}(egret.Sprite));
__reflect(MainModule.prototype, "MainModule");
//# sourceMappingURL=MainModule.js.map