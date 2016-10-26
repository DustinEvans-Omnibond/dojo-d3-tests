
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "d3/d3"
],
function(declare, domConstruct, d3) {
    
    return declare("LevelChart", null, {
        
        domNodeStyle: null,
        domNodeClass: null,
        minLevel: null,
        maxLevel: null,
        level: null,
        color: null,
        label: null,
        
        constructor: function(args) {
            this.domNodeStyle = "";
            this.domNodeClass = "";
            this.level = 0;
            this.minLevel = 0;
            this.maxLevel = 3;
            this.color = "#000000";
            this.label = "Level";
            
            declare.safeMixin(this, args);

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
                .attr("width", this.width)
                .attr("height", this.height);
        },

        postCreate: function() {

        }
    });
    
});