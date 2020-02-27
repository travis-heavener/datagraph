/*
* @inputToDisplay - the data that is displayed, in an array with arrays inside like this example
*   [ [1, 2], [2, 3], [3, 4] ]
* 
* @displayX and @displayY - the pop-up window width and height parameters
* 
* @trendline - any function that can take in a value for x, and return one for y. if a function is provided, the function is plotted over the
*   graph, keeping the existing data
* 
* @graphw and @graphh - the zoom-in of the graph, takes the width and divides by two, scaling the graph equally around the origin. example:
*   graphw = 4;
*   makes a graph with the maximum x-value shown 2, and the minimum shown is -2
* 
* -------------------------------------------------------
* 
* This project was made by Travis Heavener, Jan. 25, 2020
* 
* Being fully honest, I have no clue about how to make this protected with some form of license or Copyright, so just please be nice with
*   my project :) <3
*/

function DataGraph(inputToDisplay, displayX=600, displayY=600, trendline=null, graphw=null, graphh=null) {
    this.data = inputToDisplay;
    this.screenWidth = displayX === null ? 600 : displayX;
    this.screenHeight = displayY === null ? 600 : displayY;
    this.window = window.open("", "_blank", "width=" + this.screenWidth + ",height=" + this.screenHeight);
    this.graph = document.createElement("canvas");
    
    this.trendline = trendline;
    
    this.window.document.title = "Graph View " + this.screenWidth + "x" + this.screenHeight;
    
    this.graph.width = this.screenWidth;
    this.graph.height = this.screenHeight;
    with (this.window.document.documentElement.style) {
        padding = "0px";
        margin = "0px";
        overflowX = "hidden";
        overflowY = "hidden";
        backgroundColor = "beige";
    }
    
    with (this.window.document.body.style) {
        margin = "0px";
        padding = "0px";
    }
        
    this.window.document.body.appendChild(this.graph);
    
    this._graphw = graphw;
    this._graphh = graphh;
    
    //this.markerCount = markerCount;
    this.gridIntervalX = 0;
    this.gridIntervalY = 0;
    
    this.draw = function() {
        let ctx = this.graph.getContext("2d");
        const drawLine = (x1, y1, x2, y2, color) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 2;
            ctx.stroke();
        };
        
        const fillCircle = (centerX, centerY, radius, color) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
        }
        
        //methods end ----------------------------------------------
        
        let maxX = 0;
        let minX = 0;
        let maxY = 0;
        let minY = 0;
        
        for (let i in this.data) {
            if (this._graphw === null) {
                if (this.data[i][0] > maxX) {
                    maxX = this.data[i][0];
                } else if (this.data[i][0] < minX) {
                    minX = this.data[i][0];
                }
            } else {
                maxX = this._graphw/2;
                minX = -this._graphw/2;
            }
            
            if (this._graphh === null) {
                if (this.data[i][1] > maxY) {
                    maxY = this.data[i][1];
                } else if (this.data[i][1] < minY) {
                    minY = this.data[i][1];
                }
            } else {
                maxY = this._graphh/2;
                minY = -this._graphh/2;
            }
        }
        
        //console.log([maxX, minX, maxY, minY]);
        
        drawLine(0, this.screenHeight / 2, this.screenWidth, this.screenHeight / 2);
        drawLine(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);
        
        if (this._graphw === null) {
            this.gridIntervalX = (Math.abs(maxX) + Math.abs(minX)) * 2;
        } else {
            this.gridIntervalX = 8;
        }
        
        if (this._graphh === null) {
            this.gridIntervalY = (Math.abs(maxY) + Math.abs(minY)) * 2;
        } else {
            this.gridIntervalY = 8;
        }
        
        let radius = 3;
        let unitX = this.screenWidth / this.gridIntervalX;
        let unitY = this.screenHeight / this.gridIntervalY;
        
        for (let i in this.data) {
            let x = (this.screenWidth/2) + (this.data[i][0] * unitX);
            let y = this.screenHeight - (this.screenHeight/2) - (this.data[i][1] * unitY);
            fillCircle(x, y, radius, "mediumblue");
            //console.log([x, y]);
        }
        
        let points = 100;
        let trendUnitX = this.screenWidth / points;
        let trendUnitY = this.screenHeight / points;
        
        if (this.trendline != null) {
            for (let i = -points + 1; i < points; i++) {
                let x = (this.screenWidth/2) + (i * trendUnitX);
                let y = this.screenHeight - (this.screenHeight/2) - (this.trendline(i) * trendUnitY);
                fillCircle(x, y, 3, "red");
            }
        }
        
        let dimX = Math.abs(maxX) > Math.abs(minX) ? Math.abs(maxX) : Math.abs(minX);
        let dimY = Math.abs(maxY) > Math.abs(minY) ? Math.abs(maxY) : Math.abs(minY);
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "10px Tahoma Bold";
        ctx.fillText(dimX.toFixed(2), this.screenWidth - 15, (this.screenHeight / 2) + 10); //right label
        ctx.fillText((-dimX).toFixed(2), 10, (this.screenHeight / 2) + 10); //left label
        
        ctx.textAlign = "left";
        ctx.fillText(dimY.toFixed(2), (this.screenWidth / 2) + 15, 20); //top label
        ctx.fillText((-dimY).toFixed(2), (this.screenWidth / 2) + 15, this.screenHeight - 10); //bottom label
        
    }
    
    this.draw();
}