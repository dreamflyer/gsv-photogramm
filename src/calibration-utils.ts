/// <reference path="../typings/main.d.ts" />
import gmDrawUtils = require("gm-draw-utils");

var leastSquares = require("least-squares");

var calibrationInfos = [];

export var calibrationEnabled = true;

export function setInitialPositions(polys: gmDrawUtils.Polygon[], panorama: any): void {
    var infoRecord: any = {
        panoId: panorama.getPano(),
        polyDatas: []
    };

    polys.forEach(poly => {
        var initialState = {
            position: {
                x: poly.position.x,
                y: poly.position.y
            },

            rotation: poly.rotation
        };

        infoRecord.polyDatas.push({
            poly: poly,

            initialState: initialState
        });
    });

    updateInfoRecord(infoRecord);
}

export function setFixedPositions(panorama: any): void {
    var infoRecord = findInfoRecord(panorama.getPano());

    if(!infoRecord) {
        return;
    }

    infoRecord.polyDatas.forEach(polyData => {
        var poly = polyData.poly;

        var fixedState = {
            position: {
                x: poly.position.x,
                y: poly.position.y
            },

            rotation: poly.rotation
        };

        polyData.fixedState = fixedState;
    });
}

export function addCurrentFixes(panorama: any): void {
    var panoId = panorama.getPano();

    var infoToApply = findInfoRecord(panoId);

    if(!infoToApply) {
        return;
    }

    var stats = getStorageItem("calibration_stats");

    if(!stats) {
        stats = {};
    }

    var panoRecords = stats[panoId];

    if(!panoRecords) {
        panoRecords = [];

        stats[panoId] = panoRecords;
    }

    infoToApply.polyDatas.forEach(polyData => {
        panoRecords.push({
            initialState: polyData.initialState,
            fixedState: polyData.fixedState
        });
    });

    setStorageItem('calibration_stats', stats);
}

export function clearCalibration(panorama: any): void {
    var panoId = panorama.getPano();

    var stats = getStorageItem("calibration_stats");

    if(!stats) {
        return;
    }

    var panoRecords = stats[panoId];

    if(!panoRecords) {
        return;
    }

    delete stats[panoId];

    setStorageItem('calibration_stats', stats);
}

export function getCalibration(panorama: any): any {
    var panoId = panorama.getPano();

    var stats = getStorageItem("calibration_stats");

    if(!stats) {
        return null;
    }

    var panoRecords = stats[panoId];

    if(!panoRecords) {
        return null;
    }

    var xArgs = [];
    var xErrs = [];

    var yArgs = [];
    var yErrs = [];

    panoRecords.forEach(record => {
        var p0 = {x: record.initialState.position.x, y: record.initialState.position.y};
        var p1 = {x: record.fixedState.position.x, y: record.fixedState.position.y};

        xArgs.push(p0.x);
        xErrs.push(p1.x - p0.x);

        yArgs.push(p0.y);
        yErrs.push(p1.y - p0.y);
    });

    var xErrFunc = leastSquares(xArgs, xErrs, {});
    var yErrFunc = leastSquares(yArgs, yErrs, {});

    var calibrationXY = getCalibrationXY(xErrFunc, yErrFunc);
    
    return (position: {x: number, y: number, z?: number}, rotation: number) => {
        if(!calibrationEnabled) {
            return {position: position, rotation: rotation};
        }
        
        var fixed = calibrationXY(position.x, position.y);
        
        return {
            position: {x: fixed.x, y: fixed.y, z: 0},
            
            rotation: 0
        }
    }
}

function getCalibrationXY(xErrFunc, yErrFunc): (x: number, y: number) => {x: number, y: number} {
    
    
    return (x: number, y: number) => ({x: x + xErrFunc(x), y:  y + yErrFunc(y)});
}

function updateInfoRecord(record: any): void {
    var infoRecord = findInfoRecord(record.panoId);

    if(infoRecord) {
        infoRecord.polyDatas = record.polyDatas;

        return;
    }

    calibrationInfos.push(record);
}

function findInfoRecord(panoId: string): any {
    for(var i = 0; i < calibrationInfos.length; i++) {
        if(calibrationInfos[i].panoId === panoId) {
            return calibrationInfos[i];
        }
    }

    return null;
}

function getStorageItem(objectId: string): any {
    var jsonString = window.localStorage.getItem(objectId);
    
    if(!jsonString) {
        return undefined;
    }
    
    return JSON.parse(jsonString);
}

function setStorageItem(objectId: string, value: any): void {
    var jsonString = JSON.stringify(value);

    window.localStorage.setItem(objectId, jsonString);
}