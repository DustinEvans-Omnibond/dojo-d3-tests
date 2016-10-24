
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "d3/d3"
],
function(declare, domConstruct, d3) {
    
    return declare("Gauge", null, {
        
        domNodeStyle: null,
        domNodeClass: null,
        label: null,
        diameter: null,
        min: null,
        max: null,
        value: null,
        minorTicks: null,
        majorTicks: null,
        transitionDuration: null,
        greenColor: null,
        greenZones: null,
        yellowColor: null,
        yellowZones: null,
        redColor: null,
        redZones: null,
        
        constructor: function(args) {
            this.domNodeStyle = "";
            this.domNodeClass = "";
            this.label = "";
            this.diameter = 120;            
            this.min = 0;
            this.max = 100;
            
            this.value = this.min;
            this.majorTicks = 5;
            this.minorTicks = 2;
            this.greenColor = "#109618";
            this.yellowColor = "#FF9900";
            this.redColor = "#DC3912";
            this.greenZones = [];
            this.yellowZones = [];
            this.redZones = [];
            this.transitionDuration = 500;
            
            declare.safeMixin(this, args);
            
            this.radius = this.diameter / 2;
            this.cx = this.diameter / 2;
            this.cy = this.diameter / 2;
            this.range = this.max - this.min;
            
            this.buildRendering();
            this.postCreate();
        },
        
        buildRendering: function() {
            this.domNode = new domConstruct.create("div", {
                style: this.domNodeStyle,
                'class': this.domNodeClass
            });
            
            // Create SVG Canvas
            this._svg = d3.select(this.domNode)
                .append("svg:svg")
                .attr("class", "gauge")
                .attr("width", this.diameter)
                .attr("height", this.diameter);
        
            // Create outer circles
            this._svg.append("svg:circle")
                .attr("cx", this.cx)
                .attr("cy", this.cy)
                .attr("r", this.radius)
                .style("fill", "#ccc")
                .style("stroke", "#000")
                .style("stroke-width", "0.5px");
        
            this._svg.append("svg:circle")
                .attr("cx", this.cx)
                .attr("cy", this.cy)
                .attr("r", 0.9 * this.radius)
                .style("fill", "#fff")
                .style("stroke", "#e0e0e0")
                .style("stroke-width", "2px");
        
            // Create colored band zones
            for (var index in this.greenZones) {
                this.drawBand(this.greenZones[index]['from'], this.greenZones[index]['to'], this.greenColor);
            }

            for (var index in this.yellowZones) {
                this.drawBand(this.yellowZones[index]['from'], this.yellowZones[index]['to'], this.yellowColor);
            }

            for (var index in this.redZones) {
                this.drawBand(this.redZones[index]['from'], this.redZones[index]['to'], this.redColor);
            }
            
            // Create Label
            if (this.label !== undefined) {
                var fontSize = Math.round(this.diameter / 9);
                this._svg.append("svg:text")
                    .attr("x", this.cx)
                    .attr("y", this.cy / 2 + fontSize / 2)
                    .attr("dy", fontSize / 2)
                    .attr("text-anchor", "middle")
                    .text(this.label)
                    .style("font-size", fontSize + "px")
                    .style("fill", "#333")
                    .style("stroke-width", "0px");
            }
            
            // Create pointer
            var fontSize = Math.round(this.diameter / 16);
            var majorDelta = this.range / (this.majorTicks - 1);
            for (var major = this.min; major <= this.max; major += majorDelta) {
                var minorDelta = majorDelta / this.minorTicks;
                for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.max); minor += minorDelta) {
                    var point1 = this.valueToPoint(minor, 0.75);
                    var point2 = this.valueToPoint(minor, 0.85);

                    this._svg.append("svg:line")
                        .attr("x1", point1.x)
                        .attr("y1", point1.y)
                        .attr("x2", point2.x)
                        .attr("y2", point2.y)
                        .style("stroke", "#666")
                        .style("stroke-width", "1px");
                }

                var point1 = this.valueToPoint(major, 0.7);
                var point2 = this.valueToPoint(major, 0.85);	

                this._svg.append("svg:line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .style("stroke", "#333")
                    .style("stroke-width", "2px");

                if (this.min === minor || this.max === major) {
                    var point = this.valueToPoint(major, 0.63);

                    this._svg.append("svg:text")
                        .attr("x", point.x)
                        .attr("y", point.y)
                        .attr("dy", fontSize / 3)
                        .attr("text-anchor", this.min === major ? "start" : "end")
                        .text(major)
                        .style("font-size", fontSize + "px")
                        .style("fill", "#333")
                        .style("stroke-width", "0px");
                }
            }
            
            var pointerContainer = this._svg.append("svg:g").attr("class", "pointerContainer");
		
            var midValue = (this.min + this.max) / 2;

            var pointerPath = this.buildPointerPath(midValue);

            var pointerLine = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("basis");

            pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                    .append("svg:path")
                        .attr("d", pointerLine)
                        .style("fill", "#dc3912")
                        .style("stroke", "#c63310")
                        .style("fill-opacity", 0.7);

            pointerContainer.append("svg:circle")
                .attr("cx", this.cx)
                .attr("cy", this.cy)
                .attr("r", 0.12 * this.radius)
                .style("fill", "#4684EE")
                .style("stroke", "#666")
                .style("opacity", 1);

            var fontSize = Math.round(this.diameter / 10);
            pointerContainer.selectAll("text")
                .data([midValue])
                .enter()
                    .append("svg:text")
                        .attr("x", this.cx)
                        .attr("y", this.diameter - this.cy / 4 - fontSize)
                        .attr("dy", fontSize / 2)
                        .attr("text-anchor", "middle")
                        .style("font-size", fontSize + "px")
                        .style("fill", "#000")
                        .style("stroke-width", "0px");
		
            this.redraw(this.value, 0);
        },
        
        postCreate: function() {
            
        },
        
        redraw: function(value, transitionDuration) {
            var self = this;
            var pointerContainer = this._svg.select(".pointerContainer");

            pointerContainer.selectAll("text").text(Math.round(value));

            var pointer = pointerContainer.selectAll("path");
            pointer.transition()
                .duration(transitionDuration !== undefined ? transitionDuration : this.transitionDuration)
                .attrTween("transform", function() {
                    var pointerValue = value;
                    if (value > self.max) {
                        pointerValue = self.max + 0.02*self.range;
                    } else if (value < self.min) {
                        pointerValue = self.min - 0.02*self.range;
                    }
                    var targetRotation = (self.valueToDegrees(pointerValue) - 90);
                    var currentRotation = self._currentRotation || targetRotation;
                    self._currentRotation = targetRotation;

                    return function(step) {
                        var rotation = currentRotation + (targetRotation-currentRotation)*step;
                        return "translate(" + self.cx + ", " + self.cy + ") rotate(" + rotation + ")"; 
                    };
                });
        },
        
        buildPointerPath: function(value) {
            var self = this;
            
            var delta = this.range / 13;
		
            var head = valueToPoint(value, 0.85);
            var head1 = valueToPoint(value - delta, 0.12);
            var head2 = valueToPoint(value + delta, 0.12);

            var tailValue = value - (this.range * (1/(270/360)) / 2);
            var tail = valueToPoint(tailValue, 0.28);
            var tail1 = valueToPoint(tailValue - delta, 0.12);
            var tail2 = valueToPoint(tailValue + delta, 0.12);

            return [head, head1, tail2, tail, tail1, head2, head];

            function valueToPoint(value, factor) {
                var point = self.valueToPoint(value, factor);
                point.x -= self.cx;
                point.y -= self.cy;
                return point;
            };
        },
        
        drawBand: function(start, end, color) {
            if (0 >= end - start) return;
            
            var self = this;
            this._svg.append("svg:path")
                .style("fill", color)
                .attr("d", d3.svg.arc()
                    .startAngle(this.valueToRadians(start))
                    .endAngle(this.valueToRadians(end))
                    .innerRadius(0.65 * this.radius)
                    .outerRadius(0.85 * this.radius))
                .attr("transform", function() { return "translate(" + self.cx + ", " + self.cy + ") rotate(270)"; });
        },
        
        valueToDegrees: function(value) {
            return value / this.range * 270 - (this.min / this.range * 270 + 45);
        },
        
        valueToRadians: function(value) {
            return this.valueToDegrees(value) * Math.PI / 180;
        },
        
        valueToPoint: function(value, factor) {
            return {
                x: this.cx - this.radius * factor * Math.cos(this.valueToRadians(value)),
                y: this.cy - this.radius * factor * Math.sin(this.valueToRadians(value)) 
            };
        }
        
    });
    
});