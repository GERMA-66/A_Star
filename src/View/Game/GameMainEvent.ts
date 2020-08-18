class GameMainEvent extends egret.EventDispatcher {

    private static _instance: GameMainEvent;
    public static get instance(): GameMainEvent {
        if (!this._instance) {
            this._instance = new GameMainEvent();
        }
        return this._instance;
    }

    public static readonly TOUCH_GRID: string = "TOUCH_GRID";
}