
define([
    "dojo/_base/declare",
    "d3/d3"
],
function(declare, d3) {
    
    return declare("Gauge", null, {
        
        diameter: null,
        min: null,
        max: null,
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
            this.placeHolderName = "Gauge";
            this.diameter = 120;
            this.radius = this.diameter / 2;
            this.cx = this.diameter / 2;
            this.cy = this.diameter / 2;
            this.min = 0;
            this.max = 100;
            this.range = this.max - this.min;
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
            
            this.buildRendering();
            this.postCreate();
        },
        
        buildRendering: function() {
            
        },
        
        postCreate: function() {
            
        }
        
    });
    
});