
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "d3/d3"
],
function(declare, domConstruct, d3) {
    
    return declare("LevelChart", null, {
        
        domNodeStyle: null,
        domNodeClass: null,
        margin: null,
        width: null,
        height: null,
        minLevel: null,
        maxLevel: null,
        level: null,
        color: null,
        xAxisLabel: null,
        yAxisLabel: null,
        yAxisAlignment: null, // 'left' or 'right'
        
        constructor: function(args) {
            this.domNodeStyle = "";
            this.domNodeClass = "";
            this.level = 0;
            this.minLevel = 0;
            this.maxLevel = 3;
            this.margin = {'top': 0, 'right': 0, 'bottom': 0, 'left': 0};
            this.width = 100;
            this.height = 100;
            this.color = "#000000";
            this.xAxisLabel = "x-axis";
            this.yAxisLabel = "y-axis";
            this.yAxisAlignment = "left";
            
            declare.safeMixin(this, args);

            this.range = this.maxLevel - this.minLevel;

            this.buildRendering();
            this.postCreate();
        },

        buildRendering: function() {
            this.domNode = new domConstruct.create("div", {
                style: this.domNodeStyle,
                'class': this.domNodeClass
            });
            
            // Create SVG canvas
            this._svg = d3.select(this.domNode)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        
            // Create x axis
            var x = this._x = d3.scale.ordinal()
                .domain([this.xAxisLabel])
                .rangeRoundBands([0, this.width], .1);
        
            var xAxis = this._xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
        
            this._svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(xAxis);
            
            // Create y axis
            var y = this._y = d3.scale.linear()
                .domain([this.minLevel, this.maxLevel])
                .range([this.height, 0]);
        
            var yAxis = this._yAxis = d3.svg.axis()
                .scale(y)
                .ticks(this.range)
                .orient(this.yAxisAlignment);
        
            if ( this.yAxisAlignment === "right" ) {
                this._svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + this.width + ", 0)")
                    .call(yAxis);
            
                this._svg.append("text")
                    .attr("class", "axis-label")
                    .attr("transform", "translate(" + (this.width) + "," + (this.height / 2) + "),rotate(-90)")
                    .attr("x", 0)
                    .attr("y", (this.margin.left / 2) + 5)
                    .attr("text-anchor", "middle")
                    .text(this.yAxisLabel);
            } else {
                this._svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
            
                this._svg.append("text")
                    .attr("class", "axis-label")
                    .attr("transform", "translate(0," + (this.height / 2) + "),rotate(-90)")
                    .attr("x", 0)
                    .attr("y", -(this.margin.left / 2))
                    .attr("text-anchor", "middle")
                    .text(this.yAxisLabel);
            }
            
            this.setLevel(this.level, this.color);
        },

        postCreate: function() {

        },
        
        setLevel: function(level, color) {
            this.removeData();
            
            this.level = level;
            this.color = color;
            
            var self = this;
            this._svg.selectAll(".bar")
                .data([level])
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", self._x(self.xAxisLabel))
                .attr("y", function(d) { return self._y(d); })
                .attr("height", function(d) { return self.height - self._y(d); })
                .attr("width", self._x.rangeBand())
                .style("fill", color);
                
        },
        
        removeData: function() {
            this._svg.selectAll(".bar").remove();
        }
    });
    
});