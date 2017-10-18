/// <reference path="../typings/main.d.ts" />
import gsvInjection = require("gsv-injection");

import gmDrawUtils = require("gm-draw-utils");

import configs = require("./configs");

import domUtils = require("./dom-utils");

import modelUtils = require("./model-utils");

import calibrationUtils = require("./calibration-utils");

declare var google: any;

export function onGoogleLoad() {
    getPanorama(55.0512619, 82.9190818).then((data: {map: any, panorama: any}): any => {
        var panorama = data.panorama;
        var map = data.map;

        var region = new gmDrawUtils.Region(map, {
            lat: 55.0512619,
            lon: 82.9190818
        });
        
        modelUtils.controlPanel.addButton("add object", () => {
            var rect = new gmDrawUtils.Rectangle({width: 10, height: 10}, {x: 0, y: 0});

            region.addPolygon(rect);

            var mesh = new modelUtils.FromMapRectMesh(rect, getHeading);

            var calibration = calibrationUtils.getCalibration(panorama);

            mesh.calibration = calibration;

            gsvInjection.addMesh(mesh);
        });

        // modelUtils.controlPanel.addButton("toggle calibration", () => {
        //     calibrationUtils.calibrationEnabled = !calibrationUtils.calibrationEnabled;
        // });
        //
        // modelUtils.controlPanel.addButton("set initial position", () => {
        //     calibrationUtils.setInitialPositions(region.polys, panorama);
        // });
        //
        // modelUtils.controlPanel.addButton("set fixed positions", () => {
        //     calibrationUtils.setFixedPositions(panorama);
        // });
        //
        // modelUtils.controlPanel.addButton("add fixes", () => {
        //     calibrationUtils.addCurrentFixes(panorama);
        // });
        //
        // modelUtils.controlPanel.addButton("clear fixes", () => {
        //     calibrationUtils.clearCalibration(panorama);
        // });

        modelUtils.controlPanel.addSlider("x axis rotation fix", [-0.1, 0.1, 0.0001, 0], (value) => {
            gsvInjection.setXAxisRotationFix(value);

            modelUtils.touchStreetView();
        });
        
        var getHeading = () => {
            return panorama.getPov().heading;
        }

        panorama.addListener("position_changed", () => {
            var calibration = calibrationUtils.getCalibration(panorama);
            
            gsvInjection.activeMeshes.forEach(mesh => {
                (<any>mesh).calibration = calibration;
            });
            
            var latLng = panorama.getPosition();
            
            region.changeOrigin({lat: latLng.lat(), lon: latLng.lng()}, panorama.getPano());
        });
        
        return true;
    }).then(() => setTimeout(() => domUtils.touchStreetView(document.getElementsByTagName("canvas")[0]), 100));
}

function getPanorama(lat: number, lng: number): Promise<any> {
    return new Promise((resolve) => {
        new google.maps.StreetViewService().getPanoramaByLocation(new google.maps.LatLng(lat, lng), 50, function (data, status) {
            var lat = data.location.latLng.lat();
            var lng = data.location.latLng.lng();

            var panorama = new google.maps.StreetViewPanorama(document.getElementById('streetviewpano'), configs.getPanoConfig(lat, lng));
            var map = new google.maps.Map(document.getElementById('googlemap'), configs.getMapConfig(lat, lng));

            var projection;
            
            var debugPanel = new domUtils.DebugInfoPanel();
            
            var controlPanel = new domUtils.ControlPanel();

            modelUtils.controlPanel = controlPanel;
            
            //gsvInjection.setDebugAcceptor(debugPanel);

            //debugPanel.attach();
            controlPanel.attach();

            map.addListener("projection_changed", function() {
                if(!projection) {
                    resolve({panorama: panorama, map: map});

                    projection = true;
                }
            });
        });
    });
}

export function init() {
    gsvInjection.init(document.getElementById('streetviewpano'));
}