class Global {
    private static _instance: Global;

    public static get instance(): Global {
        if (!this._instance) {
            this._instance = new Global();
        }
        return this._instance;
    }

    public mapCol: number = 10;//地图的列数
    public mapRow: number = 10;//地图行数
    public mapWidth: number = 50;//地图宽度
    public mapHeight: number = 50;//地图高度
    public mapOffset: number = 10;//地图之间间距
    public mapStartOffsetPos: number = 50;//地图起点偏移位置

    public mapArr: Grid[][];

    public canUsePoint: egret.Point[];//可以使用的地图id

    public playerR: number = 10;//玩家半径

    public openPosArr: Grid[] = [];//路径列表


    /**
     * 左边转换成二维数组下标
     */
    public positionChangeIndex(x: number, y: number): egret.Point {
        var index: egret.Point = new egret.Point(
            Math.floor((y - this.mapStartOffsetPos) / (this.mapWidth + this.mapOffset)),
            Math.floor((x - this.mapStartOffsetPos) / (this.mapHeight + this.mapOffset))
        )
        return index;
    }


    public dfs(grid: Grid, endGrid: Grid, isPop: boolean = false): void {
        grid.state = EnumGridState.USING;
        this.setG(grid, endGrid);
        this.setH(grid, endGrid);
        this.setDistance(grid, endGrid);
        // egret.warn(grid.i, grid.j);
        var arr: Grid[] = this.getAllGrids(grid, endGrid);
        arr.sort((g1, g2) => {
            return (g2.distance - g1.distance);//(g2.f - g1.f) &&
        });

        if ((grid.i == endGrid.i && grid.j == endGrid.j)) {
            return;
        }

        if (arr.length == 0) {
            var top: Grid = this.openPosArr.pop();
            if (!top) {
                egret.error("No Path");
                return;
            }
            this.dfs(top, endGrid, true);
        } else {
            var grid1: Grid = arr.pop();
            if (isPop) {
                this.openPosArr.push(grid);
            }
            this.openPosArr.push(grid1);
            grid.state = EnumGridState.USED;
            this.dfs(grid1, endGrid);
        }

    }

    /**
     * 获取当前格子四周可以通过的格子
     * @param grid 
     * @param targetGrid 
     */
    private getAllGrids(grid: Grid, targetGrid: Grid): Grid[] {
        var arr: Grid[] = [];
        for (var i = grid.i - 1; i <= grid.i + 1; i++) {
            for (var j = grid.j - 1; j <= grid.j + 1; j++) {
                if (i == grid.i && j == grid.j) {//跳过首元素
                    continue;
                }
                if ((i == grid.i - 1 && (j == grid.j - 1 || j == grid.j + 1)) ||
                    (i == grid.i + 1 && (j == grid.j - 1 || j == grid.j + 1))) {
                    continue;
                }
                var nextGrid: Grid = this.nextGrid(i, j);
                if (nextGrid && nextGrid.state == EnumGridState.CAN_USED) {
                    this.setG(nextGrid, grid);
                    this.setH(nextGrid, targetGrid);
                    this.setDistance(nextGrid, targetGrid);
                    arr.push(nextGrid);
                }
            }
        }
        return arr;
    }
    private nextGrid(i, j): Grid {
        if (this.exisit(i, j)) {
            return this.mapArr[i][j];
        }
    }

    private exisit(i: number, j: number): boolean {
        return 0 <= i && i < this.mapArr.length && 0 <= j && j <= this.mapArr[i].length && this.mapArr[i][j] != null;
    }

    private setG(curGrid: Grid, targetGrid: Grid): void {
        if ((curGrid.i == targetGrid.i - 1 && (curGrid.j == targetGrid.j + 1 || curGrid.j == targetGrid.j - 1)) ||
            ((curGrid.i == targetGrid.i + 1 && (curGrid.j == targetGrid.j + 1 || curGrid.j == targetGrid.j - 1)))) {
            curGrid.g = targetGrid.g + 14;
        } else {
            curGrid.g = targetGrid.g + 10;
        }
    }
    private setH(curGrid: Grid, targetGrid: Grid): void {
        curGrid.h = Math.abs(curGrid.i - targetGrid.i) * 10 + Math.abs(curGrid.j - targetGrid.j) * 10;
    }

    private setDistance(curGrid: Grid, targetGrid: Grid): void {
        var x: number = Math.abs(curGrid.i - targetGrid.i);
        var y: number = Math.abs(curGrid.j - targetGrid.j);
        curGrid.distance = Math.sqrt(x * x + y * y);
    }

    public sort(): void {
        this.openPosArr.sort((g1, g2) => {
            return (g2.g - g1.g) && (g2.f - g1.f);
        });
    }
}