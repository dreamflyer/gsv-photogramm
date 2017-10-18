import gsvInjection = require("gsv-injection");
import gmDrawUtils = require("gm-draw-utils");
import meshData = require("./mesh-data");
import domUtils = require("./dom-utils");

import storage = require("./storage-utils");

var shortid = require('shortid');

declare var Promise;

var timeout = null;

export var controlPanel: domUtils.ControlPanel;

class StorageItem {
    widthX: number;
    widthY: number;
    
    ground: number;
    height: number;

    scale: number = 0.01;
    
    rotation: number;
    
    position: {
        x: number,
        y: number
    };
}

class StorageModel {
    items: {[itemId: string]: {[panoId: string]: StorageItem}};
}

export class FromMapRectMesh extends gsvInjection.Mesh {
    private cubeBase = new meshData.CubeBase();
    
    widthX: number = 1;
    widthY: number = 1;
    ground: number = 5;
    height: number = 10;
    
    scale: number = 0.01;
    
    calibration: (position: {x: number, y: number, z?: number}, rotation: number) => {position: {x: number, y: number, z: number}, rotation: number};

    public id: string;
    
    constructor(private rectangle: gmDrawUtils.Rectangle, getHeading: () => number, id?: string) {
        super(getHeading);

        this.id = id || shortid.generate();
        
        this.vertices = this.cubeBase.vertices;
        this.indices = this.cubeBase.indices;
        this.uvMap = this.cubeBase.uvMap;
        
        this.textureURI = "brick.png";
        
        this.rectangle.displayListener = (data: {wheelEvent: any}) => {
            this.applyData(data);
        };
        
        rectangle.onRemove = () => {
            this.remove();

            this.touchStreetView();
        };
        
        rectangle.onPanoChanged = (panoId: string) => {
            var item = readStorageItem(this.id, panoId);
            
            if(!item) {
                return;
            }

            this.applyStorageItem(item);

            this.applyData({wheelEvent: null});
        };

        this.applyData({wheelEvent: null});
    }

    toStorageItem(): StorageItem {
        var result = new StorageItem();

        result.widthX = this.rectangle.bounds.width;
        result.widthY = this.rectangle.bounds.height;

        result.position = {x: this.rectangle.position.x, y: this.rectangle.position.y};
        result.rotation = this.rectangle.rotation;

        result.ground = this.ground;

        result.height = this.height;

        result.scale = this.scale;

        return result;
    }

    applyStorageItem(item: StorageItem): void {
        this.rectangle.bounds.width = item.widthX;
        this.rectangle.bounds.height = item.widthY;

        this.rectangle.position = {x: item.position.x, y: item.position.y};

        this.rectangle.rotation = item.rotation;

        this.ground = item.ground;

        this.height = item.height;

        this.scale = item.scale;
    }
    
    serialize(): any {

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

function readStorageItem(meshId: string, panoId: string): StorageItem {
    return null;
}

function readStorageModel(): StorageModel {
    var result =  <StorageModel>storage.getStorageItem("rect_meshes") || new StorageModel();
    
    if(!result.items) {
        result.items = {};
    }
    
    return result;
}

function saveItems(items: {[itemId: string]: StorageItem}, panoId: string): void {
    var saveKeys = Object.keys(items);
    
    var model = readStorageModel();
    
    var existingKeys = Object.keys(model.items);
}

export function touchStreetView() {
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