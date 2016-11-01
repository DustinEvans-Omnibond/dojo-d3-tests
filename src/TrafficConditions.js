
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "src/Gauge",
    "src/RatingChart"
],
function(declare, domConstruct, Gauge, RatingChart) {
    
    return declare("TrafficConditions", null, {
        
        domNodeStyle: null,
        domNodeClass: null,
        
        _SPEED_LEVELS: ["Unknown", "Low", "Medium", "Freeflowing"],
        _SPEED_COLORS: ["gray", "#ED1C24", "#FFFF00", "#00FF00"],
        _CONG_LEVELS: ["Unknown", "Low", "Medium", "High"],
        _CONG_COLORS: ["gray", "#00FF00", "#FFFF00", "#ED1C24"],
                
        constructor: function(args) {
            this.domNodeStyle = "";
            this.domNodeClass = "";
            
            declare.safeMixin(this, args);
            
            this.buildRendering();
            this.postCreate();
        },
        
        buildRendering: function() {
            this.domNode = new domConstruct.create("div", {
                style: this.domNodeStyle,
                'class': this.domNodeClass
            });
            
            // Create speed chart
            this.createSpeedChart();
            
            // Create MOT guage
            this.createMOTGauge();
            
            // Create congestion chart
            this.createCongestionChart();
        },
        
        createSpeedChart: function() {
            var speedChart = this._speedChart = RatingChart({
                domNodeStyle: "display: inline-block;",
                domNodeClass: "",
                width: 50,
                height: 150,
                margin: {'top': 20, 'right': 15, 'bottom': 20, 'left': 65},
                ratings: this._SPEED_LEVELS,
                level: this._SPEED_LEVELS[0],
                color: this._SPEED_COLORS[0],
                xAxisLabel: "Speed Level",
                yAxisLabel: "",
                yAxisAlignment: "left"
            });
            this.domNode.appendChild(speedChart.domNode);
        },
        
        createMOTGauge: function() {
            var diameter = 150,
                min = 0,
                max = 100,
                range = max - min,
                label = "MOT",
                minorTicks = 5,
                majorTicks = 5,
                transitionDuration = 500,
                currentValue = 0,
                greenZones = [{ 'from': min, 'to': min + range*0.25 }],
                yellowZones = [],
                redZones = [{ 'from': min + range*0.75, 'to': max }];

            var gauge = this._MOTGauge = new Gauge({
                domNodeStyle: "display: inline-block",
                domNodeClass: "",
                value: currentValue,
                diameter: diameter,
                min: min,
                max: max,
                label: label,
                minorTicks: minorTicks,
                majorTicks: majorTicks,
                greenZones: greenZones,
                yellowZones: yellowZones,
                redZones: redZones,
                transitionDuration: transitionDuration
            });
            this.domNode.appendChild(gauge.domNode);
        },
        
        createCongestionChart: function() {
            var congestionChart = this._congestionChart = RatingChart({
                domNodeStyle: "display: inline-block;",
                domNodeClass: "",
                width: 50,
                height: 150,
                margin: {'top': 20, 'right': 65, 'bottom': 20, 'left': 15},
                ratings: this._CONG_LEVELS,
                level: this._CONG_LEVELS[0],
                color: this._CONG_COLORS[0],
                xAxisLabel: "Congestion Level",
                yAxisLabel: "",
                yAxisAlignment: "right"
            });
            this.domNode.appendChild(congestionChart.domNode);
        },
        
        postCreate: function() {
            
        },
        
        setSpeed: function(value) {
            if ( value >= -1 && value <= 2 ) {
                var adjValue = value + 1;
                this._speedChart.setLevel(this._SPEED_LEVELS[adjValue], this._SPEED_COLORS[adjValue]);
            } else {
                this._speedChart.setLevel(this._SPEED_LEVELS[0], this._SPEED_COLORS[0]);
            }
        },
        
        setMOT: function(value) {
            if ( value >= 0 && value <= 100 ) {
                this._MOTGauge.redraw(value, 500);
            } else {
                this._MOTGauge.redraw(0, 500);
            }
        },
        
        setCongestion: function(value) {
            if ( value >= -1 && value <= 2 ) {
                var adjValue = value + 1;
                this._congestionChart.setLevel(this._CONG_LEVELS[adjValue], this._CONG_COLORS[adjValue]);
            } else {
                this._congestionChart.setLevel(this._CONG_LEVELS[0], this._CONG_COLORS[0]);
            }
        },
        
        set: function(speedValue, congValue, motValue) {
            this.setSpeed(speedValue);
            this.setCongestion(congValue);
            this.setMOT(motValue);
        }
        
    });
    
});
