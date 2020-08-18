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
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this._cellSize = 50;
        _this.startTime = 0;
        _this.makePlayer();
        _this.makeGrid();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, function () {
            _this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onGridClick, _this);
        }, _this);
        return _this;
    }
    /**
     * Creates the player sprite. Just a circle here.
     */
    Game.prototype.makePlayer = function () {
        this._player = new egret.Sprite();
        this._player.graphics.beginFill(0xff0000);
        this._player.graphics.drawCircle(0, 0, 5);
        this._player.graphics.endFill();
        this._player.x = Math.random() * 600;
        this._player.y = Math.random() * 600;
        this.addChild(this._player);
    };
    /**
     * Creates a grid with a bunch of random unwalkable nodes.
     */
    Game.prototype.makeGrid = function () {
        this._grid = new astar.Grid(30, 30);
        for (var i = 0; i < 200; i++) {
            this._grid.setWalkable(Math.floor(Math.random() * 30), Math.floor(Math.random() * 30), false);
        }
        this.drawGrid();
        // for(let m =0; m<30;m++){
        // 	for(let n=0;n<30;n++){
        // 		console.log( (this._grid.getNode(m, n).walkable== true)?1:0);
        // 	}
        // 	console.log("===");
        // }
    };
    /**
     * Draws the given grid, coloring each cell according to its state.
     */
    Game.prototype.drawGrid = function () {
        this.graphics.clear();
        for (var i = 0; i < this._grid.numCols; i++) {
            for (var j = 0; j < this._grid.numRows; j++) {
                var node = this._grid.getNode(i, j);
                // this.graphics.lineStyle(0);
                // this.graphics.beginFill(this.getColor(node));
                // this.graphics.drawRect(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize);
                var sp = new egret.Sprite();
                sp.graphics.beginFill(this.getColor(node));
                sp.graphics.drawRect(0, 0, this._cellSize, this._cellSize);
                sp.graphics.endFill();
                sp.x = i * this._cellSize;
                sp.y = j * this._cellSize;
                this.addChild(sp);
            }
        }
        this.addChild(this._player);
    };
    /**
     * Determines the color of a given node based on its state.
     */
    Game.prototype.getColor = function (node) {
        if (!node.walkable)
            return 0;
        if (node == this._grid.startNode)
            return 0xcccccc;
        if (node == this._grid.endNode)
            return 0xcccccc;
        return 0xffffff;
    };
    /**
     * Handles the click event on the GridView. Finds the clicked on cell and toggles its walkable state.
     */
    Game.prototype.onGridClick = function (event) {
        var xpos = Math.floor(event.stageX / this._cellSize);
        var ypos = Math.floor(event.stageY / this._cellSize);
        this._grid.setEndNode(xpos, ypos);
        xpos = Math.floor(this._player.x / this._cellSize);
        ypos = Math.floor(this._player.y / this._cellSize);
        this._grid.setStartNode(xpos, ypos);
        this.drawGrid();
        this.startTime = egret.getTimer();
        this.findPath();
        console.log("耗时:", egret.getTimer() - this.startTime);
    };
    /**
     * Creates an instance of AStar and uses it to find a path.
     */
    Game.prototype.findPath = function () {
        var aStar = new astar.AStar();
        if (aStar.findPath(this._grid)) {
            this._path = aStar.path;
            this._index = 0;
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    };
    /**
     * Finds the next node on the path and eases to it.
     */
    Game.prototype.onEnterFrame = function (event) {
        var targetX = this._path[this._index].x * this._cellSize + this._cellSize / 2;
        var targetY = this._path[this._index].y * this._cellSize + this._cellSize / 2;
        var dx = targetX - this._player.x;
        var dy = targetY - this._player.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
            this._index++;
            if (this._index >= this._path.length) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        }
        else {
            this._player.x += dx * .5;
            this._player.y += dy * .5;
        }
    };
    return Game;
}(egret.Sprite));
__reflect(Game.prototype, "Game");
