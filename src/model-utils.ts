import gsvInjection = require("gsv-injection");
import gmDrawUtils = require("gm-draw-utils");
import meshData = require("./mesh-data");
import domUtils = require("./dom-utils");

declare var Promise;

var timeout = null;

export var controlPanel: domUtils.ControlPanel;

export class FromMapRectMesh extends gsvInjection.Mesh {
    private cubeBase = new meshData.CubeBase();
    
    widthX: number = 1;
    widthY: number = 1;
    ground = 5;
    height = 10;
    
    scale: number = 0.01;

    calibration: (position: {x: number, y: number, z?: number}, rotation: number) => {position: {x: number, y: number, z: number}, rotation: number};
    
    constructor(private rectangle: gmDrawUtils.Rectangle, getHeading: () => number) {
        super(getHeading);
        
        this.vertices = this.cubeBase.vertices;
        this.indices = this.cubeBase.indices;
        this.uvMap = this.cubeBase.uvMap;
        
        this.textureURI = "brick.png";
        
        this.rectangle.displayListener = (data: {wheelEvent: any}) => {
            this.applyData(data);
        }
        
        this.applyData({wheelEvent: null});
    }
    
    wheelScrolled(event) {
        if(event.ctrlKey) {
            this.ground -= event.deltaY / 10;
        } else {
            this.height -= event.deltaY / 10;
        }
    }

    private calibrate(position: {x: number, y: number, z?: number}, rotation: number): {position: {x: number, y: number, z: number}, rotation: number} {
        if(!this.calibration) {
            return {position: {x: position.x, y: position.y, z: position.z || 0}, rotation: rotation}
        }

        return this.calibration(position, rotation);
    }
    
    private applyData(data: {wheelEvent: any}): void {
        this.widthX = this.rectangle.bounds.width;
        this.widthY = this.rectangle.bounds.height;
                
        if(data.wheelEvent) {
            this.wheelScrolled(data.wheelEvent);
        }

        var calibrated = this.calibrate(this.rectangle.position, 0);

        this.translation = {x: this.scale * calibrated.position.x, y: this.scale * calibrated.position.y, z: 0};
        this.rotation = this.rectangle.rotation;
        
        this.cubeBase.applyBounds(this);

        this.touchStreetView();
    }
    
    private touchStreetView() {
        touchStreetView();
    }
}

var taskId = null;

function touchStreetView() {
    if(taskId) {
        return;
    }
    
    taskId = setTimeout(() => {
        var canvas = document.getElementsByTagName("canvas")[0];

        if(canvas) {
            domUtils.touchStreetView(canvas);
        }

        taskId = null;
    }, 30);
}