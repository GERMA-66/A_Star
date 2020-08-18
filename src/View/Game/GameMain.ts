class GameMain extends egret.Sprite {

    private _bg: egret.Shape;

    private _player: Player;//玩家

    private _endGrid: Grid;

    public constructor() {
        super();

        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onRemoveFromStage(e: egret.Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        GameMainEvent.instance.removeEventListener(GameMainEvent.TOUCH_GRID, this.touchGridHandler, this);
        this._bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGridState, this);
    }

    private onAddToStage(e: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        this.init();


        GameMainEvent.instance.addEventListener(GameMainEvent.TOUCH_GRID, this.touchGridHandler, this);
        this._bg.touchEnabled = true;
        this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGridState, this);
    }

    private init(): void {
        this.createGameBg();

        this.createGameMap();

        this.createPlayer();

    }

    private createGameBg(): void {
        this._bg = new egret.Shape();
        this._bg.graphics.beginFill(0xe5d6b6);
        this._bg.x = this._bg.y = 0;
        this._bg.graphics.drawRect(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        this._bg.graphics.endFill();
        this.addChild(this._bg);
    }

    private createGameMap(): void {
        Global.instance.mapArr = [];
        Global.instance.canUsePoint = [];
        for (let i = 0; i < Global.instance.mapRow; i++) {
            Global.instance.mapArr[i] = [];
            for (let j = 0; j < Global.instance.mapCol; j++) {
                Global.instance.mapArr[i][j] = new Grid(i, j);
                this.addChild(Global.instance.mapArr[i][j]);
                Global.instance.mapArr[i][j].anchorOffsetX = Global.instance.mapArr[i][j].width / 2;
                Global.instance.mapArr[i][j].anchorOffsetY = Global.instance.mapArr[i][j].height / 2;
                Global.instance.mapArr[i][j].x = j * (Global.instance.mapWidth + Global.instance.mapOffset) + Global.instance.mapStartOffsetPos;
                Global.instance.mapArr[i][j].y = i * (Global.instance.mapHeight + Global.instance.mapOffset) + Global.instance.mapStartOffsetPos;

                if (!Global.instance.mapArr[i][j].isObnstacle) {
                    var point: egret.Point = new egret.Point();
                    point.x = i;
                    point.y = j;
                    Global.instance.canUsePoint.push(point);
                }
            }
        }
    }

    private createPlayer(): void {
        this._player = new Player();
        this.addChild(this._player);
        var idx: number = Math.floor(Math.random() * Global.instance.canUsePoint.length);
        var point: egret.Point = Global.instance.canUsePoint[idx];
        this._player.x = Global.instance.mapArr[point.x][point.y].x;
        this._player.y = Global.instance.mapArr[point.x][point.y].y;
    }

    private _indx: number = 0;
    private _x: number = 0;
    private _y: number = 0;
    private _time: number = 0;

    private touchGridHandler(e: egret.Event): void {


        var grid: Grid = e.data;

        this._endGrid = grid;

        this.move();

        // egret.log(Global.instance.openPosArr);

        // this.setOpenArr(grid.point.x, grid.point.y);

        // var gridPos: egret.Point = Global.instance.positionChangeIndex(grid.x, grid.y);
        // console.log(gridPos);

        // this._player.x = grid.x;
        // this._player.y = grid.y;


    }


    private resetGridState(): void {
        Global.instance.openPosArr.length = 0;
        egret.Tween.removeTweens(this._player);
        egret.clearInterval(this._time);
        for (var v of Global.instance.canUsePoint) {
            Global.instance.mapArr[v.x][v.y].state = EnumGridState.CAN_USED;
            Global.instance.mapArr[v.x][v.y].g = 0;
            Global.instance.mapArr[v.x][v.y].h = 0;
            Global.instance.mapArr[v.x][v.y].rank = 0;
            Global.instance.mapArr[v.x][v.y].distance = 0;
            Global.instance.mapArr[v.x][v.y].parent = null;
            Global.instance.mapArr[v.x][v.y].pathVis = false;
        }
    }

    private move(): void {
        this.resetGridState();

        var playerPos: egret.Point = Global.instance.positionChangeIndex(this._player.x, this._player.y);
        var playerGrid: Grid = Global.instance.mapArr[playerPos.x][playerPos.y];
        Global.instance.dfs(playerGrid, this._endGrid, true);

        var arr: Grid[] = Global.instance.openPosArr;
        /**测试代码 */
        for (var i = 0; i < arr.length; i++) {
            arr[i].rank = i + 1;
            arr[i].pathVis = true;
        }
        if (arr.length > 0) {
            this._indx = 0;
            this._x = arr[this._indx].x
            this._y = arr[this._indx].y;
            // egret.log(this._x, this._y);

            this._time = egret.setInterval(() => {
                egret.Tween.get(this._player).to({
                    x: this._x,
                    y: this._y
                }, 100).call(() => {
                    // egret.log(this._x, this._y);
                    this._indx++;
                    if (!arr[this._indx] || (playerPos.x == this._endGrid.i && playerPos.y == this._endGrid.j)) {
                        egret.clearInterval(this._time);
                        return;
                    }
                    this._x = arr[this._indx].x
                    this._y = arr[this._indx].y;
                    // this.move();
                }, this);
            }, this, 101);
        }
    }

}