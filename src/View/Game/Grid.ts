/**
 * 格子的状态
 */
enum EnumGridState {
    /**玩家所占的 */
    PLAYER_USED,
    /**可以使用 */
    CAN_USED,
    /**正在被使用 */
    USING,
    /**已经被使用 */
    USED,
    /**禁止使用 */
    NOT_USED
}
class Grid extends egret.Sprite {

    private _i: number;
    private _j: number;

    private _state: EnumGridState;

    private _parent: Grid;

    private _f: number = 0;
    private _g: number = 0;
    private _h: number = 0;

    private _distance: number;
    private _rank: number = 0;

    // private _txt: egret.TextField;
    // private _gTxt: egret.TextField;
    // private _hTxt: egret.TextField;
    // private _fTxt: egret.TextField;
    private _isObstacle: boolean = false;
    private _path: egret.Shape;
    private _rankTxt: egret.TextField;
    public constructor(i: number, j: number) {
        super();
        this._i = i;
        this._j = j;
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }


    private onRemoveFromStage(e: egret.Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);

        if (this._isObstacle) {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        }
    }

    private onAddToStage(e: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        var p: number = Math.random() * 100;
        if (p <= 30) {
            this._isObstacle = true;
            this._state = EnumGridState.NOT_USED;
        } else {
            this._state = EnumGridState.CAN_USED;
            this._isObstacle = false;
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        }

        this.init();
    }


    private init(): void {
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
    }

    private touchHandler(e: egret.TouchEvent): void {
        console.log(this._i, this._j);

        GameMainEvent.instance.dispatchEventWith(GameMainEvent.TOUCH_GRID, false, this);

    }


    public get isObnstacle(): boolean { return this._isObstacle; }
    public get i(): number { return this._i; }
    public get j(): number { return this._j; }

    public set state(value: EnumGridState) { this._state = value; }
    public get state(): EnumGridState { return this._state; }

    public set parent(value: Grid) { this._parent = value; }
    public get parent(): Grid { return this._parent; }

    public set g(value: number) {
        this._g = value;
        // this._gTxt.text = this._g + "";
    }
    public get g(): number { return this._g; }

    public set h(value: number) {
        this._h = value;
        // this._hTxt.text = this._h + "";
        this.setF();
    }
    public get h(): number { return this._h; }

    private setF(): void {
        this._f = this._g + this._h;
        // this._fTxt.text = this._f + "";
    }
    public get f(): number { return this._f; }

    public set pathVis(value: boolean) { this._path.visible = value; }
    public get pathVis(): boolean { return this._path.visible; }

    public set rank(value: number) { this._rank = value; this._rankTxt.text = this._rank + ""; this._rankTxt.visible = value != 0 }
    public get rank(): number { return this._rank; }

    public set distance(value: number) { this._distance = value; }
    public get distance(): number { return this._distance; }

    private debugging(): void {
        this._path = new egret.Shape();
        this.addChild(this._path);
        this._path.graphics.beginFill(0xCCCCCC);
        this._path.graphics.drawCircle(25, 25, Global.instance.mapWidth / 5)
        this._path.graphics.endFill();
        this._path.visible = false;

        this._rankTxt = new egret.TextField();
        this._rankTxt.size = 16;
        this._rankTxt.y = 25 - 5;
        this._rankTxt.x = 25 - 5;
        this._rankTxt.textColor = this._isObstacle ? 0xfc2a2a : 0x2484fe;
        this._rankTxt.text = this._rank + "";
        this.addChild(this._rankTxt);
    }

}