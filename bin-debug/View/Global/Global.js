var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Global = (function () {
    function Global() {
        this.mapCol = 20; //地图的列数
        this.mapRow = 20; //地图行数
        this.mapWidth = 50; //地图宽度
        this.mapHeight = 50; //地图高度
        this.mapOffset = 10; //地图之间间距
        this.mapStartOffsetPos = 50; //地图起点偏移位置
        this.playerR = 10; //玩家半径
        this.openPosArr = []; //路径列表
    }
    Object.defineProperty(Global, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new Global();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 左边转换成二维数组下标
     */
    Global.prototype.positionChangeIndex = function (x, y) {
        var index = new egret.Point(Math.floor((y - this.mapStartOffsetPos) / (this.mapWidth + this.mapOffset)), Math.floor((x - this.mapStartOffsetPos) / (this.mapHeight + this.mapOffset)));
        return index;
    };
    Global.prototype.dfs = function (grid, endGrid, isPop) {
        if (isPop === void 0) { isPop = false; }
        grid.state = EnumGridState.USING;
        this.setG(grid, endGrid);
        this.setH(grid, endGrid);
        this.setDistance(grid, endGrid);
        // egret.warn(grid.i, grid.j);
        var arr = this.getAllGrids(grid, endGrid);
        arr.sort(function (g1, g2) {
            return (g2.distance - g1.distance); //(g2.f - g1.f) &&
        });
        if ((grid.i == endGrid.i && grid.j == endGrid.j)) {
            return;
        }
        if (arr.length == 0) {
            var top = this.openPosArr.pop();
            if (!top) {
                egret.error("No Path");
                return;
            }
            this.dfs(top, endGrid, true);
        }
        else {
            var grid1 = arr.pop();
            if (isPop) {
                this.openPosArr.push(grid);
            }
            this.openPosArr.push(grid1);
            grid.state = EnumGridState.USED;
            this.dfs(grid1, endGrid);
        }
    };
    /**
     * 获取当前格子四周可以通过的格子
     * @param grid
     * @param targetGrid
     */
    Global.prototype.getAllGrids = function (grid, targetGrid) {
        var arr = [];
        for (var i = grid.i - 1; i <= grid.i + 1; i++) {
            for (var j = grid.j - 1; j <= grid.j + 1; j++) {
                if (i == grid.i && j == grid.j) {
                    continue;
                }
                if ((i == grid.i - 1 && (j == grid.j - 1 || j == grid.j + 1)) ||
                    (i == grid.i + 1 && (j == grid.j - 1 || j == grid.j + 1))) {
                    continue;
                }
                var nextGrid = this.nextGrid(i, j);
                if (nextGrid && nextGrid.state == EnumGridState.CAN_USED) {
                    this.setG(nextGrid, grid);
                    this.setH(nextGrid, targetGrid);
                    this.setDistance(nextGrid, targetGrid);
                    arr.push(nextGrid);
                }
            }
        }
        return arr;
    };
    Global.prototype.nextGrid = function (i, j) {
        if (this.exisit(i, j)) {
            return this.mapArr[i][j];
        }
    };
    Global.prototype.exisit = function (i, j) {
        return 0 <= i && i < this.mapArr.length && 0 <= j && j <= this.mapArr[i].length && this.mapArr[i][j] != null;
    };
    Global.prototype.setG = function (curGrid, targetGrid) {
        if ((curGrid.i == targetGrid.i - 1 && (curGrid.j == targetGrid.j + 1 || curGrid.j == targetGrid.j - 1)) ||
            ((curGrid.i == targetGrid.i + 1 && (curGrid.j == targetGrid.j + 1 || curGrid.j == targetGrid.j - 1)))) {
            curGrid.g = targetGrid.g + 14;
        }
        else {
            curGrid.g = targetGrid.g + 10;
        }
    };
    Global.prototype.setH = function (curGrid, targetGrid) {
        curGrid.h = Math.abs(curGrid.i - targetGrid.i) * 10 + Math.abs(curGrid.j - targetGrid.j) * 10;
    };
    Global.prototype.setDistance = function (curGrid, targetGrid) {
        var x = Math.abs(curGrid.i - targetGrid.i);
        var y = Math.abs(curGrid.j - targetGrid.j);
        curGrid.distance = Math.sqrt(x * x + y * y);
    };
    Global.prototype.sort = function () {
        this.openPosArr.sort(function (g1, g2) {
            return (g2.g - g1.g) && (g2.f - g1.f);
        });
    };
    return Global;
}());
__reflect(Global.prototype, "Global");
//# sourceMappingURL=Global.js.map