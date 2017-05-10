var GSVPhotogramm =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/main.d.ts" />
	var gsvInjection = __webpack_require__(6);
	var gmDrawUtils = __webpack_require__(7);
	var configs = __webpack_require__(1);
	var domUtils = __webpack_require__(2);
	var modelUtils = __webpack_require__(3);
	var calibrationUtils = __webpack_require__(4);
	function onGoogleLoad() {
	    getPanorama(55.0512619, 82.9190818).then(function (data) {
	        var panorama = data.panorama;
	        var map = data.map;
	        var region = new gmDrawUtils.Region(map, {
	            lat: 55.0512619,
	            lon: 82.9190818
	        });
	        // var rect1 = new gmDrawUtils.Rectangle({width: 10, height: 10}, {x: 10, y: 0});
	        // var rect2 = new gmDrawUtils.Rectangle({width: 10, height: 10}, {x: -10, y: 0});
	        // var rect3 = new gmDrawUtils.Rectangle({width: 10, height: 10}, {x: 0, y: 10});
	        // var rect4 = new gmDrawUtils.Rectangle({width: 10, height: 10}, {x: 0, y: -10});
	        //
	        // region.addPolygon(rect1);
	        // region.addPolygon(rect2);
	        // region.addPolygon(rect3);
	        // region.addPolygon(rect4);
	        modelUtils.controlPanel.addButton("add object", function () {
	            var rect = new gmDrawUtils.Rectangle({ width: 10, height: 10 }, { x: 0, y: 0 });
	            region.addPolygon(rect);
	            var mesh = new modelUtils.FromMapRectMesh(rect, getHeading);
	            var calibration = calibrationUtils.getCalibration(panorama);
	            mesh.calibration = calibration;
	            gsvInjection.addMesh(mesh);
	        });
	        modelUtils.controlPanel.addButton("toggle calibration", function () {
	            calibrationUtils.calibrationEnabled = !calibrationUtils.calibrationEnabled;
	        });
	        modelUtils.controlPanel.addButton("set initial position", function () {
	            calibrationUtils.setInitialPositions(region.polys, panorama);
	        });
	        modelUtils.controlPanel.addButton("set fixed positions", function () {
	            calibrationUtils.setFixedPositions(panorama);
	        });
	        modelUtils.controlPanel.addButton("add fixes", function () {
	            calibrationUtils.addCurrentFixes(panorama);
	        });
	        modelUtils.controlPanel.addButton("clear fixes", function () {
	            calibrationUtils.clearCalibration(panorama);
	        });
	        var getHeading = function () {
	            return panorama.getPov().heading;
	        };
	        // var mesh1 = new modelUtils.FromMapRectMesh(rect1, getHeading);
	        // var mesh2 = new modelUtils.FromMapRectMesh(rect2, getHeading);
	        // var mesh3 = new modelUtils.FromMapRectMesh(rect3, getHeading);
	        // var mesh4 = new modelUtils.FromMapRectMesh(rect4, getHeading);
	        //
	        // gsvInjection.addMesh(mesh1);
	        // gsvInjection.addMesh(mesh2);
	        // gsvInjection.addMesh(mesh3);
	        // gsvInjection.addMesh(mesh4);
	        panorama.addListener("position_changed", function () {
	            var calibration = calibrationUtils.getCalibration(panorama);
	            gsvInjection.activeMeshes.forEach(function (mesh) {
	                mesh.calibration = calibration;
	            });
	            var latLng = panorama.getPosition();
	            region.changeOrigin({ lat: latLng.lat(), lon: latLng.lng() });
	        });
	        return true;
	    }).then(function () { return setTimeout(function () { return domUtils.touchStreetView(document.getElementsByTagName("canvas")[0]); }, 100); });
	}
	exports.onGoogleLoad = onGoogleLoad;
	function getPanorama(lat, lng) {
	    return new Promise(function (resolve) {
	        new google.maps.StreetViewService().getPanoramaByLocation(new google.maps.LatLng(lat, lng), 50, function (data, status) {
	            var lat = data.location.latLng.lat();
	            var lng = data.location.latLng.lng();
	            var panorama = new google.maps.StreetViewPanorama(document.getElementById('streetviewpano'), configs.getPanoConfig(lat, lng));
	            var map = new google.maps.Map(document.getElementById('googlemap'), configs.getMapConfig(lat, lng));
	            var projection;
	            var debugPanel = new domUtils.DebugInfoPanel();
	            var controlPanel = new domUtils.ControlPanel();
	            modelUtils.controlPanel = controlPanel;
	            gsvInjection.setDebugAcceptor(debugPanel);
	            debugPanel.attach();
	            controlPanel.attach();
	            map.addListener("projection_changed", function () {
	                if (!projection) {
	                    resolve({ panorama: panorama, map: map });
	                    projection = true;
	                }
	            });
	        });
	    });
	}
	function init() {
	    gsvInjection.init(document.getElementById('streetviewpano'));
	}
	exports.init = init;
	//# sourceMappingURL=index.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function getPanoConfig(lat, lng) {
	    return {
	        position: {
	            lat: lat,
	            lng: lng
	        },
	        pov: {
	            heading: 0,
	            pitch: 0,
	            zoom: 1
	        },
	        disableDefaultUI: true,
	        clickToGo: false
	    };
	}
	exports.getPanoConfig = getPanoConfig;
	function getMapConfig(lat, lng) {
	    return {
	        center: {
	            lat: lat,
	            lng: lng
	        },
	        scrollwheel: false,
	        zoom: 18,
	        draggable: false
	    };
	}
	exports.getMapConfig = getMapConfig;
	//# sourceMappingURL=configs.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var DebugInfoPanel = (function () {
	    function DebugInfoPanel() {
	        var _this = this;
	        this.style = {
	            position: 'absolute',
	            width: '300px',
	            height: '600px',
	            left: '100px',
	            top: '100px',
	            color: 'green',
	            'background-color': 'black',
	            'white-space': 'nowrap'
	        };
	        this.table = document.createElement("table");
	        this.container = document.createElement("div");
	        this.values = {};
	        for (var key in this.style) {
	            this.container.style[key] = this.style[key];
	        }
	        this.container.draggable = true;
	        this.container.appendChild(this.table);
	        this.container.ondragend = function (event) {
	            _this.container.style.left = event.x + "px";
	            _this.container.style.top = (event.y - parseFloat(_this.container.style.height)) + "px";
	        };
	    }
	    DebugInfoPanel.prototype.addRow = function (name, value) {
	        var row = this.table.insertRow();
	        this.addNameCell(name.split('childvalue_').pop(), row);
	        var valueBinding = {};
	        if (value.forEach) {
	            this.addValueCell(row);
	            var callbacks = [];
	            for (var i = 0; i < value.length; i++) {
	                callbacks.push(this.addRow('childvalue_' + i, value[i]));
	            }
	            valueBinding.setValue = function (values) {
	                callbacks.forEach(function (callback, i) { return callback(values[i]); });
	            };
	        }
	        else {
	            valueBinding.setValue = this.addValueCell(row);
	        }
	        if (name.indexOf('childvalue') === -1) {
	            this.values[name] = valueBinding;
	        }
	        return valueBinding.setValue;
	    };
	    DebugInfoPanel.prototype.addValueCell = function (row) {
	        var cell = row.insertCell();
	        cell.align = 'left';
	        cell.vAlign = 'center';
	        cell.style.width = '100%';
	        return function (value) {
	            cell.innerHTML = value + '';
	        };
	    };
	    DebugInfoPanel.prototype.addNameCell = function (name, row) {
	        var cell = row.insertCell(0);
	        cell.innerHTML = name + " :";
	        cell.align = 'right';
	        cell.vAlign = 'center';
	        cell.style.width = 'auto';
	    };
	    DebugInfoPanel.prototype.accept = function (name, value) {
	        if (!this.values[name]) {
	            this.addRow(name, value);
	        }
	        this.setValue(name, value);
	    };
	    DebugInfoPanel.prototype.setValue = function (name, value) {
	        this.values[name].setValue(value);
	    };
	    DebugInfoPanel.prototype.attach = function () {
	        document.body.appendChild(this.container);
	    };
	    return DebugInfoPanel;
	}());
	exports.DebugInfoPanel = DebugInfoPanel;
	var ControlPanel = (function () {
	    function ControlPanel() {
	        var _this = this;
	        this.style = {
	            position: 'absolute',
	            width: '200px',
	            height: '200px',
	            left: '400px',
	            top: '100px',
	            color: 'green',
	            'background-color': 'black',
	            'white-space': 'nowrap'
	        };
	        this.table = document.createElement("table");
	        this.container = document.createElement("div");
	        for (var key in this.style) {
	            this.container.style[key] = this.style[key];
	        }
	        this.container.draggable = true;
	        this.container.appendChild(this.table);
	        this.container.ondragend = function (event) {
	            _this.container.style.left = event.x + "px";
	            _this.container.style.top = (event.y - parseFloat(_this.container.style.height)) + "px";
	        };
	    }
	    ControlPanel.prototype.addButton = function (name, callback) {
	        var row = this.table.insertRow();
	        var cell = this.addCell(row);
	        var valueBinding = {};
	        var button = document.createElement("input");
	        button.type = "button";
	        button.value = name;
	        button.style.width = "100%";
	        button.style.height = "100%";
	        button.addEventListener("click", function () { return callback(); });
	        cell.appendChild(button);
	    };
	    ControlPanel.prototype.addCell = function (row) {
	        var cell = row.insertCell();
	        cell.align = 'center';
	        cell.vAlign = 'center';
	        cell.style.width = '100%';
	        return cell;
	    };
	    ControlPanel.prototype.attach = function () {
	        document.body.appendChild(this.container);
	    };
	    return ControlPanel;
	}());
	exports.ControlPanel = ControlPanel;
	function mouseEvent(type, sx, sy, cx, cy) {
	    var evt;
	    var e = {
	        bubbles: true,
	        cancelable: (type != "mousemove"),
	        view: window,
	        detail: 0,
	        screenX: sx,
	        screenY: sy,
	        clientX: cx,
	        clientY: cy,
	        ctrlKey: false,
	        altKey: false,
	        shiftKey: false,
	        metaKey: false,
	        button: 0,
	        relatedTarget: undefined
	    };
	    if (typeof (document.createEvent) == "function") {
	        evt = document.createEvent("MouseEvents");
	        evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
	    }
	    else if (document.createEventObject) {
	        evt = document.createEventObject();
	        for (var prop in e) {
	            evt[prop] = e[prop];
	        }
	        evt.button = { 0: 1, 1: 4, 2: 2 }[evt.button] || evt.button;
	    }
	    return evt;
	}
	function dispatch(el, evt) {
	    if (el.dispatchEvent) {
	        el.dispatchEvent(evt);
	    }
	    else if (el.fireEvent) {
	        el.fireEvent('on' + evt.type, evt);
	    }
	    return evt;
	}
	function touchStreetView(element) {
	    if (!element) {
	        return;
	    }
	    var event = mouseEvent("mouseup", 1, 1, 1, 1);
	    dispatch(element, event);
	}
	exports.touchStreetView = touchStreetView;
	//# sourceMappingURL=dom-utils.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var gsvInjection = __webpack_require__(6);
	var meshData = __webpack_require__(5);
	var domUtils = __webpack_require__(2);
	var timeout = null;
	var FromMapRectMesh = (function (_super) {
	    __extends(FromMapRectMesh, _super);
	    function FromMapRectMesh(rectangle, getHeading) {
	        var _this = this;
	        _super.call(this, getHeading);
	        this.rectangle = rectangle;
	        this.cubeBase = new meshData.CubeBase();
	        this.widthX = 1;
	        this.widthY = 1;
	        this.ground = 5;
	        this.height = 10;
	        this.scale = 0.01;
	        this.vertices = this.cubeBase.vertices;
	        this.indices = this.cubeBase.indices;
	        this.uvMap = this.cubeBase.uvMap;
	        this.textureURI = "brick.png";
	        this.rectangle.displayListener = function (data) {
	            _this.applyData(data);
	        };
	        this.applyData({ wheelEvent: null });
	    }
	    FromMapRectMesh.prototype.wheelScrolled = function (event) {
	        if (event.ctrlKey) {
	            this.ground -= event.deltaY / 10;
	        }
	        else {
	            this.height -= event.deltaY / 10;
	        }
	    };
	    FromMapRectMesh.prototype.calibrate = function (position, rotation) {
	        if (!this.calibration) {
	            return { position: { x: position.x, y: position.y, z: position.z || 0 }, rotation: rotation };
	        }
	        return this.calibration(position, rotation);
	    };
	    FromMapRectMesh.prototype.applyData = function (data) {
	        this.widthX = this.rectangle.bounds.width;
	        this.widthY = this.rectangle.bounds.height;
	        if (data.wheelEvent) {
	            this.wheelScrolled(data.wheelEvent);
	        }
	        var calibrated = this.calibrate(this.rectangle.position, 0);
	        this.translation = { x: this.scale * calibrated.position.x, y: this.scale * calibrated.position.y, z: 0 };
	        this.rotation = this.rectangle.rotation;
	        this.cubeBase.applyBounds(this);
	        this.touchStreetView();
	    };
	    FromMapRectMesh.prototype.touchStreetView = function () {
	        touchStreetView();
	    };
	    return FromMapRectMesh;
	}(gsvInjection.Mesh));
	exports.FromMapRectMesh = FromMapRectMesh;
	var taskId = null;
	function touchStreetView() {
	    if (taskId) {
	        return;
	    }
	    taskId = setTimeout(function () {
	        var canvas = document.getElementsByTagName("canvas")[0];
	        if (canvas) {
	            domUtils.touchStreetView(canvas);
	        }
	        taskId = null;
	    }, 30);
	}
	//# sourceMappingURL=model-utils.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var leastSquares = __webpack_require__(10);
	var calibrationInfos = [];
	exports.calibrationEnabled = true;
	function setInitialPositions(polys, panorama) {
	    var infoRecord = {
	        panoId: panorama.getPano(),
	        polyDatas: []
	    };
	    polys.forEach(function (poly) {
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
	exports.setInitialPositions = setInitialPositions;
	function setFixedPositions(panorama) {
	    var infoRecord = findInfoRecord(panorama.getPano());
	    if (!infoRecord) {
	        return;
	    }
	    infoRecord.polyDatas.forEach(function (polyData) {
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
	exports.setFixedPositions = setFixedPositions;
	function addCurrentFixes(panorama) {
	    var panoId = panorama.getPano();
	    var infoToApply = findInfoRecord(panoId);
	    if (!infoToApply) {
	        return;
	    }
	    var stats = getStorageItem("calibration_stats");
	    if (!stats) {
	        stats = {};
	    }
	    var panoRecords = stats[panoId];
	    if (!panoRecords) {
	        panoRecords = [];
	        stats[panoId] = panoRecords;
	    }
	    infoToApply.polyDatas.forEach(function (polyData) {
	        panoRecords.push({
	            initialState: polyData.initialState,
	            fixedState: polyData.fixedState
	        });
	    });
	    setStorageItem('calibration_stats', stats);
	}
	exports.addCurrentFixes = addCurrentFixes;
	function clearCalibration(panorama) {
	    var panoId = panorama.getPano();
	    var stats = getStorageItem("calibration_stats");
	    if (!stats) {
	        return;
	    }
	    var panoRecords = stats[panoId];
	    if (!panoRecords) {
	        return;
	    }
	    delete stats[panoId];
	    setStorageItem('calibration_stats', stats);
	}
	exports.clearCalibration = clearCalibration;
	function getCalibration(panorama) {
	    var panoId = panorama.getPano();
	    var stats = getStorageItem("calibration_stats");
	    if (!stats) {
	        return null;
	    }
	    var panoRecords = stats[panoId];
	    if (!panoRecords) {
	        return null;
	    }
	    var xArgs = [];
	    var xErrs = [];
	    var yArgs = [];
	    var yErrs = [];
	    panoRecords.forEach(function (record) {
	        var p0 = { x: record.initialState.position.x, y: record.initialState.position.y };
	        var p1 = { x: record.fixedState.position.x, y: record.fixedState.position.y };
	        xArgs.push(p0.x);
	        xErrs.push(p1.x - p0.x);
	        yArgs.push(p0.y);
	        yErrs.push(p1.y - p0.y);
	    });
	    var xErrFunc = leastSquares(xArgs, xErrs, {});
	    var yErrFunc = leastSquares(yArgs, yErrs, {});
	    var calibrationXY = getCalibrationXY(xErrFunc, yErrFunc);
	    return function (position, rotation) {
	        if (!exports.calibrationEnabled) {
	            return { position: position, rotation: rotation };
	        }
	        var fixed = calibrationXY(position.x, position.y);
	        return {
	            position: { x: fixed.x, y: fixed.y, z: 0 },
	            rotation: 0
	        };
	    };
	}
	exports.getCalibration = getCalibration;
	function getCalibrationXY(xErrFunc, yErrFunc) {
	    return function (x, y) { return ({ x: x + xErrFunc(x), y: y + yErrFunc(y) }); };
	}
	function updateInfoRecord(record) {
	    var infoRecord = findInfoRecord(record.panoId);
	    if (infoRecord) {
	        infoRecord.polyDatas = record.polyDatas;
	        return;
	    }
	    calibrationInfos.push(record);
	}
	function findInfoRecord(panoId) {
	    for (var i = 0; i < calibrationInfos.length; i++) {
	        if (calibrationInfos[i].panoId === panoId) {
	            return calibrationInfos[i];
	        }
	    }
	    return null;
	}
	function getStorageItem(objectId) {
	    var jsonString = window.localStorage.getItem(objectId);
	    if (!jsonString) {
	        return undefined;
	    }
	    return JSON.parse(jsonString);
	}
	function setStorageItem(objectId, value) {
	    var jsonString = JSON.stringify(value);
	    window.localStorage.setItem(objectId, jsonString);
	}
	//# sourceMappingURL=calibration-utils.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var cubeVertices = [
	    -1.0, -1.0, 1.0,
	    1.0, -1.0, 1.0,
	    1.0, 1.0, 1.0,
	    -1.0, 1.0, 1.0,
	    -1.0, -1.0, -1.0,
	    -1.0, 1.0, -1.0,
	    1.0, 1.0, -1.0,
	    1.0, -1.0, -1.0,
	    -1.0, 1.0, -1.0,
	    -1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0,
	    1.0, 1.0, -1.0,
	    -1.0, -1.0, -1.0,
	    1.0, -1.0, -1.0,
	    1.0, -1.0, 1.0,
	    -1.0, -1.0, 1.0,
	    1.0, -1.0, -1.0,
	    1.0, 1.0, -1.0,
	    1.0, 1.0, 1.0,
	    1.0, -1.0, 1.0,
	    -1.0, -1.0, -1.0,
	    -1.0, -1.0, 1.0,
	    -1.0, 1.0, 1.0,
	    -1.0, 1.0, -1.0
	];
	var indices = [
	    0, 1, 2, 0, 2, 3,
	    4, 5, 6, 4, 6, 7,
	    8, 9, 10, 8, 10, 11,
	    12, 13, 14, 12, 14, 15,
	    16, 17, 18, 16, 18, 19,
	    20, 21, 22, 20, 22, 23 // left
	];
	var uvMap = [
	    // Front
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0,
	    // Back
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0,
	    // Top
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0,
	    // Bottom
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0,
	    // Right
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0,
	    // Left
	    0.0, 0.0, 0, 0,
	    1.0, 0.0, 0, 0,
	    1.0, 1.0, 0, 0,
	    0.0, 1.0, 0, 0
	];
	var CubeBase = (function () {
	    function CubeBase() {
	        this.vertices = [].concat(cubeVertices);
	        this.indices = [].concat(indices);
	        this.uvMap = [].concat(uvMap);
	    }
	    CubeBase.prototype.applyBounds = function (bounds) {
	        for (var i = 0; i < cubeVertices.length / 3; i++) {
	            var xNumber = 0 + i * 3;
	            var yNumber = 1 + i * 3;
	            var zNumber = 2 + i * 3;
	            this.vertices[xNumber] = bounds.scale * cubeVertices[xNumber] * bounds.widthX / 2;
	            this.vertices[yNumber] = bounds.scale * cubeVertices[yNumber] * bounds.widthY / 2;
	            this.vertices[zNumber] = bounds.scale * (bounds.ground + (cubeVertices[zNumber] + 1) * bounds.height / 2);
	        }
	    };
	    return CubeBase;
	}());
	exports.CubeBase = CubeBase;
	//# sourceMappingURL=mesh-data.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils = __webpack_require__(8);
	var mathUtils = __webpack_require__(9);
	var decompose = __webpack_require__(11);
	var drawDebugger = new utils.Debugger();
	var Mesh = (function () {
	    function Mesh(getHeading) {
	        this.getHeading = getHeading;
	        this.rotation = 0;
	        this.translation = {
	            x: 0,
	            y: 0,
	            z: 0
	        };
	        this.initialized = false;
	    }
	    Mesh.prototype.init = function (gl, oldWebGl) {
	        var _this = this;
	        if (this.initialized) {
	            return;
	        }
	        this.initBuffers(gl, oldWebGl);
	        var texture = oldWebGl.createTexture();
	        var image = new Image();
	        image.onload = function () {
	            _this.handleTextureLoaded(image, texture, gl, oldWebGl);
	        };
	        image.src = this.textureURI;
	        this.initialized = true;
	    };
	    Mesh.prototype.handleTextureLoaded = function (image, texture, gl, oldWebGl) {
	        oldWebGl.bindTexture(gl.TEXTURE_2D, texture);
	        oldWebGl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	        oldWebGl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	        oldWebGl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	        oldWebGl.generateMipmap(gl.TEXTURE_2D);
	        oldWebGl.bindTexture(gl.TEXTURE_2D, null);
	        this.texture = texture;
	    };
	    Mesh.prototype.initBuffers = function (gl, oldWebGl, bindAttributes) {
	        this.verticesBuffer = oldWebGl.createBuffer();
	        oldWebGl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
	        oldWebGl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	        if (bindAttributes) {
	            oldWebGl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
	        }
	        this.uvMapBuffer = oldWebGl.createBuffer();
	        oldWebGl.bindBuffer(gl.ARRAY_BUFFER, this.uvMapBuffer);
	        oldWebGl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvMap), gl.STATIC_DRAW);
	        if (bindAttributes) {
	            oldWebGl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
	        }
	        this.indicesBuffer = oldWebGl.createBuffer();
	        oldWebGl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
	        oldWebGl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	    };
	    Mesh.prototype.applyTransformation = function (initialMatrix) {
	        var matrices = [];
	        var matrixRotation = getMatrixRotation(initialMatrix);
	        var headingDelta = Math.PI + matrixRotation.heading + mathUtils.toRad(this.getHeading());
	        matrices.push(mathUtils.zRotation(this.rotation));
	        matrices.push(mathUtils.xRotation(-matrixRotation.pitch));
	        matrices.push(mathUtils.translation(this.translation.x, this.translation.y, this.translation.z));
	        matrices.push(mathUtils.zRotation(headingDelta));
	        matrices.push(initialMatrix);
	        return new Float32Array(mathUtils.multiplyMatrices(matrices));
	    };
	    Mesh.prototype.draw = function (gl, oldWebGl, uniforms) {
	        oldWebGl.disableVertexAttribArray(0);
	        oldWebGl.disableVertexAttribArray(1);
	        oldWebGl.enableVertexAttribArray(0);
	        oldWebGl.enableVertexAttribArray(1);
	        this.initBuffers(gl, oldWebGl, true);
	        oldWebGl.bindTexture(gl.TEXTURE_2D, this.texture);
	        oldWebGl.uniform4fv(uniforms.uniform4fv.location, [5, 5, 0, 0]);
	        oldWebGl.uniform1f(uniforms.uniform1f.location, 1);
	        if (uniforms.uniformMatrix4fv) {
	            oldWebGl.uniformMatrix4fv(uniforms.uniformMatrix4fv.location, uniforms.uniformMatrix4fv.transpose, this.applyTransformation(uniforms.uniformMatrix4fv.value));
	        }
	        oldWebGl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	    };
	    return Mesh;
	}());
	exports.Mesh = Mesh;
	function getMatrixRotation(matrix) {
	    var translation = [0, 0, 0];
	    var scale = [0, 0, 0];
	    var skew = [0, 0, 0];
	    var perspective = [0, 0, 0, 0];
	    var quaternion = [0, 0, 0, 0];
	    decompose(mathUtils.transpose(matrix), translation, scale, skew, perspective, quaternion);
	    drawDebugger.setValue('translation', translation);
	    drawDebugger.setValue('scale', scale);
	    drawDebugger.setValue('perspective', perspective);
	    drawDebugger.setValue('quaternion', quaternion);
	    return getQaternionRotation(quaternion);
	}
	function getQaternionRotation(quaternion) {
	    var q = quaternion;
	    var ysqr = q[1] * q[1];
	    var t0 = 2.0 * (q[3] * q[0] + q[1] * q[2]);
	    var t1 = 1.0 - 2.0 * (q[0] * q[0] + ysqr);
	    var roll = Math.atan2(t0, t1);
	    var t2 = 2.0 * (q[3] * q[1] - q[2] * q[0]);
	    t2 = t2 > 1.0 ? 1.0 : t2;
	    t2 = t2 < -1.0 ? -1.0 : t2;
	    var pitch = Math.asin(t2);
	    drawDebugger.setValue('pitch', pitch);
	    drawDebugger.setValue('roll', roll);
	    var t3 = 2.0 * (q[3] * q[2] + q[0] * q[1]);
	    var t4 = 1.0 - 2.0 * (q[1] * q[1] + q[2] * q[2]);
	    return { heading: Math.atan2(t3, t4), pitch: pitch };
	}
	var Uniforms = (function () {
	    function Uniforms() {
	    }
	    return Uniforms;
	}());
	exports.Uniforms = Uniforms;
	exports.activeMeshes = [];
	function drawScene(gl, oldWebGl, uniforms) {
	    exports.activeMeshes.forEach(function (mesh) {
	        if (!mesh.texture) {
	            mesh.init(gl, oldWebGl);
	            return;
	        }
	        mesh.draw(gl, oldWebGl, uniforms);
	    });
	}
	function init(canvasContainer) {
	    utils.setup(drawScene, function (gl) {
	        if (gl.canvasContainer === false) {
	            return false;
	        }
	        if (gl.canvasContainer === canvasContainer) {
	            return true;
	        }
	        if (isContainerOf(canvasContainer, gl.canvas)) {
	            gl.canvasContainer = canvasContainer;
	            return true;
	        }
	        if (gl.canvas && !gl.canvas.parentElement) {
	            return false;
	        }
	        gl.canvasContainer = false;
	        return false;
	    });
	}
	exports.init = init;
	function isContainerOf(container, element) {
	    var current = element;
	    while (current) {
	        if (container === current) {
	            return true;
	        }
	        current = current.parentElement;
	    }
	    return false;
	}
	function addMesh(mesh) {
	    exports.activeMeshes.push(mesh);
	}
	exports.addMesh = addMesh;
	function removeMesh(mesh) {
	    var filteredMeshes = [];
	    exports.activeMeshes.forEach(function (activeMesh) {
	        if (activeMesh === mesh) {
	            return;
	        }
	        filteredMeshes.push(activeMesh);
	    });
	    exports.activeMeshes = filteredMeshes;
	}
	exports.removeMesh = removeMesh;
	function setDebugAcceptor(acceptor) {
	    drawDebugger.setValueAcceptor(acceptor);
	}
	exports.setDebugAcceptor = setDebugAcceptor;
	//# sourceMappingURL=index.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var geoMathUtils = __webpack_require__(12);
	var NORMAL_COLOR = '#00FF00';
	var SELECTED_COLOR = '#0000FF';
	var Polygon = (function () {
	    function Polygon() {
	        this.displayListener = null;
	        this.position = {
	            x: 0,
	            y: 0
	        };
	        this.rotation = 0;
	    }
	    Polygon.prototype.transformate = function (start, end) {
	    };
	    Polygon.prototype.wheelScrolled = function (scrollEvent) {
	        if (this.displayListener) {
	            this.displayListener({ wheelEvent: scrollEvent });
	        }
	    };
	    Polygon.prototype.onDisplay = function () {
	        if (this.displayListener) {
	            this.displayListener({});
	        }
	    };
	    return Polygon;
	}());
	exports.Polygon = Polygon;
	var Region = (function () {
	    function Region(map, origin) {
	        this.map = map;
	        this.origin = origin;
	        this.polys = [];
	        this.selection = [];
	        this.controlsState = {
	            shiftPressed: false,
	            leftMousePressed: false,
	            middleMousePressed: false,
	            rotationPressed: false,
	            transformationPressed: false,
	            drag: {
	                startAtPosition: { x: 0, y: 0, screenX: 0, screenY: 0 },
	                lastPosition: { x: 0, y: 0, screenX: 0, screenY: 0 }
	            },
	            mousePosition: { x: 0, y: 0, screenX: 0, screenY: 0 }
	        };
	        this.setupRegionListeners();
	    }
	    Region.prototype.changeOrigin = function (newOrigin) {
	        var shift = geoMathUtils.toXY(this.origin.lat, this.origin.lon, newOrigin.lat, newOrigin.lon);
	        this.origin = newOrigin;
	        this.movePolygons(this.polys, { x: -shift.x, y: -shift.y });
	    };
	    Region.prototype.getAllPolygons = function () {
	        return [].concat(this.polys);
	    };
	    Region.prototype.addPolygon = function (poly) {
	        this.polys.push(poly);
	        this.displayPoly(poly);
	        this.setupListeners(poly);
	    };
	    Region.prototype.rotatePolygons = function (polys, start, end) {
	        var _this = this;
	        var x = 0;
	        var y = 0;
	        polys.forEach(function (poly) {
	            x += poly.position.x;
	            y += poly.position.y;
	        });
	        x = x / polys.length;
	        y = y / polys.length;
	        var selectionCenter = { x: x, y: y };
	        var rotation = getRotation(selectionCenter, start, end);
	        var cos = Math.cos(rotation);
	        var sin = Math.sin(rotation);
	        polys.forEach(function (poly) {
	            poly.rotation = poly.rotation + rotation;
	            poly.position = rotateVectorAround(poly.position, selectionCenter, sin, cos);
	            _this.displayPoly(poly);
	        });
	    };
	    Region.prototype.movePolygons = function (polys, shift) {
	        var _this = this;
	        polys.forEach(function (poly) {
	            poly.position.x = poly.position.x + shift.x;
	            poly.position.y = poly.position.y + shift.y;
	            _this.displayPoly(poly);
	        });
	    };
	    Region.prototype.wheelScrolled = function (polys, event) {
	        var _this = this;
	        polys.forEach(function (poly) {
	            poly.wheelScrolled(event);
	            _this.displayPoly(poly);
	        });
	    };
	    Region.prototype.transformPolygons = function (polys, start, end) {
	        var _this = this;
	        polys.forEach(function (poly) {
	            poly.transformate(start, end);
	            _this.displayPoly(poly);
	        });
	    };
	    Region.prototype.setPolygonsPosition = function (polys, position) {
	        var _this = this;
	        var x = 0;
	        var y = 0;
	        polys.forEach(function (poly) {
	            x += poly.position.x;
	            y += poly.position.y;
	        });
	        x = x / polys.length;
	        y = y / polys.length;
	        polys.forEach(function (poly) {
	            _this.hidePoly(poly);
	            poly.position.x = poly.position.x - x + position.x;
	            poly.position.y = poly.position.y - y + position.y;
	            _this.displayPoly(poly);
	        });
	    };
	    Region.prototype.clearSelection = function () {
	        this.selection = [];
	    };
	    ;
	    Region.prototype.addSelection = function (selection) {
	        var _this = this;
	        var newSelection = [];
	        this.selection.forEach(function (poly) {
	            for (var i = 0; i < selection.length; i++) {
	                if (selection[i] === poly) {
	                    return;
	                }
	            }
	            newSelection.push(poly);
	        });
	        selection.forEach(function (poly) {
	            if (_this.isSelected(poly)) {
	                return;
	            }
	            newSelection.push(poly);
	        });
	        this.selection = newSelection;
	    };
	    Region.prototype.drawSelectionState = function () {
	        var _this = this;
	        this.polys.forEach(function (poly) {
	            poly.gPoly.setOptions({
	                fillColor: _this.isSelected(poly) ? SELECTED_COLOR : NORMAL_COLOR,
	                strokeColor: _this.isSelected(poly) ? SELECTED_COLOR : NORMAL_COLOR
	            });
	        });
	    };
	    Region.prototype.isSelected = function (poly) {
	        for (var i = 0; i < this.selection.length; i++) {
	            if (this.selection[i] === poly) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Region.prototype.setupListeners = function (poly) {
	        var _this = this;
	        google.maps.event.addListener(poly.gPoly, 'click', function (event) {
	            if (!_this.controlsState.shiftPressed) {
	                _this.clearSelection();
	            }
	            _this.addSelection([poly]);
	            _this.drawSelectionState();
	        });
	    };
	    Region.prototype.setupRegionListeners = function () {
	        var _this = this;
	        var div = this.map.getDiv();
	        div.tabIndex = 0;
	        div.addEventListener("mouseover", function (event) {
	            div.focus();
	            return preventDefault(event);
	        });
	        div.addEventListener("mousedown", function (event) {
	            if (event.which === 1) {
	                _this.controlsState.leftMousePressed = true;
	                _this.setupDragStartPositions(event);
	            }
	            else if (event.which === 2) {
	                _this.controlsState.middleMousePressed = true;
	                _this.setupDragStartPositions(event);
	            }
	            return preventDefault(event);
	        });
	        div.addEventListener("mouseup", function (event) {
	            if (event.which === 1) {
	                _this.controlsState.leftMousePressed = false;
	            }
	            else if (event.which === 2) {
	                _this.controlsState.middleMousePressed = false;
	            }
	            return preventDefault(event);
	        });
	        div.addEventListener("mousewheel", function (event) {
	            var delta = event.deltaY;
	            _this.wheelScrolled(_this.selection, event);
	            return preventDefault(event);
	        });
	        div.addEventListener("mousemove", function (event) {
	            if (_this.controlsState.leftMousePressed && _this.selection.length > 0) {
	                _this.setupMousePositions(event);
	                if (_this.controlsState.rotationPressed) {
	                    _this.rotatePolygons(_this.selection, _this.controlsState.drag.lastPosition, _this.controlsState.mousePosition);
	                }
	                else if (_this.controlsState.transformationPressed) {
	                    _this.transformPolygons(_this.selection, _this.controlsState.drag.lastPosition, _this.controlsState.mousePosition);
	                }
	                else {
	                    var positionShift = {
	                        x: _this.controlsState.mousePosition.x - _this.controlsState.drag.lastPosition.x,
	                        y: _this.controlsState.mousePosition.y - _this.controlsState.drag.lastPosition.y
	                    };
	                    _this.movePolygons(_this.selection, positionShift);
	                }
	                _this.setupDragLastPositions();
	            }
	            else if (_this.controlsState.middleMousePressed) {
	                _this.setupMousePositions(event);
	                var positionShift = {
	                    x: _this.controlsState.mousePosition.screenX - _this.controlsState.drag.lastPosition.screenX,
	                    y: _this.controlsState.mousePosition.screenY - _this.controlsState.drag.lastPosition.screenY
	                };
	                _this.map.panBy(-positionShift.x, -positionShift.y);
	                _this.setupDragLastPositions();
	            }
	            return preventDefault(event);
	        });
	        this.setupKey('Shift', 'shiftPressed');
	        this.setupKey('KeyR', 'rotationPressed');
	        this.setupKey('KeyT', 'transformationPressed');
	    };
	    Region.prototype.setupMousePositions = function (event) {
	        var currentPosition = this.getMousePosition(event);
	        var currentScreenPosition = this.getMouseScreenPosition(event);
	        this.controlsState.mousePosition.x = currentPosition.x;
	        this.controlsState.mousePosition.y = currentPosition.y;
	        this.controlsState.mousePosition.screenX = currentScreenPosition.x;
	        this.controlsState.mousePosition.screenY = currentScreenPosition.y;
	    };
	    Region.prototype.setupDragStartPositions = function (event) {
	        var currentPosition = this.getMousePosition(event);
	        var currentScreenPosition = this.getMouseScreenPosition(event);
	        this.controlsState.drag.startAtPosition = { x: currentPosition.x, y: currentPosition.y, screenX: currentScreenPosition.x, screenY: currentScreenPosition.y };
	        this.controlsState.drag.lastPosition = { x: currentPosition.x, y: currentPosition.y, screenX: currentScreenPosition.x, screenY: currentScreenPosition.y };
	    };
	    Region.prototype.setupDragLastPositions = function () {
	        this.controlsState.drag.lastPosition.x = this.controlsState.mousePosition.x;
	        this.controlsState.drag.lastPosition.y = this.controlsState.mousePosition.y;
	        this.controlsState.drag.lastPosition.screenX = this.controlsState.mousePosition.screenX;
	        this.controlsState.drag.lastPosition.screenY = this.controlsState.mousePosition.screenY;
	    };
	    Region.prototype.setupKey = function (code, inputFlagName, toggle) {
	        var _this = this;
	        var div = this.map.getDiv();
	        div.addEventListener("keydown", function (event) {
	            if (event.key === code || event.code === code) {
	                _this.controlsState[inputFlagName] = true;
	            }
	            return preventDefault(event);
	        });
	        div.addEventListener("keyup", function (event) {
	            if (event.key === code || event.code === code) {
	                _this.controlsState[inputFlagName] = false;
	            }
	            return preventDefault(event);
	        });
	    };
	    Region.prototype.displayPoly = function (poly) {
	        var paths = [];
	        var sin = Math.sin(poly.rotation);
	        var cos = Math.cos(poly.rotation);
	        for (var i = 0; i < poly.vertices.length / 2; i++) {
	            var vertex = {
	                x: poly.vertices[i * 2],
	                y: poly.vertices[i * 2 + 1]
	            };
	            var rotated = rotateVector(vertex, sin, cos);
	            var latlon = geoMathUtils.toLatLon(this.origin.lat, this.origin.lon, poly.position.x + rotated.x, poly.position.y + rotated.y);
	            var result = {
	                lat: latlon.lat,
	                lng: latlon.lon
	            };
	            paths.push(result);
	        }
	        var gPoly = poly.gPoly || new google.maps.Polygon({});
	        gPoly.setOptions({
	            map: this.map,
	            paths: paths,
	            strokeColor: this.isSelected(poly) ? SELECTED_COLOR : NORMAL_COLOR,
	            strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: this.isSelected(poly) ? SELECTED_COLOR : NORMAL_COLOR,
	            fillOpacity: 0.35,
	            draggable: false,
	            geodesic: true
	        });
	        poly.gPoly = gPoly;
	        poly.onDisplay();
	    };
	    Region.prototype.hidePoly = function (poly) {
	        var gPoly = poly.gPoly;
	        if (gPoly) {
	            gPoly.setMap(null);
	        }
	    };
	    Region.prototype.getMousePosition = function (event) {
	        var point = {
	            x: event.offsetX,
	            y: event.offsetY
	        };
	        var mapPosition = fromPixelToLatLng(this.map, point);
	        return geoMathUtils.toXY(this.origin.lat, this.origin.lon, mapPosition.lat(), mapPosition.lng());
	    };
	    Region.prototype.getMouseScreenPosition = function (event) {
	        var point = {
	            x: event.offsetX,
	            y: event.offsetY
	        };
	        return point;
	    };
	    return Region;
	}());
	exports.Region = Region;
	var Rectangle = (function (_super) {
	    __extends(Rectangle, _super);
	    function Rectangle(bounds, position) {
	        _super.call(this);
	        this.bounds = bounds;
	        this.indeces = {
	            'left-bottom': { x: 0, y: 1 },
	            'left-top': { x: 2, y: 3 },
	            'right-top': { x: 4, y: 5 },
	            'right-bottom': { x: 6, y: 7 }
	        };
	        this.sides = {
	            left: ['left-bottom', 'left-top', 'width', -1],
	            right: ['right-bottom', 'right-top', 'width', 1],
	            top: ['left-top', 'right-top', 'height', 1],
	            bottom: ['left-bottom', 'right-bottom', 'height', -1]
	        };
	        this.position = position;
	        this.setupVertices();
	    }
	    Rectangle.prototype.setupVertices = function () {
	        var x = this.bounds.width / 2;
	        var y = this.bounds.height / 2;
	        if (!this.vertices) {
	            this.vertices = [];
	        }
	        this.vertices[0] = -x;
	        this.vertices[1] = -y;
	        this.vertices[2] = -x;
	        this.vertices[3] = y;
	        this.vertices[4] = x;
	        this.vertices[5] = y;
	        this.vertices[6] = x;
	        this.vertices[7] = -y;
	    };
	    Rectangle.prototype.transformate = function (start, end) {
	        var relativeStart = { x: start.x - this.position.x, y: start.y - this.position.y };
	        var relativeEnd = { x: end.x - this.position.x, y: end.y - this.position.y };
	        var sin = Math.sin(-this.rotation);
	        var cos = Math.cos(-this.rotation);
	        relativeStart = rotateVector(relativeStart, sin, cos);
	        relativeEnd = rotateVector(relativeEnd, sin, cos);
	        var deltas = this.getDeltas(relativeStart, relativeEnd);
	        if (!deltas) {
	            return;
	        }
	        this.bounds.width += deltas.width;
	        this.bounds.height += deltas.height;
	        deltas = rotateVector(deltas, -sin, cos);
	        this.position.x += deltas.x;
	        this.position.y += deltas.y;
	        this.setupVertices();
	    };
	    Rectangle.prototype.getDeltas = function (start, end) {
	        var sideNames = Object.keys(this.sides);
	        for (var i = 0; i < 4; i++) {
	            var side = this.sides[sideNames[i]];
	            var index1 = this.indeces[side[0]];
	            var index2 = this.indeces[side[1]];
	            var v1 = { x: this.vertices[index1.x], y: this.vertices[index1.y] };
	            var v2 = { x: this.vertices[index2.x], y: this.vertices[index2.y] };
	            if (isPointBetween(v1, v2, start)) {
	                var direction = side[2] === "width" ? { x: 1, y: 0 } : { x: 0, y: 1 };
	                var shift = { x: end.x - start.x, y: end.y - start.y };
	                var delta = projection(shift, direction);
	                return {
	                    width: direction.x * delta * side[3],
	                    height: direction.y * delta * side[3],
	                    x: direction.x * delta / 2,
	                    y: direction.y * delta / 2
	                };
	            }
	        }
	        return null;
	    };
	    return Rectangle;
	}(Polygon));
	exports.Rectangle = Rectangle;
	function fromLatLngToPixel(map, position) {
	    var scale = Math.pow(2, map.getZoom());
	    var proj = map.getProjection();
	    var bounds = map.getBounds();
	    var nw = proj.fromLatLngToPoint(new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng()));
	    var point = proj.fromLatLngToPoint(position);
	    return new google.maps.Point(Math.floor((point.x - nw.x) * scale), Math.floor((point.y - nw.y) * scale));
	}
	function fromPixelToLatLng(map, pixel) {
	    var scale = Math.pow(2, map.getZoom());
	    var proj = map.getProjection();
	    var bounds = map.getBounds();
	    var nw = proj.fromLatLngToPoint(new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng()));
	    var point = new google.maps.Point();
	    point.x = pixel.x / scale + nw.x;
	    point.y = pixel.y / scale + nw.y;
	    return proj.fromPointToLatLng(point);
	}
	function getRotation(position, dragStart, dragEnd) {
	    var v1 = { x: dragStart.x - position.x, y: dragStart.y - position.y };
	    var v2 = { x: dragEnd.x - position.x, y: dragEnd.y - position.y };
	    var l1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
	    var l2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
	    var result = Math.sign(v1.x * v2.y - v1.y * v2.x) * Math.acos(dot(v1, v2) / (l1 * l2));
	    return result || 0;
	}
	function rotateVectorAround(vector, around, sin, cos) {
	    var oldVector = {
	        x: vector.x - around.x,
	        y: vector.y - around.y
	    };
	    var newVector = rotateVector(oldVector, sin, cos);
	    return {
	        x: around.x + newVector.x,
	        y: around.y + newVector.y
	    };
	}
	function length(v) {
	    return Math.sqrt(v.x * v.x + v.y * v.y);
	}
	function distance(v1, v2) {
	    var diff = { x: v1.x - v2.x, y: v1.y - v2.y };
	    return length(diff);
	}
	function rotateVector(vector, sin, cos) {
	    return {
	        x: vector.x * cos - vector.y * sin,
	        y: vector.y * cos + vector.x * sin
	    };
	}
	function dot(v1, v2) {
	    return v1.x * v2.x + v1.y * v2.y;
	}
	function cross(v1, v2) {
	    return v1.x * v2.y - v1.y * v2.x;
	}
	function projection(v1, v2) {
	    return dot(v1, v2) / length(v2);
	}
	function isPointBetween(v1, v2, point) {
	    var proj1 = projection(v1, point);
	    var proj2 = projection(v2, point);
	    if (proj1 <= 0 || proj2 <= 0) {
	        return false;
	    }
	    var cross1 = cross(v1, point);
	    var cross2 = cross(v2, point);
	    if (Math.sign(cross1) + Math.sign(cross2) === 0) {
	        return true;
	    }
	    return false;
	}
	function preventDefault(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    return false;
	}
	;
	//# sourceMappingURL=index.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/main.d.ts" />
	var oldWebGl = {};
	var lastCalls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var desiredCases = [];
	desiredCases.push([
	    'uniform1f',
	    'drawElements',
	    'uniform4fv',
	    'bindTexture',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer'
	]);
	desiredCases.push([
	    'uniform1f',
	    'drawElements',
	    'uniform1f',
	    'uniform4fv',
	    'bindTexture',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer'
	]);
	desiredCases.push([
	    'drawElements',
	    'uniform4fv',
	    'bindTexture',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer'
	]);
	desiredCases.push([
	    'drawElements',
	    'uniform1f',
	    'uniform4fv',
	    'bindTexture',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer',
	    'vertexAttribPointer',
	    'bindBuffer'
	]);
	function methodCalled(methodName) {
	    lastCalls.unshift(methodName);
	    lastCalls.pop();
	}
	function getOldWebgl(glInstance) {
	    var result = new Object(oldWebGl);
	    result.glInstance = glInstance;
	    return result;
	}
	function isDesiredCase() {
	    for (var i = 0; i < desiredCases.length; i++) {
	        if (isDesiredSingleCase(desiredCases[i])) {
	            return true;
	        }
	    }
	    return false;
	}
	function isDesiredSingleCase(desiredCase) {
	    for (var i = 0; i < desiredCase.length; i++) {
	        if (desiredCase[i] !== lastCalls[i]) {
	            return false;
	        }
	    }
	    return true;
	}
	function webGlInject(methodName, injectionBody, isGlEnabled) {
	    var oldMethod = WebGLRenderingContext.prototype[methodName];
	    register(methodName);
	    WebGLRenderingContext.prototype[methodName] = function () {
	        if (!isGlEnabled(this)) {
	            return oldMethod.apply(this, arguments);
	        }
	        var newArgumens = [oldMethod, this, []];
	        for (var i = 0; i < arguments.length; i++) {
	            newArgumens[2].push(arguments[i]);
	        }
	        return injectionBody.apply(null, newArgumens);
	    };
	}
	function register(methodName) {
	    var field = WebGLRenderingContext.prototype[methodName];
	    oldWebGl[methodName] = function (a, b, c, d, e, f, g, h, Ii, Jj, Kk) {
	        var filteredArgs = [];
	        var i;
	        for (i = arguments.length - 1; i >= 0; i--) {
	            if (arguments[i] !== undefined) {
	                break;
	            }
	        }
	        var count = i + 1;
	        for (i = 0; i < count; i++) {
	            filteredArgs.push(arguments[i]);
	        }
	        return field.apply(this.glInstance, filteredArgs);
	    };
	}
	function glMethodsList() {
	    var result = [];
	    Object.keys(WebGLRenderingContext.prototype).forEach(function (methodName) {
	        var field;
	        try {
	            var field = WebGLRenderingContext.prototype[methodName];
	        }
	        catch (exception) {
	        }
	        var isMethod = field && field.toString && field && field.toString().indexOf("function") === 0;
	        if (isMethod) {
	            result.push(methodName);
	        }
	    });
	    return result;
	}
	var lastTexture;
	var lastUniform4fv;
	var lastUniform1f;
	var preLastUniform1f;
	var lastProgram;
	var lastMatrices = [];
	function findLastMatrix4fv() {
	    for (var i = 0; i < lastMatrices.length; i++) {
	        if (lastMatrices[i].program === lastProgram) {
	            return lastMatrices[i].matrix;
	        }
	    }
	    return null;
	}
	function setup(callback, isGlEnabled) {
	    var methods = glMethodsList();
	    methods.forEach(function (methodName) {
	        webGlInject(methodName + "", function (oldMethod, gl, args) {
	            if (!gl.oldWebGl) {
	                gl.oldWebGl = getOldWebgl(gl);
	            }
	            //console.log(methodName);
	            if (methodName === "useProgram") {
	                lastProgram = args[0];
	            }
	            if (methodName === 'uniformMatrix4fv') {
	                var lastUniformMatrix4fv = [args[0], args[1], args[2]];
	                var container;
	                for (var i = 0; i < lastMatrices.length; i++) {
	                    var currentContainer = lastMatrices[i];
	                    if (currentContainer.program === lastProgram) {
	                        container = currentContainer;
	                        break;
	                    }
	                }
	                if (!container) {
	                    container = {
	                        program: lastProgram
	                    };
	                    lastMatrices.push(container);
	                }
	                container.matrix = lastUniformMatrix4fv;
	            }
	            if (methodName === 'bindTexture') {
	                lastTexture = args[1];
	            }
	            if (methodName === 'uniform4fv') {
	                lastUniform4fv = [args[0], args[1]];
	            }
	            if (methodName === 'uniform1f') {
	                preLastUniform1f = lastUniform1f;
	                lastUniform1f = [args[0], args[1]];
	            }
	            if (methodName === 'disableVertexAttribArray' && isDesiredCase()) {
	                var uniformMatrix4fv = findLastMatrix4fv();
	                callback(gl, gl.oldWebGl, {
	                    uniform4fv: {
	                        location: lastUniform4fv[0],
	                        value: lastUniform4fv[1]
	                    },
	                    uniform1f: {
	                        location: preLastUniform1f[0],
	                        value: preLastUniform1f[1]
	                    },
	                    uniformMatrix4fv: uniformMatrix4fv ? {
	                        location: uniformMatrix4fv[0],
	                        transpose: uniformMatrix4fv[1],
	                        value: uniformMatrix4fv[2]
	                    } : null
	                });
	                gl.oldWebGl.uniform1f(lastUniform1f[0], lastUniform1f[1]);
	                if (uniformMatrix4fv) {
	                    gl.oldWebGl.uniformMatrix4fv(uniformMatrix4fv[0], uniformMatrix4fv[1], uniformMatrix4fv[2]);
	                }
	                gl.oldWebGl.bindTexture(gl.TEXTURE_2D, lastTexture);
	            }
	            var result = oldMethod.apply(gl, args);
	            methodCalled(methodName);
	            return result;
	        }, isGlEnabled);
	    });
	}
	exports.setup = setup;
	var Debugger = (function () {
	    function Debugger() {
	    }
	    Debugger.prototype.setValueAcceptor = function (acceptor) {
	        this.acceptor = acceptor;
	    };
	    Debugger.prototype.setValue = function (name, value) {
	        if (!this.acceptor) {
	            return;
	        }
	        this.acceptor.accept(name, value);
	    };
	    return Debugger;
	}());
	exports.Debugger = Debugger;
	//# sourceMappingURL=utils.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function translation(tx, ty, tz) {
	    return [
	        1, 0, 0, 0,
	        0, 1, 0, 0,
	        0, 0, 1, 0,
	        tx, ty, tz, 1
	    ];
	}
	exports.translation = translation;
	function xRotation(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);
	    return [
	        1, 0, 0, 0,
	        0, c, s, 0,
	        0, -s, c, 0,
	        0, 0, 0, 1
	    ];
	}
	exports.xRotation = xRotation;
	function yRotation(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);
	    return [
	        c, 0, -s, 0,
	        0, 1, 0, 0,
	        s, 0, c, 0,
	        0, 0, 0, 1
	    ];
	}
	exports.yRotation = yRotation;
	function zRotation(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);
	    return [
	        c, s, 0, 0,
	        -s, c, 0, 0,
	        0, 0, 1, 0,
	        0, 0, 0, 1
	    ];
	}
	exports.zRotation = zRotation;
	function scaling(sx, sy, sz) {
	    return [
	        sx, 0, 0, 0,
	        0, sy, 0, 0,
	        0, 0, sz, 0,
	        0, 0, 0, 1
	    ];
	}
	exports.scaling = scaling;
	function multiplyMatrices(matrices) {
	    var resultMatrix = matrices[0];
	    for (var i = 1; i < matrices.length; i++) {
	        resultMatrix = multiply(matrices[i], resultMatrix);
	    }
	    return resultMatrix;
	}
	exports.multiplyMatrices = multiplyMatrices;
	function multiply(a, b) {
	    var a00 = a[0 * 4 + 0];
	    var a01 = a[0 * 4 + 1];
	    var a02 = a[0 * 4 + 2];
	    var a03 = a[0 * 4 + 3];
	    var a10 = a[1 * 4 + 0];
	    var a11 = a[1 * 4 + 1];
	    var a12 = a[1 * 4 + 2];
	    var a13 = a[1 * 4 + 3];
	    var a20 = a[2 * 4 + 0];
	    var a21 = a[2 * 4 + 1];
	    var a22 = a[2 * 4 + 2];
	    var a23 = a[2 * 4 + 3];
	    var a30 = a[3 * 4 + 0];
	    var a31 = a[3 * 4 + 1];
	    var a32 = a[3 * 4 + 2];
	    var a33 = a[3 * 4 + 3];
	    var b00 = b[0 * 4 + 0];
	    var b01 = b[0 * 4 + 1];
	    var b02 = b[0 * 4 + 2];
	    var b03 = b[0 * 4 + 3];
	    var b10 = b[1 * 4 + 0];
	    var b11 = b[1 * 4 + 1];
	    var b12 = b[1 * 4 + 2];
	    var b13 = b[1 * 4 + 3];
	    var b20 = b[2 * 4 + 0];
	    var b21 = b[2 * 4 + 1];
	    var b22 = b[2 * 4 + 2];
	    var b23 = b[2 * 4 + 3];
	    var b30 = b[3 * 4 + 0];
	    var b31 = b[3 * 4 + 1];
	    var b32 = b[3 * 4 + 2];
	    var b33 = b[3 * 4 + 3];
	    return [
	        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
	        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
	        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
	        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
	        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
	        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
	        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
	        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
	        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
	        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
	        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
	        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
	        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
	        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
	        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
	        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
	    ];
	}
	exports.multiply = multiply;
	function transpose(matrix) {
	    var transposed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	    for (var i = 0; i < 4; i++) {
	        for (var j = 0; j < 4; j++) {
	            var index1 = 4 * i + j;
	            var index2 = 4 * j + i;
	            transposed[index1] = matrix[index2];
	        }
	    }
	    return transposed;
	}
	exports.transpose = transpose;
	var radToGrad = 180 / Math.PI;
	function toRad(grad) {
	    return grad / radToGrad;
	}
	exports.toRad = toRad;
	function toGrad(rad) {
	    return radToGrad * rad;
	}
	exports.toGrad = toGrad;
	function normalizeAngleGrad(grad) {
	    var rad = toRad(grad);
	    return toGrad(Math.atan2(Math.sin(rad), Math.cos(rad)));
	}
	exports.normalizeAngleGrad = normalizeAngleGrad;
	function normalizeAngleRad(rad) {
	    return Math.atan2(Math.sin(rad), Math.cos(rad));
	}
	exports.normalizeAngleRad = normalizeAngleRad;
	function normalize(v) {
	    var length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	    return { x: v.x / length, y: v.y / length, z: v.z / length };
	}
	exports.normalize = normalize;
	//# sourceMappingURL=mathUtils.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	(function(){

	  //I should make this a UMD sometime
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
	  module.exports = LeastSquares
	} else {
	  window.lsq = LeastSquares
	}

	function LeastSquares (X, Y, computeError, ret) {
	  if (typeof computeError == 'object') {
	    ret = computeError
	    computeError = false
	  }

	  if (typeof ret == 'undefined') ret = {}

	  var sumX = 0
	  var sumY = 0
	  var sumXY = 0
	  var sumXSq = 0
	  var N = X.length

	  for(var i = 0; i < N; ++i) {
	    sumX += X[i]
	    sumY += Y[i]
	    sumXY += X[i] * Y[i]
	    sumXSq += X[i] * X[i]
	  }

	  ret.m = ((sumXY - sumX * sumY / N) ) / (sumXSq - sumX * sumX / N)
	  ret.b = sumY / N - ret.m * sumX / N

	  if (computeError) {
	    var varSum = 0
	    for (var j = 0; j < N; ++j) {
	      varSum += (Y[j] - ret.b - ret.m*X[j]) * (Y[j] - ret.b - ret.m*X[j])
	    }

	    var delta = N * sumXSq - sumX*sumX
	    var vari = 1.0 / (N - 2.0) * varSum

	    ret.bErr = Math.sqrt(vari / delta * sumXSq)
	    ret.mErr = Math.sqrt(N / delta * vari)
	  }

	  return function(x) {
	    return ret.m * x + ret.b
	  }
	}

	})();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint unused:true*/
	/*
	Input:  matrix      ; a 4x4 matrix
	Output: translation ; a 3 component vector
	        scale       ; a 3 component vector
	        skew        ; skew factors XY,XZ,YZ represented as a 3 component vector
	        perspective ; a 4 component vector
	        quaternion  ; a 4 component vector
	Returns false if the matrix cannot be decomposed, true if it can


	References:
	https://github.com/kamicane/matrix3d/blob/master/lib/Matrix3d.js
	https://github.com/ChromiumWebApps/chromium/blob/master/ui/gfx/transform_util.cc
	http://www.w3.org/TR/css3-transforms/#decomposing-a-3d-matrix
	*/

	var normalize = __webpack_require__(13)

	var create = __webpack_require__(14)
	var clone = __webpack_require__(15)
	var determinant = __webpack_require__(16)
	var invert = __webpack_require__(17)
	var transpose = __webpack_require__(18)
	var vec3 = {
	    length: __webpack_require__(19),
	    normalize: __webpack_require__(20),
	    dot: __webpack_require__(21),
	    cross: __webpack_require__(22)
	}

	var tmp = create()
	var perspectiveMatrix = create()
	var tmpVec4 = [0, 0, 0, 0]
	var row = [ [0,0,0], [0,0,0], [0,0,0] ]
	var pdum3 = [0,0,0]

	module.exports = function decomposeMat4(matrix, translation, scale, skew, perspective, quaternion) {
	    if (!translation) translation = [0,0,0]
	    if (!scale) scale = [0,0,0]
	    if (!skew) skew = [0,0,0]
	    if (!perspective) perspective = [0,0,0,1]
	    if (!quaternion) quaternion = [0,0,0,1]

	    //normalize, if not possible then bail out early
	    if (!normalize(tmp, matrix))
	        return false

	    // perspectiveMatrix is used to solve for perspective, but it also provides
	    // an easy way to test for singularity of the upper 3x3 component.
	    clone(perspectiveMatrix, tmp)

	    perspectiveMatrix[3] = 0
	    perspectiveMatrix[7] = 0
	    perspectiveMatrix[11] = 0
	    perspectiveMatrix[15] = 1

	    // If the perspectiveMatrix is not invertible, we are also unable to
	    // decompose, so we'll bail early. Constant taken from SkMatrix44::invert.
	    if (Math.abs(determinant(perspectiveMatrix) < 1e-8))
	        return false

	    var a03 = tmp[3], a13 = tmp[7], a23 = tmp[11],
	            a30 = tmp[12], a31 = tmp[13], a32 = tmp[14], a33 = tmp[15]

	    // First, isolate perspective.
	    if (a03 !== 0 || a13 !== 0 || a23 !== 0) {
	        tmpVec4[0] = a03
	        tmpVec4[1] = a13
	        tmpVec4[2] = a23
	        tmpVec4[3] = a33

	        // Solve the equation by inverting perspectiveMatrix and multiplying
	        // rightHandSide by the inverse.
	        // resuing the perspectiveMatrix here since it's no longer needed
	        var ret = invert(perspectiveMatrix, perspectiveMatrix)
	        if (!ret) return false
	        transpose(perspectiveMatrix, perspectiveMatrix)

	        //multiply by transposed inverse perspective matrix, into perspective vec4
	        vec4multMat4(perspective, tmpVec4, perspectiveMatrix)
	    } else { 
	        //no perspective
	        perspective[0] = perspective[1] = perspective[2] = 0
	        perspective[3] = 1
	    }

	    // Next take care of translation
	    translation[0] = a30
	    translation[1] = a31
	    translation[2] = a32

	    // Now get scale and shear. 'row' is a 3 element array of 3 component vectors
	    mat3from4(row, tmp)

	    // Compute X scale factor and normalize first row.
	    scale[0] = vec3.length(row[0])
	    vec3.normalize(row[0], row[0])

	    // Compute XY shear factor and make 2nd row orthogonal to 1st.
	    skew[0] = vec3.dot(row[0], row[1])
	    combine(row[1], row[1], row[0], 1.0, -skew[0])

	    // Now, compute Y scale and normalize 2nd row.
	    scale[1] = vec3.length(row[1])
	    vec3.normalize(row[1], row[1])
	    skew[0] /= scale[1]

	    // Compute XZ and YZ shears, orthogonalize 3rd row
	    skew[1] = vec3.dot(row[0], row[2])
	    combine(row[2], row[2], row[0], 1.0, -skew[1])
	    skew[2] = vec3.dot(row[1], row[2])
	    combine(row[2], row[2], row[1], 1.0, -skew[2])

	    // Next, get Z scale and normalize 3rd row.
	    scale[2] = vec3.length(row[2])
	    vec3.normalize(row[2], row[2])
	    skew[1] /= scale[2]
	    skew[2] /= scale[2]


	    // At this point, the matrix (in rows) is orthonormal.
	    // Check for a coordinate system flip.  If the determinant
	    // is -1, then negate the matrix and the scaling factors.
	    vec3.cross(pdum3, row[1], row[2])
	    if (vec3.dot(row[0], pdum3) < 0) {
	        for (var i = 0; i < 3; i++) {
	            scale[i] *= -1;
	            row[i][0] *= -1
	            row[i][1] *= -1
	            row[i][2] *= -1
	        }
	    }

	    // Now, get the rotations out
	    quaternion[0] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0))
	    quaternion[1] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0))
	    quaternion[2] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0))
	    quaternion[3] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0))

	    if (row[2][1] > row[1][2])
	        quaternion[0] = -quaternion[0]
	    if (row[0][2] > row[2][0])
	        quaternion[1] = -quaternion[1]
	    if (row[1][0] > row[0][1])
	        quaternion[2] = -quaternion[2]
	    return true
	}

	//will be replaced by gl-vec4 eventually
	function vec4multMat4(out, a, m) {
	    var x = a[0], y = a[1], z = a[2], w = a[3];
	    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	    return out;
	}

	//gets upper-left of a 4x4 matrix into a 3x3 of vectors
	function mat3from4(out, mat4x4) {
	    out[0][0] = mat4x4[0]
	    out[0][1] = mat4x4[1]
	    out[0][2] = mat4x4[2]
	    
	    out[1][0] = mat4x4[4]
	    out[1][1] = mat4x4[5]
	    out[1][2] = mat4x4[6]

	    out[2][0] = mat4x4[8]
	    out[2][1] = mat4x4[9]
	    out[2][2] = mat4x4[10]
	}

	function combine(out, a, b, scale1, scale2) {
	    out[0] = a[0] * scale1 + b[0] * scale2
	    out[1] = a[1] * scale1 + b[1] * scale2
	    out[2] = a[2] * scale1 + b[2] * scale2
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var geodesy = __webpack_require__(23);
	function toLatLon(lat0, lon0, x, y) {
	    var dimension = getGeoDimension(lat0, lon0, 10000);
	    return {
	        lat: lat0 + y * dimension.ky,
	        lon: lon0 + x * dimension.kx
	    };
	}
	exports.toLatLon = toLatLon;
	function toXY(lat0, lon0, lat, lon) {
	    var dimension = getGeoDimension(lat0, lon0, 10000);
	    var inverted = {
	        kLat: 1 / dimension.ky,
	        kLon: 1 / dimension.kx
	    };
	    return {
	        x: (lon - lon0) * inverted.kLon,
	        y: (lat - lat0) * inverted.kLat
	    };
	}
	exports.toXY = toXY;
	function getGeoDimension(lat, lon, accuracy) {
	    var deltaLat = lat / accuracy;
	    var deltaLon = lon / accuracy;
	    var latLon0 = new geodesy.LatLonEllipsoidal(lat, lon);
	    var latLonX = new geodesy.LatLonEllipsoidal(lat, lon + deltaLon);
	    var latLonY = new geodesy.LatLonEllipsoidal(lat + deltaLat, lon);
	    var v0 = latLon0.toCartesian();
	    var vx = latLonX.toCartesian();
	    var vy = latLonY.toCartesian();
	    var x = vx.minus(v0).length();
	    var y = vy.minus(v0).length();
	    return {
	        kx: deltaLon / x,
	        ky: deltaLat / y
	    };
	}
	//# sourceMappingURL=index.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function normalize(out, mat) {
	    var m44 = mat[15]
	    // Cannot normalize.
	    if (m44 === 0) 
	        return false
	    var scale = 1 / m44
	    for (var i=0; i<16; i++)
	        out[i] = mat[i] * scale
	    return true
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = create;

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	function create() {
	    var out = new Float32Array(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = clone;

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	function clone(a) {
	    var out = new Float32Array(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = determinant;

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;

	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = invert;

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function invert(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,

	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return out;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = transpose;

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function transpose(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];

	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }
	    
	    return out;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = length;

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2]
	    return Math.sqrt(x*x + y*y + z*z)
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = normalize;

	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	function normalize(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2]
	    var len = x*x + y*y + z*z
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len)
	        out[0] = a[0] * len
	        out[1] = a[1] * len
	        out[2] = a[2] * len
	    }
	    return out
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = dot;

	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = cross;

	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function cross(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2],
	        bx = b[0], by = b[1], bz = b[2]

	    out[0] = ay * bz - az * by
	    out[1] = az * bx - ax * bz
	    out[2] = ax * by - ay * bx
	    return out
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* npm main module */
	'use strict';
	exports.LatLonSpherical   = __webpack_require__(24);
	exports.LatLonEllipsoidal = __webpack_require__(25);
	// merge vincenty methods into LatLonEllipsoidal
	var V = __webpack_require__(26);
	for (var prop in V) exports.LatLonEllipsoidal[prop] = V[prop];
	exports.LatLonVectors     = __webpack_require__(27);
	exports.Vector3d          = __webpack_require__(28);
	exports.Utm               = __webpack_require__(29);
	exports.Mgrs              = __webpack_require__(30);
	exports.OsGridRef         = __webpack_require__(31);
	exports.Dms               = __webpack_require__(32);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Latitude/longitude spherical geodesy tools                         (c) Chris Veness 2002-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong.html                                                    */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-spherical.html                       */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var Dms = __webpack_require__(32); // ≡ import Dms from 'dms.js'


	/**
	 * Library of geodesy functions for operations on a spherical earth model.
	 *
	 * @module   latlon-spherical
	 * @requires dms
	 */


	/**
	 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
	 *
	 * @constructor
	 * @param {number} lat - Latitude in degrees.
	 * @param {number} lon - Longitude in degrees.
	 *
	 * @example
	 *     var p1 = new LatLon(52.205, 0.119);
	 */
	function LatLon(lat, lon) {
	    // allow instantiation without 'new'
	    if (!(this instanceof LatLon)) return new LatLon(lat, lon);

	    this.lat = Number(lat);
	    this.lon = Number(lon);
	}


	/**
	 * Returns the distance from ‘this’ point to destination point (using haversine formula).
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number} Distance between this point and destination point, in same units as radius.
	 *
	 * @example
	 *     var p1 = new LatLon(52.205, 0.119);
	 *     var p2 = new LatLon(48.857, 2.351);
	 *     var d = p1.distanceTo(p2); // 404.3 km
	 */
	LatLon.prototype.distanceTo = function(point, radius) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    var R = radius;
	    var φ1 = this.lat.toRadians(),  λ1 = this.lon.toRadians();
	    var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
	    var Δφ = φ2 - φ1;
	    var Δλ = λ2 - λ1;

	    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
	          + Math.cos(φ1) * Math.cos(φ2)
	          * Math.sin(Δλ/2) * Math.sin(Δλ/2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	    var d = R * c;

	    return d;
	};


	/**
	 * Returns the (initial) bearing from ‘this’ point to destination point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number} Initial bearing in degrees from north.
	 *
	 * @example
	 *     var p1 = new LatLon(52.205, 0.119);
	 *     var p2 = new LatLon(48.857, 2.351);
	 *     var b1 = p1.bearingTo(p2); // 156.2°
	 */
	LatLon.prototype.bearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
	    var Δλ = (point.lon-this.lon).toRadians();

	    // see http://mathforum.org/library/drmath/view/55417.html
	    var y = Math.sin(Δλ) * Math.cos(φ2);
	    var x = Math.cos(φ1)*Math.sin(φ2) -
	            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
	    var θ = Math.atan2(y, x);

	    return (θ.toDegrees()+360) % 360;
	};


	/**
	 * Returns final bearing arriving at destination destination point from ‘this’ point; the final bearing
	 * will differ from the initial bearing by varying degrees according to distance and latitude.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number} Final bearing in degrees from north.
	 *
	 * @example
	 *     var p1 = new LatLon(52.205, 0.119);
	 *     var p2 = new LatLon(48.857, 2.351);
	 *     var b2 = p1.finalBearingTo(p2); // 157.9°
	 */
	LatLon.prototype.finalBearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    // get initial bearing from destination point to this point & reverse it by adding 180°
	    return ( point.bearingTo(this)+180 ) % 360;
	};


	/**
	 * Returns the midpoint between ‘this’ point and the supplied point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {LatLon} Midpoint between this point and the supplied point.
	 *
	 * @example
	 *     var p1 = new LatLon(52.205, 0.119);
	 *     var p2 = new LatLon(48.857, 2.351);
	 *     var pMid = p1.midpointTo(p2); // 50.5363°N, 001.2746°E
	 */
	LatLon.prototype.midpointTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    // φm = atan2( sinφ1 + sinφ2, √( (cosφ1 + cosφ2⋅cosΔλ) ⋅ (cosφ1 + cosφ2⋅cosΔλ) ) + cos²φ2⋅sin²Δλ )
	    // λm = λ1 + atan2(cosφ2⋅sinΔλ, cosφ1 + cosφ2⋅cosΔλ)
	    // see http://mathforum.org/library/drmath/view/51822.html for derivation

	    var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	    var φ2 = point.lat.toRadians();
	    var Δλ = (point.lon-this.lon).toRadians();

	    var Bx = Math.cos(φ2) * Math.cos(Δλ);
	    var By = Math.cos(φ2) * Math.sin(Δλ);

	    var x = Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By);
	    var y = Math.sin(φ1) + Math.sin(φ2);
	    var φ3 = Math.atan2(y, x);

	    var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

	    return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise to −180..+180°
	};


	/**
	 * Returns the point at given fraction between ‘this’ point and specified point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
	 * @returns {LatLon} Intermediate point between this point and destination point.
	 *
	 * @example
	 *   let p1 = new LatLon(52.205, 0.119);
	 *   let p2 = new LatLon(48.857, 2.351);
	 *   let pMid = p1.intermediatePointTo(p2, 0.25); // 51.3721°N, 000.7073°E
	 */
	LatLon.prototype.intermediatePointTo = function(point, fraction) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	    var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
	    var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), sinλ1 = Math.sin(λ1), cosλ1 = Math.cos(λ1);
	    var sinφ2 = Math.sin(φ2), cosφ2 = Math.cos(φ2), sinλ2 = Math.sin(λ2), cosλ2 = Math.cos(λ2);

	    // distance between points
	    var Δφ = φ2 - φ1;
	    var Δλ = λ2 - λ1;
	    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
	        + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
	    var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	    var A = Math.sin((1-fraction)*δ) / Math.sin(δ);
	    var B = Math.sin(fraction*δ) / Math.sin(δ);

	    var x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
	    var y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
	    var z = A * sinφ1 + B * sinφ2;

	    var φ3 = Math.atan2(z, Math.sqrt(x*x + y*y));
	    var λ3 = Math.atan2(y, x);

	    return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise lon to −180..+180°
	};


	/**
	 * Returns the destination point from ‘this’ point having travelled the given distance on the
	 * given initial bearing (bearing normally varies around path followed).
	 *
	 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
	 * @param   {number} bearing - Initial bearing in degrees from north.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {LatLon} Destination point.
	 *
	 * @example
	 *     var p1 = new LatLon(51.4778, -0.0015);
	 *     var p2 = p1.destinationPoint(7794, 300.7); // 51.5135°N, 000.0983°W
	 */
	LatLon.prototype.destinationPoint = function(distance, bearing, radius) {
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
	    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
	    // see http://williams.best.vwh.net/avform.htm#LL

	    var δ = Number(distance) / radius; // angular distance in radians
	    var θ = Number(bearing).toRadians();

	    var φ1 = this.lat.toRadians();
	    var λ1 = this.lon.toRadians();

	    var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
	    var sinδ = Math.sin(δ), cosδ = Math.cos(δ);
	    var sinθ = Math.sin(θ), cosθ = Math.cos(θ);

	    var sinφ2 = sinφ1*cosδ + cosφ1*sinδ*cosθ;
	    var φ2 = Math.asin(sinφ2);
	    var y = sinθ * sinδ * cosφ1;
	    var x = cosδ - sinφ1 * sinφ2;
	    var λ2 = λ1 + Math.atan2(y, x);

	    return new LatLon(φ2.toDegrees(), (λ2.toDegrees()+540)%360-180); // normalise to −180..+180°
	};


	/**
	 * Returns the point of intersection of two paths defined by point and bearing.
	 *
	 * @param   {LatLon} p1 - First point.
	 * @param   {number} brng1 - Initial bearing from first point.
	 * @param   {LatLon} p2 - Second point.
	 * @param   {number} brng2 - Initial bearing from second point.
	 * @returns {LatLon|null} Destination point (null if no unique intersection defined).
	 *
	 * @example
	 *     var p1 = LatLon(51.8853, 0.2545), brng1 = 108.547;
	 *     var p2 = LatLon(49.0034, 2.5735), brng2 =  32.435;
	 *     var pInt = LatLon.intersection(p1, brng1, p2, brng2); // 50.9078°N, 004.5084°E
	 */
	LatLon.intersection = function(p1, brng1, p2, brng2) {
	    if (!(p1 instanceof LatLon)) throw new TypeError('p1 is not LatLon object');
	    if (!(p2 instanceof LatLon)) throw new TypeError('p2 is not LatLon object');

	    // see http://williams.best.vwh.net/avform.htm#Intersection

	    var φ1 = p1.lat.toRadians(), λ1 = p1.lon.toRadians();
	    var φ2 = p2.lat.toRadians(), λ2 = p2.lon.toRadians();
	    var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
	    var Δφ = φ2-φ1, Δλ = λ2-λ1;

	    var δ12 = 2*Math.asin( Math.sqrt( Math.sin(Δφ/2)*Math.sin(Δφ/2)
	        + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2) ) );
	    if (δ12 == 0) return null;

	    // initial/final bearings between points
	    var θa = Math.acos( ( Math.sin(φ2) - Math.sin(φ1)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ1) ) );
	    if (isNaN(θa)) θa = 0; // protect against rounding
	    var θb = Math.acos( ( Math.sin(φ1) - Math.sin(φ2)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ2) ) );

	    var θ12 = Math.sin(λ2-λ1)>0 ? θa : 2*Math.PI-θa;
	    var θ21 = Math.sin(λ2-λ1)>0 ? 2*Math.PI-θb : θb;

	    var α1 = (θ13 - θ12 + Math.PI) % (2*Math.PI) - Math.PI; // angle 2-1-3
	    var α2 = (θ21 - θ23 + Math.PI) % (2*Math.PI) - Math.PI; // angle 1-2-3

	    if (Math.sin(α1)==0 && Math.sin(α2)==0) return null; // infinite intersections
	    if (Math.sin(α1)*Math.sin(α2) < 0) return null;      // ambiguous intersection

	    //α1 = Math.abs(α1);
	    //α2 = Math.abs(α2);
	    // ... Ed Williams takes abs of α1/α2, but seems to break calculation?

	    var α3 = Math.acos( -Math.cos(α1)*Math.cos(α2) + Math.sin(α1)*Math.sin(α2)*Math.cos(δ12) );
	    var δ13 = Math.atan2( Math.sin(δ12)*Math.sin(α1)*Math.sin(α2), Math.cos(α2)+Math.cos(α1)*Math.cos(α3) );
	    var φ3 = Math.asin( Math.sin(φ1)*Math.cos(δ13) + Math.cos(φ1)*Math.sin(δ13)*Math.cos(θ13) );
	    var Δλ13 = Math.atan2( Math.sin(θ13)*Math.sin(δ13)*Math.cos(φ1), Math.cos(δ13)-Math.sin(φ1)*Math.sin(φ3) );
	    var λ3 = λ1 + Δλ13;

	    return new LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise to −180..+180°
	};


	/**
	 * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
	 *
	 * @param   {LatLon} pathStart - Start point of great circle path.
	 * @param   {LatLon} pathEnd - End point of great circle path.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
	 *
	 * @example
	 *   var pCurrent = new LatLon(53.2611, -0.7972);
	 *   var p1 = new LatLon(53.3206, -1.7297);
	 *   var p2 = new LatLon(53.1887,  0.1334);
	 *   var d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
	 */
	LatLon.prototype.crossTrackDistanceTo = function(pathStart, pathEnd, radius) {
	    if (!(pathStart instanceof LatLon)) throw new TypeError('pathStart is not LatLon object');
	    if (!(pathEnd instanceof LatLon)) throw new TypeError('pathEnd is not LatLon object');
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    var δ13 = pathStart.distanceTo(this, radius)/radius;
	    var θ13 = pathStart.bearingTo(this).toRadians();
	    var θ12 = pathStart.bearingTo(pathEnd).toRadians();

	    var dxt = Math.asin( Math.sin(δ13) * Math.sin(θ13-θ12) ) * radius;

	    return dxt;
	};


	/**
	 * Returns maximum latitude reached when travelling on a great circle on given bearing from this
	 * point ('Clairaut's formula'). Negate the result for the minimum latitude (in the Southern
	 * hemisphere).
	 *
	 * The maximum latitude is independent of longitude; it will be the same for all points on a given
	 * latitude.
	 *
	 * @param {number} bearing - Initial bearing.
	 * @param {number} latitude - Starting latitude.
	 */
	LatLon.prototype.maxLatitude = function(bearing) {
	    var θ = Number(bearing).toRadians();

	    var φ = this.lat.toRadians();

	    var φMax = Math.acos(Math.abs(Math.sin(θ)*Math.cos(φ)));

	    return φMax.toDegrees();
	};


	/**
	 * Returns the pair of meridians at which a great circle defined by two points crosses the given
	 * latitude. If the great circle doesn't reach the given latitude, null is returned.
	 *
	 * @param {LatLon} point1 - First point defining great circle.
	 * @param {LatLon} point2 - Second point defining great circle.
	 * @param {number} latitude - Latitude crossings are to be determined for.
	 * @returns {Object|null} Object containing { lon1, lon2 } or null if given latitude not reached.
	 */
	LatLon.crossingParallels = function(point1, point2, latitude) {
	    var φ = Number(latitude).toRadians();

	    var φ1 = point1.lat.toRadians();
	    var λ1 = point1.lon.toRadians();
	    var φ2 = point2.lat.toRadians();
	    var λ2 = point2.lon.toRadians();

	    var Δλ = λ2 - λ1;

	    var x = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.sin(Δλ);
	    var y = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.cos(Δλ) - Math.cos(φ1) * Math.sin(φ2) * Math.cos(φ);
	    var z = Math.cos(φ1) * Math.cos(φ2) * Math.sin(φ) * Math.sin(Δλ);

	    if (z*z > x*x + y*y) return null; // great circle doesn't reach latitude

	    var λm = Math.atan2(-y, x);                  // longitude at max latitude
	    var Δλi = Math.acos(z / Math.sqrt(x*x+y*y)); // Δλ from λm to intersection points

	    var λi1 = λ1 + λm - Δλi;
	    var λi2 = λ1 + λm + Δλi;

	    return { lon1: (λi1.toDegrees()+540)%360-180, lon2: (λi2.toDegrees()+540)%360-180 }; // normalise to −180..+180°
	};


	/* Rhumb - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/**
	 * Returns the distance travelling from ‘this’ point to destination point along a rhumb line.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number} Distance in km between this point and destination point (same units as radius).
	 *
	 * @example
	 *     var p1 = new LatLon(51.127, 1.338);
	 *     var p2 = new LatLon(50.964, 1.853);
	 *     var d = p1.distanceTo(p2); // 40.31 km
	 */
	LatLon.prototype.rhumbDistanceTo = function(point, radius) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    // see http://williams.best.vwh.net/avform.htm#Rhumb

	    var R = radius;
	    var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
	    var Δφ = φ2 - φ1;
	    var Δλ = Math.abs(point.lon-this.lon).toRadians();
	    // if dLon over 180° take shorter rhumb line across the anti-meridian:
	    if (Math.abs(Δλ) > Math.PI) Δλ = Δλ>0 ? -(2*Math.PI-Δλ) : (2*Math.PI+Δλ);

	    // on Mercator projection, longitude distances shrink by latitude; q is the 'stretch factor'
	    // q becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
	    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));
	    var q = Math.abs(Δψ) > 10e-12 ? Δφ/Δψ : Math.cos(φ1);

	    // distance is pythagoras on 'stretched' Mercator projection
	    var δ = Math.sqrt(Δφ*Δφ + q*q*Δλ*Δλ); // angular distance in radians
	    var dist = δ * R;

	    return dist;
	};


	/**
	 * Returns the bearing from ‘this’ point to destination point along a rhumb line.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number} Bearing in degrees from north.
	 *
	 * @example
	 *     var p1 = new LatLon(51.127, 1.338);
	 *     var p2 = new LatLon(50.964, 1.853);
	 *     var d = p1.rhumbBearingTo(p2); // 116.7 m
	 */
	LatLon.prototype.rhumbBearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
	    var Δλ = (point.lon-this.lon).toRadians();
	    // if dLon over 180° take shorter rhumb line across the anti-meridian:
	    if (Math.abs(Δλ) > Math.PI) Δλ = Δλ>0 ? -(2*Math.PI-Δλ) : (2*Math.PI+Δλ);

	    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));

	    var θ = Math.atan2(Δλ, Δψ);

	    return (θ.toDegrees()+360) % 360;
	};


	/**
	 * Returns the destination point having travelled along a rhumb line from ‘this’ point the given
	 * distance on the  given bearing.
	 *
	 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
	 * @param   {number} bearing - Bearing in degrees from north.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {LatLon} Destination point.
	 *
	 * @example
	 *     var p1 = new LatLon(51.127, 1.338);
	 *     var p2 = p1.rhumbDestinationPoint(40300, 116.7); // 50.9642°N, 001.8530°E
	 */
	LatLon.prototype.rhumbDestinationPoint = function(distance, bearing, radius) {
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    var δ = Number(distance) / radius; // angular distance in radians
	    var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	    var θ = Number(bearing).toRadians();

	    var Δφ = δ * Math.cos(θ);
	    var φ2 = φ1 + Δφ;

	    // check for some daft bugger going past the pole, normalise latitude if so
	    if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;

	    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));
	    var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

	    var Δλ = δ*Math.sin(θ)/q;
	    var λ2 = λ1 + Δλ;

	    return new LatLon(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
	};


	/**
	 * Returns the loxodromic midpoint (along a rhumb line) between ‘this’ point and second point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of second point.
	 * @returns {LatLon} Midpoint between this point and second point.
	 *
	 * @example
	 *     var p1 = new LatLon(51.127, 1.338);
	 *     var p2 = new LatLon(50.964, 1.853);
	 *     var pMid = p1.rhumbMidpointTo(p2); // 51.0455°N, 001.5957°E
	 */
	LatLon.prototype.rhumbMidpointTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    // http://mathforum.org/kb/message.jspa?messageID=148837

	    var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	    var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();

	    if (Math.abs(λ2-λ1) > Math.PI) λ1 += 2*Math.PI; // crossing anti-meridian

	    var φ3 = (φ1+φ2)/2;
	    var f1 = Math.tan(Math.PI/4 + φ1/2);
	    var f2 = Math.tan(Math.PI/4 + φ2/2);
	    var f3 = Math.tan(Math.PI/4 + φ3/2);
	    var λ3 = ( (λ2-λ1)*Math.log(f3) + λ1*Math.log(f2) - λ2*Math.log(f1) ) / Math.log(f2/f1);

	    if (!isFinite(λ3)) λ3 = (λ1+λ2)/2; // parallel of latitude

	    var p = LatLon(φ3.toDegrees(), (λ3.toDegrees()+540)%360-180); // normalise to −180..+180°

	    return p;
	};


	/* Area - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


	/**
	 * Calculates the area of a spherical polygon where the sides of the polygon are great circle
	 * arcs joining the vertices.
	 *
	 * @param   {LatLon[]} polygon - Array of points defining vertices of the polygon
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number} The area of the polygon, in the same units as radius.
	 *
	 * @example
	 *   var polygon = [new LatLon(0,0), new LatLon(1,0), new LatLon(0,1)];
	 *   var area = LatLon.areaOf(polygon); // 6.18e9 m²
	 */
	LatLon.areaOf = function(polygon, radius) {
	    // uses method due to Karney: osgeo-org.1560.x6.nabble.com/Area-of-a-spherical-polygon-td3841625.html;
	    // for each edge of the polygon, tan(E/2) = tan(Δλ/2)·(tan(φ1/2) + tan(φ2/2)) / (1 + tan(φ1/2)·tan(φ2/2))
	    // where E is the spherical excess of the trapezium obtained by extending the edge to the equator

	    var R = (radius === undefined) ? 6371e3 : Number(radius);

	    // close polygon so that last point equals first point
	    var closed = polygon[0].equals(polygon[polygon.length-1]);
	    if (!closed) polygon.push(polygon[0]);

	    var nVertices = polygon.length - 1;

	    var S = 0; // spherical excess in steradians
	    for (var v=0; v<nVertices; v++) {
	        var φ1 = polygon[v].lat.toRadians();
	        var φ2 = polygon[v+1].lat.toRadians();
	        var Δλ = (polygon[v+1].lon - polygon[v].lon).toRadians();
	        var E = 2 * Math.atan2(Math.tan(Δλ/2) * (Math.tan(φ1/2)+Math.tan(φ2/2)), 1 + Math.tan(φ1/2)*Math.tan(φ2/2));
	        S += E;
	    }

	    if (isPoleEnclosedBy(polygon)) S = Math.abs(S) - 2*Math.PI;

	    var A = Math.abs(S * R*R); // area in units of R

	    if (!closed) polygon.pop(); // restore polygon to pristine condition

	    return A;

	    // returns whether polygon encloses pole: sum of course deltas around pole is 0° rather than
	    // normal ±360°: blog.element84.com/determining-if-a-spherical-polygon-contains-a-pole.html
	    function isPoleEnclosedBy(polygon) {
	        // TODO: any better test than this?
	        var ΣΔ = 0;
	        var prevBrng = polygon[0].bearingTo(polygon[1]);
	        for (var v=0; v<polygon.length-1; v++) {
	            var initBrng = polygon[v].bearingTo(polygon[v+1]);
	            var finalBrng = polygon[v].finalBearingTo(polygon[v+1]);
	            ΣΔ += (initBrng - prevBrng + 540) % 360 - 180;
	            ΣΔ += (finalBrng - initBrng + 540) % 360 - 180;
	            prevBrng = finalBrng;
	        }
	        var initBrng = polygon[0].bearingTo(polygon[1]);
	        ΣΔ += (initBrng - prevBrng + 540) % 360 - 180;
	        // TODO: fix (intermittant) edge crossing pole - eg (85,90), (85,0), (85,-90)
	        var enclosed = Math.abs(ΣΔ) < 90; // 0°-ish
	        return enclosed;
	    }
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


	/**
	 * Checks if another point is equal to ‘this’ point.
	 *
	 * @param   {LatLon} point - Point to be compared against this point.
	 * @returns {bool}   True if points are identical.
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 *   var p2 = new LatLon(52.205, 0.119);
	 *   var equal = p1.equals(p2); // true
	 */
	LatLon.prototype.equals = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    if (this.lat != point.lat) return false;
	    if (this.lon != point.lon) return false;

	    return true;
	};


	/**
	 * Returns a string representation of ‘this’ point, formatted as degrees, degrees+minutes, or
	 * degrees+minutes+seconds.
	 *
	 * @param   {string} [format=dms] - Format point as 'd', 'dm', 'dms'.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use - default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Comma-separated latitude/longitude.
	 */
	LatLon.prototype.toString = function(format, dp) {
	    return Dms.toLat(this.lat, format, dp) + ', ' + Dms.toLon(this.lon, format, dp);
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend Number object with method to convert numeric degrees to radians */
	if (Number.prototype.toRadians === undefined) {
	    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}

	/** Extend Number object with method to convert radians to numeric (signed) degrees */
	if (Number.prototype.toDegrees === undefined) {
	    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Geodesy tools for an ellipsoidal earth model                       (c) Chris Veness 2005-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-convert-coords.html                                     */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-ellipsoidal.html                     */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var Vector3d = __webpack_require__(28); // ≡ import Vector3d from 'vector3d.js'
	if (typeof module!='undefined' && module.exports) var Dms = __webpack_require__(32);           // ≡ import Dms from 'dms.js'


	/**
	 * Library of geodesy functions for operations on an ellipsoidal earth model.
	 *
	 * Includes ellipsoid parameters and datums for different coordinate systems, and methods for
	 * converting between them and to cartesian coordinates.
	 *
	 * q.v. Ordnance Survey ‘A guide to coordinate systems in Great Britain’ Section 6
	 * www.ordnancesurvey.co.uk/docs/support/guide-coordinate-systems-great-britain.pdf.
	 *
	 * @module   latlon-ellipsoidal
	 * @requires dms
	 */


	/**
	 * Creates lat/lon (polar) point with latitude & longitude values, on a specified datum.
	 *
	 * @constructor
	 * @param {number}       lat - Geodetic latitude in degrees.
	 * @param {number}       lon - Longitude in degrees.
	 * @param {LatLon.datum} [datum=WGS84] - Datum this point is defined within.
	 *
	 * @example
	 *     var p1 = new LatLon(51.4778, -0.0016, LatLon.datum.WGS84);
	 */
	function LatLon(lat, lon, datum) {
	    // allow instantiation without 'new'
	    if (!(this instanceof LatLon)) return new LatLon(lat, lon, datum);

	    if (datum === undefined) datum = LatLon.datum.WGS84;

	    this.lat = Number(lat);
	    this.lon = Number(lon);
	    this.datum = datum;
	}


	/**
	 * Ellipsoid parameters; major axis (a), minor axis (b), and flattening (f) for each ellipsoid.
	 */
	LatLon.ellipsoid = {
	    WGS84:        { a: 6378137,     b: 6356752.31425, f: 1/298.257223563 },
	    GRS80:        { a: 6378137,     b: 6356752.31414, f: 1/298.257222101 },
	    Airy1830:     { a: 6377563.396, b: 6356256.909,   f: 1/299.3249646   },
	    AiryModified: { a: 6377340.189, b: 6356034.448,   f: 1/299.3249646   },
	    Intl1924:     { a: 6378388,     b: 6356911.946,   f: 1/297           },
	    Bessel1841:   { a: 6377397.155, b: 6356078.963,   f: 1/299.152815351 },
	};

	/**
	 * Datums; with associated ellipsoid, and Helmert transform parameters to convert from WGS 84 into
	 * given datum.
	 *
	 * More are available from earth-info.nga.mil/GandG/coordsys/datums/NATO_DT.pdf,
	 * www.fieldenmaps.info/cconv/web/cconv_params.js, itrf.ensg.ign.fr/trans_para.php,
	 * www.euref.eu/symposia/2012Paris/03-01-Altamimi.pdf (ITRF2008 -> ITRFyy,ITRFyy -> ETRF2000)
	 */
	LatLon.datum = {
	    /* eslint key-spacing: 0, comma-dangle: 0 */
	    WGS84: {
	        ellipsoid: LatLon.ellipsoid.WGS84,
	        transform: { tx:    0.0,    ty:    0.0,     tz:    0.0,    // m
	                     rx:    0.0,    ry:    0.0,     rz:    0.0,    // sec
	                      s:    0.0 }                                  // ppm
	    },
	    ITRF90: { // ftp://itrf.ensg.ign.fr/pub/itrf/WGS84.TXT
	        ellipsoid: LatLon.ellipsoid.GRS80,
	        transform: { tx:   -0.060,  ty:    0.517,   tz:    0.223,  // m
	                     rx:   -0.0183, ry:    0.0003,  rz:   -0.0070, // sec
	                      s:    0.011 }                                // ppm
	    },
	    NAD83: { // (2009); functionally ≡ WGS84 - www.uvm.edu/giv/resources/WGS84_NAD83.pdf
	        ellipsoid: LatLon.ellipsoid.GRS80,
	        transform: { tx:    1.004,  ty:   -1.910,   tz:   -0.515,  // m
	                     rx:    0.0267, ry:    0.00034, rz:    0.011,  // sec
	                      s:   -0.0015 }                               // ppm
	    }, // note: if you *really* need to convert WGS84<->NAD83, you need more knowledge than this!
	    OSGB36: { // www.ordnancesurvey.co.uk/docs/support/guide-coordinate-systems-great-britain.pdf
	        ellipsoid: LatLon.ellipsoid.Airy1830,
	        transform: { tx: -446.448,  ty:  125.157,   tz: -542.060,  // m
	                     rx:   -0.1502, ry:   -0.2470,  rz:   -0.8421, // sec
	                      s:   20.4894 }                               // ppm
	    },
	    ED50: { // www.gov.uk/guidance/oil-and-gas-petroleum-operations-notices#pon-4
	        ellipsoid: LatLon.ellipsoid.Intl1924,
	        transform: { tx:   89.5,    ty:   93.8,     tz:  123.1,    // m
	                     rx:    0.0,    ry:    0.0,     rz:    0.156,  // sec
	                      s:   -1.2 }                                  // ppm
	    },
	    Irl1975: { // osi.ie/OSI/media/OSI/Content/Publications/transformations_booklet.pdf
	        ellipsoid: LatLon.ellipsoid.AiryModified,
	        transform: { tx: -482.530,  ty:  130.596,   tz: -564.557,  // m
	                     rx:   -1.042,  ry:   -0.214,   rz:   -0.631,  // sec
	                      s:   -8.150 }                                // ppm
	    }, // note: many sources have opposite sign to rotations - to be checked!
	    TokyoJapan: { // www.geocachingtoolbox.com?page=datumEllipsoidDetails
	        ellipsoid: LatLon.ellipsoid.Bessel1841,
	        transform: { tx:  148,      ty: -507,       tz: -685,      // m
	                     rx:    0,      ry:    0,       rz:    0,      // sec
	                      s:    0 }                                    // ppm
	    },
	};


	/**
	 * Converts ‘this’ lat/lon coordinate to new coordinate system.
	 *
	 * @param   {LatLon.datum} toDatum - Datum this coordinate is to be converted to.
	 * @returns {LatLon} This point converted to new datum.
	 *
	 * @example
	 *     var pWGS84 = new LatLon(51.4778, -0.0016, LatLon.datum.WGS84);
	 *     var pOSGB = pWGS84.convertDatum(LatLon.datum.OSGB36); // 51.4773°N, 000.0000°E
	 */
	LatLon.prototype.convertDatum = function(toDatum) {
	    var oldLatLon = this;
	    var transform;

	    if (oldLatLon.datum == LatLon.datum.WGS84) {
	        // converting from WGS 84
	        transform = toDatum.transform;
	    }
	    if (toDatum == LatLon.datum.WGS84) {
	        // converting to WGS 84; use inverse transform (don't overwrite original!)
	        transform = {};
	        for (var param in oldLatLon.datum.transform) {
	            if (oldLatLon.datum.transform.hasOwnProperty(param)) {
	                transform[param] = -oldLatLon.datum.transform[param];
	            }
	        }
	    }
	    if (transform === undefined) {
	        // neither this.datum nor toDatum are WGS84: convert this to WGS84 first
	        oldLatLon = this.convertDatum(LatLon.datum.WGS84);
	        transform = toDatum.transform;
	    }

	    var oldCartesian = oldLatLon.toCartesian();                // convert polar to cartesian...
	    var newCartesian = oldCartesian.applyTransform(transform); // ...apply transform...
	    var newLatLon = newCartesian.toLatLonE(toDatum);           // ...and convert cartesian to polar

	    return newLatLon;
	};


	/**
	 * Converts ‘this’ point from (geodetic) latitude/longitude coordinates to (geocentric) cartesian
	 * (x/y/z) coordinates.
	 *
	 * @returns {Vector3d} Vector pointing to lat/lon point, with x, y, z in metres from earth centre.
	 */
	LatLon.prototype.toCartesian = function() {
	    var φ = this.lat.toRadians(), λ = this.lon.toRadians();
	    var h = 0; // height above ellipsoid - not currently used
	    var a = this.datum.ellipsoid.a, f = this.datum.ellipsoid.f;

	    var sinφ = Math.sin(φ), cosφ = Math.cos(φ);
	    var sinλ = Math.sin(λ), cosλ = Math.cos(λ);

	    var eSq = 2*f - f*f;                      // 1st eccentricity squared ≡ (a²-b²)/a²
	    var ν = a / Math.sqrt(1 - eSq*sinφ*sinφ); // radius of curvature in prime vertical

	    var x = (ν+h) * cosφ * cosλ;
	    var y = (ν+h) * cosφ * sinλ;
	    var z = (ν*(1-eSq)+h) * sinφ;

	    var point = new Vector3d(x, y, z);

	    return point;
	};


	/**
	 * Converts ‘this’ (geocentric) cartesian (x/y/z) point to (ellipsoidal geodetic) latitude/longitude
	 * coordinates on specified datum.
	 *
	 * Uses Bowring’s (1985) formulation for μm precision in concise form.
	 *
	 * @param {LatLon.datum.transform} datum - Datum to use when converting point.
	 */
	Vector3d.prototype.toLatLonE = function(datum) {
	    var x = this.x, y = this.y, z = this.z;
	    var a = datum.ellipsoid.a, b = datum.ellipsoid.b, f = datum.ellipsoid.f;

	    var e2 = 2*f - f*f;   // 1st eccentricity squared ≡ (a²-b²)/a²
	    var ε2 = e2 / (1-e2); // 2nd eccentricity squared ≡ (a²-b²)/b²
	    var p = Math.sqrt(x*x + y*y); // distance from minor axis
	    var R = Math.sqrt(p*p + z*z); // polar radius

	    // parametric latitude (Bowring eqn 17, replacing tanβ = z·a / p·b)
	    var tanβ = (b*z)/(a*p) * (1+ε2*b/R);
	    var sinβ = tanβ / Math.sqrt(1+tanβ*tanβ);
	    var cosβ = sinβ / tanβ;

	    // geodetic latitude (Bowring eqn 18: tanφ = z+ε²bsin³β / p−e²cos³β)
	    var φ = isNaN(cosβ) ? 0 : Math.atan2(z + ε2*b*sinβ*sinβ*sinβ, p - e2*a*cosβ*cosβ*cosβ);

	    // longitude
	    var λ = Math.atan2(y, x);

	    // height above ellipsoid (Bowring eqn 7) [not currently used]
	    var sinφ = Math.sin(φ), cosφ = Math.cos(φ);
	    var ν = a/Math.sqrt(1-e2*sinφ*sinφ); // length of the normal terminated by the minor axis
	    var h = p*cosφ + z*sinφ - (a*a/ν);

	    var point = new LatLon(φ.toDegrees(), λ.toDegrees(), datum);

	    return point;
	};

	/**
	 * Applies Helmert transform to ‘this’ point using transform parameters t.
	 *
	 * @private
	 * @param {LatLon.datum.transform} t - Transform to apply to this point.
	 */
	Vector3d.prototype.applyTransform = function(t)   {
	    var x1 = this.x, y1 = this.y, z1 = this.z;

	    var tx = t.tx, ty = t.ty, tz = t.tz;
	    var rx = (t.rx/3600).toRadians(); // normalise seconds to radians
	    var ry = (t.ry/3600).toRadians(); // normalise seconds to radians
	    var rz = (t.rz/3600).toRadians(); // normalise seconds to radians
	    var s1 = t.s/1e6 + 1;             // normalise ppm to (s+1)

	    // apply transform
	    var x2 = tx + x1*s1 - y1*rz + z1*ry;
	    var y2 = ty + x1*rz + y1*s1 - z1*rx;
	    var z2 = tz - x1*ry + y1*rx + z1*s1;

	    var point = new Vector3d(x2, y2, z2);

	    return point;
	};


	/**
	 * Returns a string representation of ‘this’ point, formatted as degrees, degrees+minutes, or
	 * degrees+minutes+seconds.
	 *
	 * @param   {string} [format=dms] - Format point as 'd', 'dm', 'dms'.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use - default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Comma-separated latitude/longitude.
	 */
	LatLon.prototype.toString = function(format, dp) {
	    return Dms.toLat(this.lat, format, dp) + ', ' + Dms.toLon(this.lon, format, dp);
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend Number object with method to convert numeric degrees to radians */
	if (Number.prototype.toRadians === undefined) {
	    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}

	/** Extend Number object with method to convert radians to numeric (signed) degrees */
	if (Number.prototype.toDegrees === undefined) {
	    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = LatLon, module.exports.Vector3d = Vector3d; // ≡ export { LatLon as default, Vector3d }


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-vincenty.html                                           */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-vincenty.html                        */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var LatLon = __webpack_require__(25); // ≡ import LatLon from 'latlon-ellipsoidal.js'


	/**
	 * Direct and inverse solutions of geodesics on the ellipsoid using Vincenty formulae.
	 *
	 * From: T Vincenty, "Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of
	 *       nested equations", Survey Review, vol XXIII no 176, 1975.
	 *       www.ngs.noaa.gov/PUBS_LIB/inverse.pdf.
	 *
	 * @module  latlon-vincenty
	 * @extends latlon-ellipsoidal
	 */
	/** @class LatLon */


	/**
	 * Returns the distance between ‘this’ point and destination point along a geodesic, using Vincenty
	 * inverse solution.
	 *
	 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
	 * ignored).
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns (Number} Distance in metres between points or NaN if failed to converge.
	 *
	 * @example
	 *   var p1 = new LatLon(50.06632, -5.71475);
	 *   var p2 = new LatLon(58.64402, -3.07009);
	 *   var d = p1.distanceTo(p2); // 969,954.166 m
	 */
	LatLon.prototype.distanceTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    try {
	        return this.inverse(point).distance;
	    } catch (e) {
	        return NaN; // failed to converge
	    }
	};


	/**
	 * Returns the initial bearing (forward azimuth) to travel along a geodesic from ‘this’ point to the
	 * specified point, using Vincenty inverse solution.
	 *
	 * Note: the datum used is of ‘this’ point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number}  initial Bearing in degrees from north (0°..360°) or NaN if failed to converge.
	 *
	 * @example
	 *   var p1 = new LatLon(50.06632, -5.71475);
	 *   var p2 = new LatLon(58.64402, -3.07009);
	 *   var b1 = p1.initialBearingTo(p2); // 9.1419°
	 */
	LatLon.prototype.initialBearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    try {
	        return this.inverse(point).initialBearing;
	    } catch (e) {
	        return NaN; // failed to converge
	    }
	};


	/**
	 * Returns the final bearing (reverse azimuth) having travelled along a geodesic from ‘this’ point
	 * to the specified point, using Vincenty inverse solution.
	 *
	 * Note: the datum used is of ‘this’ point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number}  Initial bearing in degrees from north (0°..360°) or NaN if failed to converge.
	 *
	 * @example
	 *   var p1 = new LatLon(50.06632, -5.71475);
	 *   var p2 = new LatLon(58.64402, -3.07009);
	 *   var b2 = p1.finalBearingTo(p2); // 11.2972°
	 */
	LatLon.prototype.finalBearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    try {
	        return this.inverse(point).finalBearing;
	    } catch (e) {
	        return NaN; // failed to converge
	    }
	};


	/**
	 * Returns the destination point having travelled the given distance along a geodesic given by
	 * initial bearing from ‘this’ point, using Vincenty direct solution.
	 *
	 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
	 * ignored).
	 *
	 * @param   {number} distance - Distance travelled along the geodesic in metres.
	 * @param   {number} initialBearing - Initial bearing in degrees from north.
	 * @returns {LatLon} Destination point.
	 *
	 * @example
	 *   var p1 = new LatLon(-37.95103, 144.42487);
	 *   var p2 = p1.destinationPoint(54972.271, 306.86816); // 37.6528°S, 143.9265°E
	 */
	LatLon.prototype.destinationPoint = function(distance, initialBearing) {
	    return this.direct(Number(distance), Number(initialBearing)).point;
	};


	/**
	 * Returns the final bearing (reverse azimuth) having travelled along a geodesic given by initial
	 * bearing for a given distance from ‘this’ point, using Vincenty direct solution.
	 *
	 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
	 * ignored).
	 *
	 * @param   {number} distance - Distance travelled along the geodesic in metres.
	 * @param   {LatLon} initialBearing - Initial bearing in degrees from north.
	 * @returns {number} Final bearing in degrees from north (0°..360°).
	 *
	 * @example
	 *   var p1 = new LatLon(-37.95103, 144.42487);
	 *   var b2 = p1.finalBearingOn(306.86816, 54972.271); // 307.1736°
	 */
	LatLon.prototype.finalBearingOn = function(distance, initialBearing) {
	    return this.direct(Number(distance), Number(initialBearing)).finalBearing;
	};


	/**
	 * Vincenty direct calculation.
	 *
	 * @private
	 * @param   {number} distance - Distance along bearing in metres.
	 * @param   {number} initialBearing - Initial bearing in degrees from north.
	 * @returns (Object} Object including point (destination point), finalBearing.
	 * @throws  {Error}  If formula failed to converge.
	 */
	LatLon.prototype.direct = function(distance, initialBearing) {
	    var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
	    var α1 = initialBearing.toRadians();
	    var s = distance;

	    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

	    var sinα1 = Math.sin(α1);
	    var cosα1 = Math.cos(α1);

	    var tanU1 = (1-f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
	    var σ1 = Math.atan2(tanU1, cosα1);
	    var sinα = cosU1 * sinα1;
	    var cosSqα = 1 - sinα*sinα;
	    var uSq = cosSqα * (a*a - b*b) / (b*b);
	    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
	    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

	    var cos2σM, sinσ, cosσ, Δσ;

	    var σ = s / (b*A), σʹ, iterations = 0;
	    do {
	        cos2σM = Math.cos(2*σ1 + σ);
	        sinσ = Math.sin(σ);
	        cosσ = Math.cos(σ);
	        Δσ = B*sinσ*(cos2σM+B/4*(cosσ*(-1+2*cos2σM*cos2σM)-
	            B/6*cos2σM*(-3+4*sinσ*sinσ)*(-3+4*cos2σM*cos2σM)));
	        σʹ = σ;
	        σ = s / (b*A) + Δσ;
	    } while (Math.abs(σ-σʹ) > 1e-12 && ++iterations<200);
	    if (iterations>=200) throw new Error('Formula failed to converge'); // not possible?

	    var x = sinU1*sinσ - cosU1*cosσ*cosα1;
	    var φ2 = Math.atan2(sinU1*cosσ + cosU1*sinσ*cosα1, (1-f)*Math.sqrt(sinα*sinα + x*x));
	    var λ = Math.atan2(sinσ*sinα1, cosU1*cosσ - sinU1*sinσ*cosα1);
	    var C = f/16*cosSqα*(4+f*(4-3*cosSqα));
	    var L = λ - (1-C) * f * sinα *
	        (σ + C*sinσ*(cos2σM+C*cosσ*(-1+2*cos2σM*cos2σM)));
	    var λ2 = (λ1+L+3*Math.PI)%(2*Math.PI) - Math.PI;  // normalise to -180..+180

	    var α2 = Math.atan2(sinα, -x);
	    α2 = (α2 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360

	    return {
	        point:        new LatLon(φ2.toDegrees(), λ2.toDegrees(), this.datum),
	        finalBearing: α2.toDegrees(),
	    };
	};


	/**
	 * Vincenty inverse calculation.
	 *
	 * @private
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {Object} Object including distance, initialBearing, finalBearing.
	 * @throws  {Error}  If formula failed to converge.
	 */
	LatLon.prototype.inverse = function(point) {
	    var p1 = this, p2 = point;
	    var φ1 = p1.lat.toRadians(), λ1 = p1.lon.toRadians();
	    var φ2 = p2.lat.toRadians(), λ2 = p2.lon.toRadians();

	    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

	    var L = λ2 - λ1;
	    var tanU1 = (1-f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
	    var tanU2 = (1-f) * Math.tan(φ2), cosU2 = 1 / Math.sqrt((1 + tanU2*tanU2)), sinU2 = tanU2 * cosU2;

	    var sinλ, cosλ, sinSqσ, sinσ, cosσ, σ, sinα, cosSqα, cos2σM, C;

	    var λ = L, λʹ, iterations = 0;
	    do {
	        sinλ = Math.sin(λ);
	        cosλ = Math.cos(λ);
	        sinSqσ = (cosU2*sinλ) * (cosU2*sinλ) + (cosU1*sinU2-sinU1*cosU2*cosλ) * (cosU1*sinU2-sinU1*cosU2*cosλ);
	        sinσ = Math.sqrt(sinSqσ);
	        if (sinσ == 0) return 0;  // co-incident points
	        cosσ = sinU1*sinU2 + cosU1*cosU2*cosλ;
	        σ = Math.atan2(sinσ, cosσ);
	        sinα = cosU1 * cosU2 * sinλ / sinσ;
	        cosSqα = 1 - sinα*sinα;
	        cos2σM = cosσ - 2*sinU1*sinU2/cosSqα;
	        if (isNaN(cos2σM)) cos2σM = 0;  // equatorial line: cosSqα=0 (§6)
	        C = f/16*cosSqα*(4+f*(4-3*cosSqα));
	        λʹ = λ;
	        λ = L + (1-C) * f * sinα * (σ + C*sinσ*(cos2σM+C*cosσ*(-1+2*cos2σM*cos2σM)));
	    } while (Math.abs(λ-λʹ) > 1e-12 && ++iterations<200);
	    if (iterations>=200) throw new Error('Formula failed to converge');

	    var uSq = cosSqα * (a*a - b*b) / (b*b);
	    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
	    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
	    var Δσ = B*sinσ*(cos2σM+B/4*(cosσ*(-1+2*cos2σM*cos2σM)-
	        B/6*cos2σM*(-3+4*sinσ*sinσ)*(-3+4*cos2σM*cos2σM)));

	    var s = b*A*(σ-Δσ);

	    var α1 = Math.atan2(cosU2*sinλ,  cosU1*sinU2-sinU1*cosU2*cosλ);
	    var α2 = Math.atan2(cosU1*sinλ, -sinU1*cosU2+cosU1*sinU2*cosλ);

	    α1 = (α1 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360
	    α2 = (α2 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360

	    s = Number(s.toFixed(3)); // round to 1mm precision
	    return { distance: s, initialBearing: α1.toDegrees(), finalBearing: α2.toDegrees() };
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend Number object with method to convert numeric degrees to radians */
	if (Number.prototype.toRadians === undefined) {
	    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}

	/** Extend Number object with method to convert radians to numeric (signed) degrees */
	if (Number.prototype.toDegrees === undefined) {
	    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/*  Vector-based spherical geodetic (latitude/longitude) functions    (c) Chris Veness 2011-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-vectors.html                                            */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-nvector-spherical.html               */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var Vector3d = __webpack_require__(28); // ≡ import Vector3d from 'vector3d.js'
	if (typeof module!='undefined' && module.exports) var Dms = __webpack_require__(32);           // ≡ import Dms from 'dms.js'


	/**
	 * Tools for working with points and paths on (a spherical model of) the earth’s surface using a
	 * vector-based approach using ‘n-vectors’ (rather than the more common spherical trigonometry;
	 * a vector-based approach makes many calculations much simpler, and easier to follow, compared
	 * with trigonometric equivalents).
	 *
	 * Note on a spherical model earth, an n-vector is equivalent to a normalised version of an (ECEF)
	 * cartesian coordinate.
	 *
	 * @module   latlon-vectors
	 * @requires vector3d
	 * @requires dms
	 */


	/**
	 * Creates a LatLon point on spherical model earth.
	 *
	 * @constructor
	 * @param {number} lat - Latitude in degrees.
	 * @param {number} lon - Longitude in degrees.
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 */
	function LatLon(lat, lon) {
	    // allow instantiation without 'new'
	    if (!(this instanceof LatLon)) return new LatLon(lat, lon);

	    this.lat = Number(lat);
	    this.lon = Number(lon);
	}


	/**
	 * Converts ‘this’ lat/lon point to Vector3d n-vector (normal to earth's surface).
	 *
	 * @returns {Vector3d} Normalised n-vector representing lat/lon point.
	 *
	 * @example
	 *   var p = new LatLon(45, 45);
	 *   var v = p.toVector(); // [0.5000,0.5000,0.7071]
	 */
	LatLon.prototype.toVector = function() {
	    var φ = this.lat.toRadians();
	    var λ = this.lon.toRadians();

	    // right-handed vector: x -> 0°E,0°N; y -> 90°E,0°N, z -> 90°N
	    var x = Math.cos(φ) * Math.cos(λ);
	    var y = Math.cos(φ) * Math.sin(λ);
	    var z = Math.sin(φ);

	    return new Vector3d(x, y, z);
	};


	/**
	 * Converts ‘this’ (geocentric) cartesian vector to (spherical) latitude/longitude point.
	 *
	 * @returns  {LatLon} Latitude/longitude point vector points to.
	 *
	 * @example
	 *   var v = new Vector3d(0.500, 0.500, 0.707);
	 *   var p = v.toLatLonS(); // 45.0°N, 45.0°E
	 */
	Vector3d.prototype.toLatLonS = function() {
	    var φ = Math.atan2(this.z, Math.sqrt(this.x*this.x + this.y*this.y));
	    var λ = Math.atan2(this.y, this.x);

	    return new LatLon(φ.toDegrees(), λ.toDegrees());
	};


	/**
	 * N-vector normal to great circle obtained by heading on given bearing from ‘this’ point.
	 *
	 * Direction of vector is such that initial bearing vector b = c × p.
	 *
	 * @param   {number}   bearing - Compass bearing in degrees.
	 * @returns {Vector3d} Normalised vector representing great circle.
	 *
	 * @example
	 *   var p1 = new LatLon(53.3206, -1.7297);
	 *   var gc = p1.greatCircle(96.0); // [-0.794,0.129,0.594]
	 */
	LatLon.prototype.greatCircle = function(bearing) {
	    var φ = this.lat.toRadians();
	    var λ = this.lon.toRadians();
	    var θ = Number(bearing).toRadians();

	    var x =  Math.sin(λ) * Math.cos(θ) - Math.sin(φ) * Math.cos(λ) * Math.sin(θ);
	    var y = -Math.cos(λ) * Math.cos(θ) - Math.sin(φ) * Math.sin(λ) * Math.sin(θ);
	    var z =  Math.cos(φ) * Math.sin(θ);

	    return new Vector3d(x, y, z);
	};


	/**
	 * N-vector normal to great circle obtained by heading on given bearing from point given by ‘this’
	 * n-vector.
	 *
	 * Direction of vector is such that initial bearing vector b = c × p.
	 *
	 * @param   {number}   bearing - Compass bearing in degrees.
	 * @returns {Vector3d} Normalised vector representing great circle.
	 *
	 * @example
	 *   var n1 = new LatLon(53.3206, -1.7297).toNvector();
	 *   var gc = n1.greatCircle(96.0); // [-0.794,0.129,0.594]
	 */
	Vector3d.prototype.greatCircle = function(bearing) {
	    var θ = Number(bearing).toRadians();

	    var N = new Vector3d(0, 0, 1);
	    var e = N.cross(this); // easting
	    var n = this.cross(e); // northing
	    var eʹ = e.times(Math.cos(θ)/e.length());
	    var nʹ = n.times(Math.sin(θ)/n.length());
	    var c = nʹ.minus(eʹ);

	    return c;
	};


	/**
	 * Returns the distance from ‘this’ point to the specified point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number} Distance between this point and destination point, in same units as radius.
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 *   var p2 = new LatLon(48.857, 2.351);
	 *   var d = p1.distanceTo(p2); // 404.3 km
	 */
	LatLon.prototype.distanceTo = function(point, radius) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    var p1 = this.toVector();
	    var p2 = point.toVector();

	    var δ = p1.angleTo(p2);
	    var d = δ * radius;

	    return d;
	};


	/**
	 * Returns the (initial) bearing from ‘this’ point to the specified point, in compass degrees.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {number} Initial bearing in degrees from North (0°..360°).
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 *   var p2 = new LatLon(48.857, 2.351);
	 *   var b1 = p1.bearingTo(p2); // 156.2°
	 */
	LatLon.prototype.bearingTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    var p1 = this.toVector();
	    var p2 = point.toVector();

	    var northPole = new Vector3d(0, 0, 1);

	    var c1 = p1.cross(p2);        // great circle through p1 & p2
	    var c2 = p1.cross(northPole); // great circle through p1 & north pole

	    // bearing is (signed) angle between c1 & c2
	    var bearing = c1.angleTo(c2, p1).toDegrees();

	    return (bearing+360) % 360; // normalise to 0..360
	};


	/**
	 * Returns the midpoint between ‘this’ point and specified point.
	 *
	 * @param   {LatLon} point - Latitude/longitude of destination point.
	 * @returns {LatLon} Midpoint between this point and destination point.
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 *   var p2 = new LatLon(48.857, 2.351);
	 *   var pMid = p1.midpointTo(p2); // 50.5363°N, 001.2746°E
	 */
	LatLon.prototype.midpointTo = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    var p1 = this.toVector();
	    var p2 = point.toVector();

	    var mid = p1.plus(p2).unit();

	    return mid.toLatLonS();
	};


	/**
	 * Returns the destination point from ‘this’ point having travelled the given distance on the
	 * given initial bearing (bearing will normally vary before destination is reached).
	 *
	 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
	 * @param   {number} bearing - Initial bearing in degrees from north.
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {LatLon} Destination point.
	 *
	 * @example
	 *   var p1 = new LatLon(51.4778, -0.0015);
	 *   var p2 = p1.destinationPoint(7794, 300.7); // 51.5135°N, 000.0983°W
	 */
	LatLon.prototype.destinationPoint = function(distance, bearing, radius) {
	    radius = (radius === undefined) ? 6371e3 : Number(radius);

	    var n1 = this.toVector();
	    var δ = Number(distance) / radius; // angular distance in radians
	    var θ = Number(bearing).toRadians();

	    var N = new Vector3d(0, 0, 1); // north pole

	    var de = N.cross(n1).unit();   // east direction vector @ n1
	    var dn = n1.cross(de);         // north direction vector @ n1

	    var deSinθ = de.times(Math.sin(θ));
	    var dnCosθ = dn.times(Math.cos(θ));

	    var d = dnCosθ.plus(deSinθ);   // direction vector @ n1 (≡ C×n1; C = great circle)

	    var x = n1.times(Math.cos(δ)); // component of n2 parallel to n1
	    var y = d.times(Math.sin(δ));  // component of n2 perpendicular to n1

	    var n2 = x.plus(y);

	    return n2.toLatLonS();
	};


	/**
	 * Returns the point of intersection of two paths each defined by point pairs or start point and bearing.
	 *
	 * @param   {LatLon}        path1start - Start point of first path.
	 * @param   {LatLon|number} path1brngEnd - End point of first path or initial bearing from first start point.
	 * @param   {LatLon}        path2start - Start point of second path.
	 * @param   {LatLon|number} path2brngEnd - End point of second path or initial bearing from second start point.
	 * @returns {LatLon}        Destination point (null if no unique intersection defined)
	 *
	 * @example
	 *   var p1 = LatLon(51.8853, 0.2545), brng1 = 108.55;
	 *   var p2 = LatLon(49.0034, 2.5735), brng2 =  32.44;
	 *   var pInt = LatLon.intersection(p1, brng1, p2, brng2); // 50.9076°N, 004.5086°E
	 */
	LatLon.intersection = function(path1start, path1brngEnd, path2start, path2brngEnd) {
	    if (!(path1start instanceof LatLon)) throw new TypeError('path1start is not LatLon object');
	    if (!(path2start instanceof LatLon)) throw new TypeError('path2start is not LatLon object');
	    if (!(path1brngEnd instanceof LatLon) && isNaN(path1brngEnd)) throw new TypeError('path1brngEnd is not LatLon object or bearing');
	    if (!(path2brngEnd instanceof LatLon) && isNaN(path2brngEnd)) throw new TypeError('path2brngEnd is not LatLon object or bearing');

	    // if c1 & c2 are great circles through start and end points (or defined by start point + bearing),
	    // then candidate intersections are simply c1 × c2 & c2 × c1; most of the work is deciding correct
	    // intersection point to select! if bearing is given, that determines which intersection, if both
	    // paths are defined by start/end points, take closer intersection

	    var p1 = path1start.toVector();
	    var p2 = path2start.toVector();

	    var c1, c2, path1def, path2def;
	    // c1 & c2 are vectors defining great circles through start & end points; p × c gives initial bearing vector

	    if (path1brngEnd instanceof LatLon) { // path 1 defined by endpoint
	        c1 = p1.cross(path1brngEnd.toVector());
	        path1def = 'endpoint';
	    } else {                              // path 1 defined by initial bearing
	        c1 = path1start.greatCircle(Number(path1brngEnd));
	        path1def = 'bearing';
	    }
	    if (path2brngEnd instanceof LatLon) { // path 2 defined by endpoint
	        c2 = p2.cross(path2brngEnd.toVector());
	        path2def = 'endpoint';
	    } else {                              // path 2 defined by initial bearing
	        c2 = path2start.greatCircle(Number(path2brngEnd));
	        path2def = 'bearing';
	    }

	    // there are two (antipodal) candidate intersection points; we have to choose which to return
	    var i1 = c1.cross(c2);
	    var i2 = c2.cross(c1);

	    // am I making heavy weather of this? is there a simpler way to do it?

	    // selection of intersection point depends on how paths are defined (bearings or endpoints)
	    var intersection=null, dir1=null, dir2=null;
	    switch (path1def+'+'+path2def) {
	        case 'bearing+bearing':
	            // if c×p⋅i1 is +ve, the initial bearing is towards i1, otherwise towards antipodal i2
	            dir1 = Math.sign(c1.cross(p1).dot(i1)); // c1×p1⋅i1 +ve means p1 bearing points to i1
	            dir2 = Math.sign(c2.cross(p2).dot(i1)); // c2×p2⋅i1 +ve means p2 bearing points to i1

	            switch (dir1+dir2) {
	                case  2: // dir1, dir2 both +ve, 1 & 2 both pointing to i1
	                    intersection = i1;
	                    break;
	                case -2: // dir1, dir2 both -ve, 1 & 2 both pointing to i2
	                    intersection = i2;
	                    break;
	                case  0: // dir1, dir2 opposite; intersection is at further-away intersection point
	                    // take opposite intersection from mid-point of p1 & p2 [is this always true?]
	                    intersection = p1.plus(p2).dot(i1) > 0 ? i2 : i1;
	                    break;
	            }
	            break;
	        case 'bearing+endpoint': // use bearing c1 × p1
	            dir1 = Math.sign(c1.cross(p1).dot(i1)); // c1×p1⋅i1 +ve means p1 bearing points to i1
	            intersection = dir1>0 ? i1 : i2;
	            break;
	        case 'endpoint+bearing': // use bearing c2 × p2
	            dir2 = Math.sign(c2.cross(p2).dot(i1)); // c2×p2⋅i1 +ve means p2 bearing points to i1
	            intersection = dir2>0 ? i1 : i2;
	            break;
	        case 'endpoint+endpoint': // select nearest intersection to mid-point of all points
	            var mid = p1.plus(p2).plus(path1brngEnd.toVector()).plus(path2brngEnd.toVector());
	            intersection = mid.dot(i1)>0 ? i1 : i2;
	            break;
	    }

	    return intersection.toLatLonS();
	};


	/**
	 * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point/bearing.
	 *
	 * @param   {LatLon}        pathStart - Start point of great circle path.
	 * @param   {LatLon|number} pathBrngEnd - End point of great circle path or initial bearing from great circle start point.
	 * @param   {number}        [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns {number}        Distance to great circle (-ve if to left, +ve if to right of path).
	 *
	 * @example
	 *   var pCurrent = new LatLon(53.2611, -0.7972);
	 *
	 *   var p1 = new LatLon(53.3206, -1.7297), brng = 96.0;
	 *   var d = pCurrent.crossTrackDistanceTo(p1, brng);// -305.7 m
	 *
	 *   var p1 = new LatLon(53.3206, -1.7297), p2 = new LatLon(53.1887, 0.1334);
	 *   var d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
	 */
	LatLon.prototype.crossTrackDistanceTo = function(pathStart, pathBrngEnd, radius) {
	    if (!(pathStart instanceof LatLon)) throw new TypeError('pathStart is not LatLon object');
	    var R = (radius === undefined) ? 6371e3 : Number(radius);

	    var p = this.toVector();

	    var gc = pathBrngEnd instanceof LatLon                   // (note JavaScript is not good at method overloading)
	        ? pathStart.toVector().cross(pathBrngEnd.toVector()) // great circle defined by two points
	        : pathStart.greatCircle(Number(pathBrngEnd));        // great circle defined by point + bearing

	    var α = gc.angleTo(p) - Math.PI/2; // angle between point & great-circle

	    var d = α * R;

	    return d;
	};


	/**
	 * Returns closest point on great circle segment between point1 & point2 to ‘this’ point.
	 *
	 * If this point is ‘within’ the extent of the segment, the point is on the segment between point1 &
	 * point2; otherwise, it is the closer of the endpoints defining the segment.
	 *
	 * @param   {LatLon} point1 - Start point of great circle segment.
	 * @param   {LatLon} point2 - End point of great circle segment.
	 * @returns {number} point on segment.
	 *
	 * @example
	 *   var p1 = new LatLon(51.0, 1.0), p2 = new LatLon(51.0, 2.0);
	 *
	 *   var p0 = new LatLon(51.0, 1.9);
	 *   var p = p0.nearestPointOnSegment(p1, p2); // 51.0004°N, 001.9000°E
	 *   var d = p.distanceTo(p);                  // 42.71 m
	 *
	 *   var p0 = new LatLon(51.0, 2.1);
	 *   var p = p0.nearestPointOnSegment(p1, p2); // 51.0000°N, 002.0000°E
	 */
	LatLon.prototype.nearestPointOnSegment = function(point1, point2) {
	    var p = null;

	    if (this.isBetween(point1, point2)) {
	        // closer to segment than to its endpoints, find closest point on segment
	        var n0 = this.toVector(), n1 = point1.toVector(), n2 = point2.toVector();
	        var c1 = n1.cross(n2); // n1×n2 = vector representing great circle through p1, p2
	        var c2 = n0.cross(c1); // n0×c1 = vector representing great circle through p0 normal to c1
	        var n = c1.cross(c2);  // c2×c1 = nearest point on c1 to n0
	        p = n.toLatLonS();
	    } else {
	        // beyond segment extent, take closer endpoint
	        var d1 = this.distanceTo(point1);
	        var d2 = this.distanceTo(point2);
	        p = d1<d2 ? point1 : point2;
	    }

	    return p;
	};


	/**
	 * Returns whether this point is between point 1 & point 2.
	 *
	 * If this point is not on the great circle defined by point1 & point 2, returns whether this point
	 * is within area bound by perpendiculars to the great circle at each point.
	 *
	 * @param   {LatLon} point1 - First point defining segment.
	 * @param   {LatLon} point2 - Second point defining segment.
	 * @returns {boolean} Whether this point is within extent of segment.
	 */
	LatLon.prototype.isBetween = function(point1, point2) {
	    var n0 = this.toVector(), n1 = point1.toVector(), n2 = point2.toVector(); // n-vectors

	    // get vectors representing p0->p1, p0->p2, p1->p2, p2->p1
	    var δ10 = n0.minus(n1), δ12 = n2.minus(n1);
	    var δ20 = n0.minus(n2), δ21 = n1.minus(n2);

	    // dot product δ10⋅δ12 tells us if p0 is on p2 side of p1, similarly for δ20⋅δ21
	    var extent1 = δ10.dot(δ12);
	    var extent2 = δ20.dot(δ21);

	    var isBetween = extent1>=0 && extent2>=0;

	    return isBetween;
	};


	/**
	 * Tests whether ‘this’ point is enclosed by the polygon defined by a set of points.
	 *
	 * @param   {LatLon[]} polygon - Ordered array of points defining vertices of polygon.
	 * @returns {bool}     Whether this point is enclosed by polygon.
	 *
	 * @example
	 *   var bounds = [ new LatLon(45,1), new LatLon(45,2), new LatLon(46,2), new LatLon(46,1) ];
	 *   var p = new LatLon(45.1, 1.1);
	 *   var inside = p.enclosedBy(bounds); // true
	 */
	LatLon.prototype.enclosedBy = function(polygon) {
	    // this method uses angle summation test; on a plane, angles for an enclosed point will sum
	    // to 360°, angles for an exterior point will sum to 0°. On a sphere, enclosed point angles
	    // will sum to less than 360° (due to spherical excess), exterior point angles will be small
	    // but non-zero. TODO: are any winding number optimisations applicable to spherical surface?

	    // close the polygon so that the last point equals the first point
	    var closed = polygon[0].equals(polygon[polygon.length-1]);
	    if (!closed) polygon.push(polygon[0]);

	    var nVertices = polygon.length - 1;

	    var p = this.toVector();

	    // get vectors from p to each vertex
	    var vectorToVertex = [];
	    for (var v=0; v<nVertices; v++) vectorToVertex[v] = p.minus(polygon[v].toVector());
	    vectorToVertex.push(vectorToVertex[0]);

	    // sum subtended angles of each edge (using vector p to determine sign)
	    var Σθ = 0;
	    for (var v=0; v<nVertices; v++) {
	        Σθ += vectorToVertex[v].angleTo(vectorToVertex[v+1], p);
	    }

	    var enclosed = Math.abs(Σθ) > Math.PI;

	    if (!closed) polygon.pop(); // restore polygon to pristine condition

	    return enclosed;
	};


	/**
	 * Calculates the area of a spherical polygon where the sides of the polygon are great circle
	 * arcs joining the vertices.
	 *
	 * @param   {LatLon[]} polygon - Array of points defining vertices of the polygon
	 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
	 * @returns The area of the polygon in the same units as radius.
	 *
	 * @example
	 *   var polygon = [new LatLon(0,0), new LatLon(1,0), new LatLon(0,1)];
	 *   var area = LatLon.areaOf(polygon); // 6.18e9 m² TODO: fix!
	 */
	LatLon.areaOf = function(polygon, radius) {
	    // uses Girard’s theorem: A = [Σθᵢ − (n−2)·π]·R²

	    var R = (radius === undefined) ? 6371e3 : Number(radius);

	    // close the polygon so that the last point equals the first point
	    if (!polygon[0].equals(polygon[polygon.length-1])) polygon.push(polygon[0]);
	    var n = polygon.length - 1;
	    console.log('n', n);

	    // get great-circle vector for each edge
	    var c = [];
	    for (var v=0; v<n; v++) {
	        var i = polygon[v].toVector();
	        var j = polygon[v+1].toVector();
	        c[v] = i.cross(j); // great circle for segment v..v+1
	    }
	    console.log('c', c.length, c);
	    c.push(c[0]);

	    // sum interior angles
	    var Σθ = 0;
	    for (var v=0; v<n; v++) {
	        console.log(v, (Math.PI-c[v].angleTo(c[v+1])).toDegrees());
	        Σθ += Math.PI - c[v].angleTo(c[v+1]); // TODO: always π - α, or sometimes just α?
	    }
	    console.log('Σθ', Σθ.toDegrees(), ((n-2)*Math.PI).toDegrees());

	    var E = (Σθ - (n-2)*Math.PI); // spherical excess (in steradians)
	    var A = E * R*R;              // area (in units of radius)

	    return A;
	};


	/**
	 * Returns point representing geographic mean of supplied points.
	 *
	 * @param   {LatLon[]} points - Array of points to be averaged.
	 * @returns {LatLon}   Point at the geographic mean of the supplied points.
	 * @todo Not yet tested.
	 */
	LatLon.meanOf = function(points) {
	    var m = new Vector3d(0, 0, 0);

	    // add all vectors
	    for (var p=0; p<points.length; p++) {
	        m = m.plus(points[p].toVector());
	    }

	    // m is now geographic mean
	    return m.unit().toLatLonS();
	};


	/**
	 * Checks if another point is equal to ‘this’ point.
	 *
	 * @param   {LatLon} point - Point to be compared against this point.
	 * @returns {bool}    True if points are identical.
	 *
	 * @example
	 *   var p1 = new LatLon(52.205, 0.119);
	 *   var p2 = new LatLon(52.205, 0.119);
	 *   var equal = p1.equals(p2); // true
	 */
	LatLon.prototype.equals = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    if (this.lat != point.lat) return false;
	    if (this.lon != point.lon) return false;

	    return true;
	};


	/**
	 * Returns a string representation of ‘this’ point.
	 *
	 * @param   {string} [format=dms] - Format point as 'd', 'dm', 'dms'.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use: default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Comma-separated formatted latitude/longitude.
	 */
	LatLon.prototype.toString = function(format, dp) {
	    return Dms.toLat(this.lat, format, dp) + ', ' + Dms.toLon(this.lon, format, dp);
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend Number object with method to convert numeric degrees to radians */
	if (Number.prototype.toRadians === undefined) {
	    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}

	/** Extend Number object with method to convert radians to numeric (signed) degrees */
	if (Number.prototype.toDegrees === undefined) {
	    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
	}

	/** Polyfill Math.sign for old browsers / IE */
	if (Math.sign === undefined) {
	    Math.sign = function(x) {
	        x = +x; // convert to a number
	        if (x === 0 || isNaN(x)) return x;
	        return x > 0 ? 1 : -1;
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = LatLon, module.exports.Vector3d = Vector3d; // ≡ export { LatLon as default, Vector3d }


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Vector handling functions                                          (c) Chris Veness 2011-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-vector3d.html                               */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';


	/**
	 * Library of 3-d vector manipulation routines.
	 *
	 * In a geodesy context, these vectors may be used to represent:
	 *  - n-vector representing a normal to point on Earth's surface
	 *  - earth-centered, earth fixed vector (≡ Gade’s ‘p-vector’)
	 *  - great circle normal to vector (on spherical earth model)
	 *  - motion vector on Earth's surface
	 *  - etc
	 *
	 * Functions return vectors as return results, so that operations can be chained.
	 * @example var v = v1.cross(v2).dot(v3) // ≡ v1×v2⋅v3
	 *
	 * @module vector3d
	 */


	/**
	 * Creates a 3-d vector.
	 *
	 * The vector may be normalised, or use x/y/z values for eg height relative to the sphere or
	 * ellipsoid, distance from earth centre, etc.
	 *
	 * @constructor
	 * @param {number} x - X component of vector.
	 * @param {number} y - Y component of vector.
	 * @param {number} z - Z component of vector.
	 */
	function Vector3d(x, y, z) {
	    // allow instantiation without 'new'
	    if (!(this instanceof Vector3d)) return new Vector3d(x, y, z);

	    this.x = Number(x);
	    this.y = Number(y);
	    this.z = Number(z);
	}


	/**
	 * Adds supplied vector to ‘this’ vector.
	 *
	 * @param   {Vector3d} v - Vector to be added to this vector.
	 * @returns {Vector3d} Vector representing sum of this and v.
	 */
	Vector3d.prototype.plus = function(v) {
	    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');

	    return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
	};


	/**
	 * Subtracts supplied vector from ‘this’ vector.
	 *
	 * @param   {Vector3d} v - Vector to be subtracted from this vector.
	 * @returns {Vector3d} Vector representing difference between this and v.
	 */
	Vector3d.prototype.minus = function(v) {
	    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');

	    return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
	};


	/**
	 * Multiplies ‘this’ vector by a scalar value.
	 *
	 * @param   {number}   x - Factor to multiply this vector by.
	 * @returns {Vector3d} Vector scaled by x.
	 */
	Vector3d.prototype.times = function(x) {
	    x = Number(x);

	    return new Vector3d(this.x * x, this.y * x, this.z * x);
	};


	/**
	 * Divides ‘this’ vector by a scalar value.
	 *
	 * @param   {number}   x - Factor to divide this vector by.
	 * @returns {Vector3d} Vector divided by x.
	 */
	Vector3d.prototype.dividedBy = function(x) {
	    x = Number(x);

	    return new Vector3d(this.x / x, this.y / x, this.z / x);
	};


	/**
	 * Multiplies ‘this’ vector by the supplied vector using dot (scalar) product.
	 *
	 * @param   {Vector3d} v - Vector to be dotted with this vector.
	 * @returns {number} Dot product of ‘this’ and v.
	 */
	Vector3d.prototype.dot = function(v) {
	    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');

	    return this.x*v.x + this.y*v.y + this.z*v.z;
	};


	/**
	 * Multiplies ‘this’ vector by the supplied vector using cross (vector) product.
	 *
	 * @param   {Vector3d} v - Vector to be crossed with this vector.
	 * @returns {Vector3d} Cross product of ‘this’ and v.
	 */
	Vector3d.prototype.cross = function(v) {
	    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');

	    var x = this.y*v.z - this.z*v.y;
	    var y = this.z*v.x - this.x*v.z;
	    var z = this.x*v.y - this.y*v.x;

	    return new Vector3d(x, y, z);
	};


	/**
	 * Negates a vector to point in the opposite direction
	 *
	 * @returns {Vector3d} Negated vector.
	 */
	Vector3d.prototype.negate = function() {
	    return new Vector3d(-this.x, -this.y, -this.z);
	};


	/**
	 * Length (magnitude or norm) of ‘this’ vector
	 *
	 * @returns {number} Magnitude of this vector.
	 */
	Vector3d.prototype.length = function() {
	    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	};


	/**
	 * Normalizes a vector to its unit vector
	 * – if the vector is already unit or is zero magnitude, this is a no-op.
	 *
	 * @returns {Vector3d} Normalised version of this vector.
	 */
	Vector3d.prototype.unit = function() {
	    var norm = this.length();
	    if (norm == 1) return this;
	    if (norm == 0) return this;

	    var x = this.x/norm;
	    var y = this.y/norm;
	    var z = this.z/norm;

	    return new Vector3d(x, y, z);
	};


	/**
	 * Calculates the angle between ‘this’ vector and supplied vector.
	 *
	 * @param   {Vector3d} v
	 * @param   {Vector3d} [vSign] - If supplied (and out of plane of this and v), angle is signed +ve if
	 *     this->v is clockwise looking along vSign, -ve in opposite direction (otherwise unsigned angle).
	 * @returns {number} Angle (in radians) between this vector and supplied vector.
	 */
	Vector3d.prototype.angleTo = function(v, vSign) {
	    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');

	    var sinθ = this.cross(v).length();
	    var cosθ = this.dot(v);

	    if (vSign !== undefined) {
	        if (!(vSign instanceof Vector3d)) throw new TypeError('vSign is not Vector3d object');
	        // use vSign as reference to get sign of sinθ
	        sinθ = this.cross(v).dot(vSign)<0 ? -sinθ : sinθ;
	    }

	    return Math.atan2(sinθ, cosθ);
	};


	/**
	 * Rotates ‘this’ point around an axis by a specified angle.
	 *
	 * @param   {Vector3d} axis - The axis being rotated around.
	 * @param   {number}   theta - The angle of rotation (in radians).
	 * @returns {Vector3d} The rotated point.
	 */
	Vector3d.prototype.rotateAround = function(axis, theta) {
	    if (!(axis instanceof Vector3d)) throw new TypeError('axis is not Vector3d object');

	    // en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
	    // en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Quaternion-derived_rotation_matrix
	    var p1 = this.unit();
	    var p = [ p1.x, p1.y, p1.z ]; // the point being rotated
	    var a = axis.unit();          // the axis being rotated around
	    var s = Math.sin(theta);
	    var c = Math.cos(theta);
	    // quaternion-derived rotation matrix
	    var q = [
	        [ a.x*a.x*(1-c) + c,     a.x*a.y*(1-c) - a.z*s, a.x*a.z*(1-c) + a.y*s],
	        [ a.y*a.x*(1-c) + a.z*s, a.y*a.y*(1-c) + c,     a.y*a.z*(1-c) - a.x*s],
	        [ a.z*a.x*(1-c) - a.y*s, a.z*a.y*(1-c) + a.x*s, a.z*a.z*(1-c) + c    ],
	    ];
	    // multiply q × p
	    var qp = [0, 0, 0];
	    for (var i=0; i<3; i++) {
	        for (var j=0; j<3; j++) {
	            qp[i] += q[i][j] * p[j];
	        }
	    }
	    var p2 = new Vector3d(qp[0], qp[1], qp[2]);
	    return p2;
	    // qv en.wikipedia.org/wiki/Rodrigues'_rotation_formula...
	};


	/**
	 * String representation of vector.
	 *
	 * @param   {number} [precision=3] - Number of decimal places to be used.
	 * @returns {string} Vector represented as [x,y,z].
	 */
	Vector3d.prototype.toString = function(precision) {
	    var p = (precision === undefined) ? 3 : Number(precision);

	    var str = '[' + this.x.toFixed(p) + ',' + this.y.toFixed(p) + ',' + this.z.toFixed(p) + ']';

	    return str;
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = Vector3d; // ≡ export default Vector3d


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* UTM / WGS-84 Conversion Functions                                  (c) Chris Veness 2014-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-utm-mgrs.html                                           */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-utm.html                                    */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var LatLon = __webpack_require__(25); // ≡ import LatLon from 'latlon-ellipsoidal.js'


	/**
	 * Convert between Universal Transverse Mercator coordinates and WGS 84 latitude/longitude points.
	 *
	 * Method based on Karney 2011 ‘Transverse Mercator with an accuracy of a few nanometers’,
	 * building on Krüger 1912 ‘Konforme Abbildung des Erdellipsoids in der Ebene’.
	 *
	 * @module   utm
	 * @requires latlon-ellipsoidal
	 */


	/**
	 * Creates a Utm coordinate object.
	 *
	 * @constructor
	 * @param  {number} zone - UTM 6° longitudinal zone (1..60 covering 180°W..180°E).
	 * @param  {string} hemisphere - N for northern hemisphere, S for southern hemisphere.
	 * @param  {number} easting - Easting in metres from false easting (-500km from central meridian).
	 * @param  {number} northing - Northing in metres from equator (N) or from false northing -10,000km (S).
	 * @param  {LatLon.datum} [datum=WGS84] - Datum UTM coordinate is based on.
	 * @param  {number} [convergence] - Meridian convergence (bearing of grid north clockwise from true
	 *                  north), in degrees
	 * @param  {number} [scale] - Grid scale factor
	 * @throws {Error}  Invalid UTM coordinate
	 *
	 * @example
	 *   var utmCoord = new Utm(31, 'N', 448251, 5411932);
	 */
	function Utm(zone, hemisphere, easting, northing, datum, convergence, scale) {
	    if (!(this instanceof Utm)) { // allow instantiation without 'new'
	        return new Utm(zone, hemisphere, easting, northing, datum, convergence, scale);
	    }

	    if (datum === undefined) datum = LatLon.datum.WGS84; // default if not supplied
	    if (convergence === undefined) convergence = null;   // default if not supplied
	    if (scale === undefined) scale = null;               // default if not supplied

	    if (!(1<=zone && zone<=60)) throw new Error('Invalid UTM zone '+zone);
	    if (!hemisphere.match(/[NS]/i)) throw new Error('Invalid UTM hemisphere '+hemisphere);
	    // range-check easting/northing (with 40km overlap between zones) - is this worthwhile?
	    //if (!(120e3<=easting && easting<=880e3)) throw new Error('Invalid UTM easting '+ easting);
	    //if (!(0<=northing && northing<=10000e3)) throw new Error('Invalid UTM northing '+ northing);

	    this.zone = Number(zone);
	    this.hemisphere = hemisphere.toUpperCase();
	    this.easting = Number(easting);
	    this.northing = Number(northing);
	    this.datum = datum;
	    this.convergence = convergence===null ? null : Number(convergence);
	    this.scale = scale===null ? null : Number(scale);
	}


	/**
	 * Converts latitude/longitude to UTM coordinate.
	 *
	 * Implements Karney’s method, using Krüger series to order n^6, giving results accurate to 5nm for
	 * distances up to 3900km from the central meridian.
	 *
	 * @returns {Utm}   UTM coordinate.
	 * @throws  {Error} If point not valid, if point outside latitude range.
	 *
	 * @example
	 *   var latlong = new LatLon(48.8582, 2.2945);
	 *   var utmCoord = latlong.toUtm(); // utmCoord.toString(): '31 N 448252 5411933'
	 */
	LatLon.prototype.toUtm = function() {
	    if (isNaN(this.lat) || isNaN(this.lon)) throw new Error('Invalid point');
	    if (!(-80<this.lat && this.lat<84)) throw new Error('Outside UTM limits ('+this.lat+','+this.lon+')');

	    var falseEasting = 500e3, falseNorthing = 10000e3;

	    var zone = Math.floor((this.lon+180)/6) + 1; // longitudinal zone
	    var λ0 = ((zone-1)*6 - 180 + 3).toRadians(); // longitude of central meridian

	    // ---- handle Norway/Svalbard exceptions
	    // grid zones are 8° tall; 0°N is offset 10 into latitude bands array
	    var mgrsLatBands = 'CDEFGHJKLMNPQRSTUVWXX'; // X is repeated for 80-84°N
	    var latBand = mgrsLatBands.charAt(Math.floor(this.lat/8+10));
	    // adjust zone & central meridian for Norway
	    if (zone==31 && latBand=='V' && this.lon>= 3) { zone++; λ0 += (6).toRadians(); }
	    // adjust zone & central meridian for Svalbard
	    if (zone==32 && latBand=='X' && this.lon<  9) { zone--; λ0 -= (6).toRadians(); }
	    if (zone==32 && latBand=='X' && this.lon>= 9) { zone++; λ0 += (6).toRadians(); }
	    if (zone==34 && latBand=='X' && this.lon< 21) { zone--; λ0 -= (6).toRadians(); }
	    if (zone==34 && latBand=='X' && this.lon>=21) { zone++; λ0 += (6).toRadians(); }
	    if (zone==36 && latBand=='X' && this.lon< 33) { zone--; λ0 -= (6).toRadians(); }
	    if (zone==36 && latBand=='X' && this.lon>=33) { zone++; λ0 += (6).toRadians(); }

	    var φ = this.lat.toRadians();      // latitude ± from equator
	    var λ = this.lon.toRadians() - λ0; // longitude ± from central meridian

	    var a = this.datum.ellipsoid.a, f = this.datum.ellipsoid.f;
	    // WGS 84: a = 6378137, b = 6356752.314245, f = 1/298.257223563;

	    var k0 = 0.9996; // UTM scale on the central meridian

	    // ---- easting, northing: Karney 2011 Eq 7-14, 29, 35:

	    var e = Math.sqrt(f*(2-f)); // eccentricity
	    var n = f / (2 - f);        // 3rd flattening
	    var n2 = n*n, n3 = n*n2, n4 = n*n3, n5 = n*n4, n6 = n*n5; // TODO: compare Horner-form accuracy?

	    var cosλ = Math.cos(λ), sinλ = Math.sin(λ), tanλ = Math.tan(λ);

	    var τ = Math.tan(φ); // τ ≡ tanφ, τʹ ≡ tanφʹ; prime (ʹ) indicates angles on the conformal sphere
	    var σ = Math.sinh(e*Math.atanh(e*τ/Math.sqrt(1+τ*τ)));

	    var τʹ = τ*Math.sqrt(1+σ*σ) - σ*Math.sqrt(1+τ*τ);

	    var ξʹ = Math.atan2(τʹ, cosλ);
	    var ηʹ = Math.asinh(sinλ / Math.sqrt(τʹ*τʹ + cosλ*cosλ));

	    var A = a/(1+n) * (1 + 1/4*n2 + 1/64*n4 + 1/256*n6); // 2πA is the circumference of a meridian

	    var α = [ null, // note α is one-based array (6th order Krüger expressions)
	        1/2*n - 2/3*n2 + 5/16*n3 +   41/180*n4 -     127/288*n5 +      7891/37800*n6,
	              13/48*n2 -  3/5*n3 + 557/1440*n4 +     281/630*n5 - 1983433/1935360*n6,
	                       61/240*n3 -  103/140*n4 + 15061/26880*n5 +   167603/181440*n6,
	                               49561/161280*n4 -     179/168*n5 + 6601661/7257600*n6,
	                                                 34729/80640*n5 - 3418889/1995840*n6,
	                                                              212378941/319334400*n6 ];

	    var ξ = ξʹ;
	    for (var j=1; j<=6; j++) ξ += α[j] * Math.sin(2*j*ξʹ) * Math.cosh(2*j*ηʹ);

	    var η = ηʹ;
	    for (var j=1; j<=6; j++) η += α[j] * Math.cos(2*j*ξʹ) * Math.sinh(2*j*ηʹ);

	    var x = k0 * A * η;
	    var y = k0 * A * ξ;

	    // ---- convergence: Karney 2011 Eq 23, 24

	    var pʹ = 1;
	    for (var j=1; j<=6; j++) pʹ += 2*j*α[j] * Math.cos(2*j*ξʹ) * Math.cosh(2*j*ηʹ);
	    var qʹ = 0;
	    for (var j=1; j<=6; j++) qʹ += 2*j*α[j] * Math.sin(2*j*ξʹ) * Math.sinh(2*j*ηʹ);

	    var γʹ = Math.atan(τʹ / Math.sqrt(1+τʹ*τʹ)*tanλ);
	    var γʺ = Math.atan2(qʹ, pʹ);

	    var γ = γʹ + γʺ;

	    // ---- scale: Karney 2011 Eq 25

	    var sinφ = Math.sin(φ);
	    var kʹ = Math.sqrt(1 - e*e*sinφ*sinφ) * Math.sqrt(1 + τ*τ) / Math.sqrt(τʹ*τʹ + cosλ*cosλ);
	    var kʺ = A / a * Math.sqrt(pʹ*pʹ + qʹ*qʹ);

	    var k = k0 * kʹ * kʺ;

	    // ------------

	    // shift x/y to false origins
	    x = x + falseEasting;             // make x relative to false easting
	    if (y < 0) y = y + falseNorthing; // make y in southern hemisphere relative to false northing

	    // round to reasonable precision
	    x = Number(x.toFixed(6)); // nm precision
	    y = Number(y.toFixed(6)); // nm precision
	    var convergence = Number(γ.toDegrees().toFixed(9));
	    var scale = Number(k.toFixed(12));

	    var h = this.lat>=0 ? 'N' : 'S'; // hemisphere

	    return new Utm(zone, h, x, y, this.datum, convergence, scale);
	};


	/**
	 * Converts UTM zone/easting/northing coordinate to latitude/longitude
	 *
	 * @param   {Utm}    utmCoord - UTM coordinate to be converted to latitude/longitude.
	 * @returns {LatLon} Latitude/longitude of supplied grid reference.
	 *
	 * @example
	 *   var grid = new Utm(31, 'N', 448251.795, 5411932.678);
	 *   var latlong = grid.toLatLonE(); // latlong.toString(): 48°51′29.52″N, 002°17′40.20″E
	 */
	Utm.prototype.toLatLonE = function() {
	    var z = this.zone;
	    var h = this.hemisphere;
	    var x = this.easting;
	    var y = this.northing;

	    if (isNaN(z) || isNaN(x) || isNaN(y)) throw new Error('Invalid coordinate');

	    var falseEasting = 500e3, falseNorthing = 10000e3;

	    var a = this.datum.ellipsoid.a, f = this.datum.ellipsoid.f;
	    // WGS 84:  a = 6378137, b = 6356752.314245, f = 1/298.257223563;

	    var k0 = 0.9996; // UTM scale on the central meridian

	    x = x - falseEasting;               // make x ± relative to central meridian
	    y = h=='S' ? y - falseNorthing : y; // make y ± relative to equator

	    // ---- from Karney 2011 Eq 15-22, 36:

	    var e = Math.sqrt(f*(2-f)); // eccentricity
	    var n = f / (2 - f);        // 3rd flattening
	    var n2 = n*n, n3 = n*n2, n4 = n*n3, n5 = n*n4, n6 = n*n5;

	    var A = a/(1+n) * (1 + 1/4*n2 + 1/64*n4 + 1/256*n6); // 2πA is the circumference of a meridian

	    var η = x / (k0*A);
	    var ξ = y / (k0*A);

	    var β = [ null, // note β is one-based array (6th order Krüger expressions)
	        1/2*n - 2/3*n2 + 37/96*n3 -    1/360*n4 -   81/512*n5 +    96199/604800*n6,
	               1/48*n2 +  1/15*n3 - 437/1440*n4 +   46/105*n5 - 1118711/3870720*n6,
	                        17/480*n3 -   37/840*n4 - 209/4480*n5 +      5569/90720*n6,
	                                 4397/161280*n4 -   11/504*n5 -  830251/7257600*n6,
	                                               4583/161280*n5 -  108847/3991680*n6,
	                                                             20648693/638668800*n6 ];

	    var ξʹ = ξ;
	    for (var j=1; j<=6; j++) ξʹ -= β[j] * Math.sin(2*j*ξ) * Math.cosh(2*j*η);

	    var ηʹ = η;
	    for (var j=1; j<=6; j++) ηʹ -= β[j] * Math.cos(2*j*ξ) * Math.sinh(2*j*η);

	    var sinhηʹ = Math.sinh(ηʹ);
	    var sinξʹ = Math.sin(ξʹ), cosξʹ = Math.cos(ξʹ);

	    var τʹ = sinξʹ / Math.sqrt(sinhηʹ*sinhηʹ + cosξʹ*cosξʹ);

	    var τi = τʹ;
	    do {
	        var σi = Math.sinh(e*Math.atanh(e*τi/Math.sqrt(1+τi*τi)));
	        var τiʹ = τi * Math.sqrt(1+σi*σi) - σi * Math.sqrt(1+τi*τi);
	        var δτi = (τʹ - τiʹ)/Math.sqrt(1+τiʹ*τiʹ)
	            * (1 + (1-e*e)*τi*τi) / ((1-e*e)*Math.sqrt(1+τi*τi));
	        τi += δτi;
	    } while (Math.abs(δτi) > 1e-12); // using IEEE 754 δτi -> 0 after 2-3 iterations
	    // note relatively large convergence test as δτi toggles on ±1.12e-16 for eg 31 N 400000 5000000
	    var τ = τi;

	    var φ = Math.atan(τ);

	    var λ = Math.atan2(sinhηʹ, cosξʹ);

	    // ---- convergence: Karney 2011 Eq 26, 27

	    var p = 1;
	    for (var j=1; j<=6; j++) p -= 2*j*β[j] * Math.cos(2*j*ξ) * Math.cosh(2*j*η);
	    var q = 0;
	    for (var j=1; j<=6; j++) q += 2*j*β[j] * Math.sin(2*j*ξ) * Math.sinh(2*j*η);

	    var γʹ = Math.atan(Math.tan(ξʹ) * Math.tanh(ηʹ));
	    var γʺ = Math.atan2(q, p);

	    var γ = γʹ + γʺ;

	    // ---- scale: Karney 2011 Eq 28

	    var sinφ = Math.sin(φ);
	    var kʹ = Math.sqrt(1 - e*e*sinφ*sinφ) * Math.sqrt(1 + τ*τ) * Math.sqrt(sinhηʹ*sinhηʹ + cosξʹ*cosξʹ);
	    var kʺ = A / a / Math.sqrt(p*p + q*q);

	    var k = k0 * kʹ * kʺ;

	    // ------------

	    var λ0 = ((z-1)*6 - 180 + 3).toRadians(); // longitude of central meridian
	    λ += λ0; // move λ from zonal to global coordinates

	    // round to reasonable precision
	    var lat = Number(φ.toDegrees().toFixed(11)); // nm precision (1nm = 10^-11°)
	    var lon = Number(λ.toDegrees().toFixed(11)); // (strictly lat rounding should be φ⋅cosφ!)
	    var convergence = Number(γ.toDegrees().toFixed(9));
	    var scale = Number(k.toFixed(12));

	    var latLong = new LatLon(lat, lon, this.datum);
	    // ... and add the convergence and scale into the LatLon object ... wonderful JavaScript!
	    latLong.convergence = convergence;
	    latLong.scale = scale;

	    return latLong;
	};


	/**
	 * Parses string representation of UTM coordinate.
	 *
	 * A UTM coordinate comprises (space-separated)
	 *  - zone
	 *  - hemisphere
	 *  - easting
	 *  - northing.
	 *
	 * @param   {string} utmCoord - UTM coordinate (WGS 84).
	 * @param   {Datum}  [datum=WGS84] - Datum coordinate is defined in (default WGS 84).
	 * @returns {Utm}
	 * @throws  {Error}  Invalid UTM coordinate.
	 *
	 * @example
	 *   var utmCoord = Utm.parse('31 N 448251 5411932');
	 *   // utmCoord: {zone: 31, hemisphere: 'N', easting: 448251, northing: 5411932 }
	 */
	Utm.parse = function(utmCoord, datum) {
	    if (datum === undefined) datum = LatLon.datum.WGS84; // default if not supplied

	    // match separate elements (separated by whitespace)
	    utmCoord = utmCoord.trim().match(/\S+/g);

	    if (utmCoord==null || utmCoord.length!=4) throw new Error('Invalid UTM coordinate ‘'+utmCoord+'’');

	    var zone = utmCoord[0], hemisphere = utmCoord[1], easting = utmCoord[2], northing = utmCoord[3];

	    return new Utm(zone, hemisphere, easting, northing, datum);
	};


	/**
	 * Returns a string representation of a UTM coordinate.
	 *
	 * To distinguish from MGRS grid zone designators, a space is left between the zone and the
	 * hemisphere.
	 *
	 * Note that UTM coordinates get rounded, not truncated (unlike MGRS grid references).
	 *
	 * @param   {number} [digits=0] - Number of digits to appear after the decimal point (3 ≡ mm).
	 * @returns {string} A string representation of the coordinate.
	 *
	 * @example
	 *   var utm = Utm.parse('31 N 448251 5411932').toString(4);  // 31 N 448251.0000 5411932.0000
	 */
	Utm.prototype.toString = function(digits) {
	    digits = Number(digits||0); // default 0 if not supplied

	    var z = this.zone<10 ? '0'+this.zone : this.zone; // leading zero
	    var h = this.hemisphere;
	    var e = this.easting;
	    var n = this.northing;
	    if (isNaN(z) || !h.match(/[NS]/) || isNaN(e) || isNaN(n)) return '';

	    return z+' '+h+' '+e.toFixed(digits)+' '+n.toFixed(digits);
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Polyfill Math.sinh for old browsers / IE */
	if (Math.sinh === undefined) {
	    Math.sinh = function(x) {
	        return (Math.exp(x) - Math.exp(-x)) / 2;
	    };
	}

	/** Polyfill Math.cosh for old browsers / IE */
	if (Math.cosh === undefined) {
	    Math.cosh = function(x) {
	        return (Math.exp(x) + Math.exp(-x)) / 2;
	    };
	}

	/** Polyfill Math.tanh for old browsers / IE */
	if (Math.tanh === undefined) {
	    Math.tanh = function(x) {
	        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	    };
	}

	/** Polyfill Math.asinh for old browsers / IE */
	if (Math.asinh === undefined) {
	    Math.asinh = function(x) {
	        return Math.log(x + Math.sqrt(1 + x*x));
	    };
	}

	/** Polyfill Math.atanh for old browsers / IE */
	if (Math.atanh === undefined) {
	    Math.atanh = function(x) {
	        return Math.log((1+x) / (1-x)) / 2;
	    };
	}

	/** Polyfill String.trim for old browsers
	 *  (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
	if (String.prototype.trim === undefined) {
	    String.prototype.trim = function() {
	        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = Utm; // ≡ export default Utm


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/*  MGRS / UTM Conversion Functions                                   (c) Chris Veness 2014-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-utm-mgrs.html                                           */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-mgrs.html                                   */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var Utm = __webpack_require__(29);                   // ≡ import Utm from 'utm.js'
	if (typeof module!='undefined' && module.exports) var LatLon = __webpack_require__(25); // ≡ import LatLon from 'latlon-ellipsoidal.js'


	/**
	 * Convert between Universal Transverse Mercator (UTM) coordinates and Military Grid Reference
	 * System (MGRS/NATO) grid references.
	 *
	 * @module   mgrs
	 * @requires utm
	 * @requires latlon-ellipsoidal
	 */

	/* qv www.fgdc.gov/standards/projects/FGDC-standards-projects/usng/fgdc_std_011_2001_usng.pdf p10 */


	/*
	 * Latitude bands C..X 8° each, covering 80°S to 84°N
	 */
	Mgrs.latBands = 'CDEFGHJKLMNPQRSTUVWXX'; // X is repeated for 80-84°N


	/*
	 * 100km grid square column (‘e’) letters repeat every third zone
	 */
	Mgrs.e100kLetters = [ 'ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ' ];


	/*
	 * 100km grid square row (‘n’) letters repeat every other zone
	 */
	Mgrs.n100kLetters = ['ABCDEFGHJKLMNPQRSTUV', 'FGHJKLMNPQRSTUVABCDE'];


	/**
	 * Creates an Mgrs grid reference object.
	 *
	 * @constructor
	 * @param  {number} zone - 6° longitudinal zone (1..60 covering 180°W..180°E).
	 * @param  {string} band - 8° latitudinal band (C..X covering 80°S..84°N).
	 * @param  {string} e100k - First letter (E) of 100km grid square.
	 * @param  {string} n100k - Second letter (N) of 100km grid square.
	 * @param  {number} easting - Easting in metres within 100km grid square.
	 * @param  {number} northing - Northing in metres within 100km grid square.
	 * @param  {LatLon.datum} [datum=WGS84] - Datum UTM coordinate is based on.
	 * @throws {Error}  Invalid MGRS grid reference.
	 *
	 * @example
	 *   var mgrsRef = new Mgrs(31, 'U', 'D', 'Q', 48251, 11932); // 31U DQ 48251 11932
	 */
	function Mgrs(zone, band, e100k, n100k, easting, northing, datum) {
	    // allow instantiation without 'new'
	    if (!(this instanceof Mgrs)) return new Mgrs(zone, band, e100k, n100k, easting, northing, datum);

	    if (datum === undefined) datum = LatLon.datum.WGS84; // default if not supplied

	    if (!(1<=zone && zone<=60)) throw new Error('Invalid MGRS grid reference (zone ‘'+zone+'’)');
	    if (band.length != 1) throw new Error('Invalid MGRS grid reference (band ‘'+band+'’)');
	    if (Mgrs.latBands.indexOf(band) == -1) throw new Error('Invalid MGRS grid reference (band ‘'+band+'’)');
	    if (e100k.length!=1) throw new Error('Invalid MGRS grid reference (e100k ‘'+e100k+'’)');
	    if (n100k.length!=1) throw new Error('Invalid MGRS grid reference (n100k ‘'+n100k+'’)');

	    this.zone = Number(zone);
	    this.band = band;
	    this.e100k = e100k;
	    this.n100k = n100k;
	    this.easting = Number(easting);
	    this.northing = Number(northing);
	    this.datum = datum;
	}


	/**
	 * Converts UTM coordinate to MGRS reference.
	 *
	 * @returns {Mgrs}
	 * @throws  {Error} Invalid UTM coordinate.
	 *
	 * @example
	 *   var utmCoord = new Utm(31, 'N', 448251, 5411932);
	 *   var mgrsRef = utmCoord.toMgrs(); // 31U DQ 48251 11932
	 */
	Utm.prototype.toMgrs = function() {
	    if (isNaN(this.zone + this.easting + this.northing)) throw new Error('Invalid UTM coordinate ‘'+this.toString()+'’');

	    // MGRS zone is same as UTM zone
	    var zone = this.zone;

	    // convert UTM to lat/long to get latitude to determine band
	    var latlong = this.toLatLonE();
	    // grid zones are 8° tall, 0°N is 10th band
	    var band = Mgrs.latBands.charAt(Math.floor(latlong.lat/8+10)); // latitude band

	    // columns in zone 1 are A-H, zone 2 J-R, zone 3 S-Z, then repeating every 3rd zone
	    var col = Math.floor(this.easting / 100e3);
	    var e100k = Mgrs.e100kLetters[(zone-1)%3].charAt(col-1); // col-1 since 1*100e3 -> A (index 0), 2*100e3 -> B (index 1), etc.

	    // rows in even zones are A-V, in odd zones are F-E
	    var row = Math.floor(this.northing / 100e3) % 20;
	    var n100k = Mgrs.n100kLetters[(zone-1)%2].charAt(row);

	    // truncate easting/northing to within 100km grid square
	    var easting = this.easting % 100e3;
	    var northing = this.northing % 100e3;

	    // round to nm precision
	    easting = Number(easting.toFixed(6));
	    northing = Number(northing.toFixed(6));

	    return new Mgrs(zone, band, e100k, n100k, easting, northing);
	};


	/**
	 * Converts MGRS grid reference to UTM coordinate.
	 *
	 * @returns {Utm}
	 *
	 * @example
	 *   var utmCoord = Mgrs.parse('31U DQ 448251 11932').toUtm(); // 31 N 448251 5411932
	 */
	Mgrs.prototype.toUtm = function() {
	    var zone = this.zone;
	    var band = this.band;
	    var e100k = this.e100k;
	    var n100k = this.n100k;
	    var easting = this.easting;
	    var northing = this.northing;

	    var hemisphere = band>='N' ? 'N' : 'S';

	    // get easting specified by e100k
	    var col = Mgrs.e100kLetters[(zone-1)%3].indexOf(e100k) + 1; // index+1 since A (index 0) -> 1*100e3, B (index 1) -> 2*100e3, etc.
	    var e100kNum = col * 100e3; // e100k in metres

	    // get northing specified by n100k
	    var row = Mgrs.n100kLetters[(zone-1)%2].indexOf(n100k);
	    var n100kNum = row * 100e3; // n100k in metres

	    // get latitude of (bottom of) band
	    var latBand = (Mgrs.latBands.indexOf(band)-10)*8;

	    // northing of bottom of band, extended to include entirety of bottommost 100km square
	    // (100km square boundaries are aligned with 100km UTM northing intervals)
	    var nBand = Math.floor(new LatLon(latBand, 0).toUtm().northing/100e3)*100e3;
	    // 100km grid square row letters repeat every 2,000km north; add enough 2,000km blocks to get
	    // into required band
	    var n2M = 0; // northing of 2,000km block
	    while (n2M + n100kNum + northing < nBand) n2M += 2000e3;

	    return new Utm(zone, hemisphere, e100kNum+easting, n2M+n100kNum+northing, this.datum);
	};


	/**
	 * Parses string representation of MGRS grid reference.
	 *
	 * An MGRS grid reference comprises (space-separated)
	 *  - grid zone designator (GZD)
	 *  - 100km grid square letter-pair
	 *  - easting
	 *  - northing.
	 *
	 * @param   {string} mgrsGridRef - String representation of MGRS grid reference.
	 * @returns {Mgrs}   Mgrs grid reference object.
	 * @throws  {Error}  Invalid MGRS grid reference.
	 *
	 * @example
	 *   var mgrsRef = Mgrs.parse('31U DQ 48251 11932');
	 *   var mgrsRef = Mgrs.parse('31UDQ4825111932');
	 *   //  mgrsRef: { zone:31, band:'U', e100k:'D', n100k:'Q', easting:48251, northing:11932 }
	 */
	Mgrs.parse = function(mgrsGridRef) {
	    mgrsGridRef = mgrsGridRef.trim();

	    // check for military-style grid reference with no separators
	    if (!mgrsGridRef.match(/\s/)) {
	        var en = mgrsGridRef.slice(5); // get easting/northing following zone/band/100ksq
	        en = en.slice(0, en.length/2)+' '+en.slice(-en.length/2); // separate easting/northing
	        mgrsGridRef = mgrsGridRef.slice(0, 3)+' '+mgrsGridRef.slice(3, 5)+' '+en; // insert spaces
	    }

	    // match separate elements (separated by whitespace)
	    mgrsGridRef = mgrsGridRef.match(/\S+/g);

	    if (mgrsGridRef==null || mgrsGridRef.length!=4) throw new Error('Invalid MGRS grid reference ‘'+mgrsGridRef+'’');

	    // split gzd into zone/band
	    var gzd = mgrsGridRef[0];
	    var zone = gzd.slice(0, 2);
	    var band = gzd.slice(2, 3);

	    // split 100km letter-pair into e/n
	    var en100k = mgrsGridRef[1];
	    var e100k = en100k.slice(0, 1);
	    var n100k = en100k.slice(1, 2);

	    var e = mgrsGridRef[2], n = mgrsGridRef[3];

	    // standardise to 10-digit refs - ie metres) (but only if < 10-digit refs, to allow decimals)
	    e = e.length>=5 ?  e : (e+'00000').slice(0, 5);
	    n = n.length>=5 ?  n : (n+'00000').slice(0, 5);

	    return new Mgrs(zone, band, e100k, n100k, e, n);
	};


	/**
	 * Returns a string representation of an MGRS grid reference.
	 *
	 * To distinguish from civilian UTM coordinate representations, no space is included within the
	 * zone/band grid zone designator.
	 *
	 * Components are separated by spaces: for a military-style unseparated string, use
	 * Mgrs.toString().replace(/ /g, '');
	 *
	 * Note that MGRS grid references get truncated, not rounded (unlike UTM coordinates).
	 *
	 * @param   {number} [digits=10] - Precision of returned grid reference (eg 4 = km, 10 = m).
	 * @returns {string} This grid reference in standard format.
	 * @throws  {Error}  Invalid precision.
	 *
	 * @example
	 *   var mgrsStr = new Mgrs(31, 'U', 'D', 'Q', 48251, 11932).toString(); // '31U DQ 48251 11932'
	 */
	Mgrs.prototype.toString = function(digits) {
	    digits = (digits === undefined) ? 10 : Number(digits);
	    if ([2,4,6,8,10].indexOf(digits) == -1) throw new Error('Invalid precision ‘'+digits+'’');

	    var zone = this.zone.pad(2); // ensure leading zero
	    var band = this.band;

	    var e100k = this.e100k;
	    var n100k = this.n100k;

	    // set required precision
	    var easting = Math.floor(this.easting/Math.pow(10, 5-digits/2));
	    var northing = Math.floor(this.northing/Math.pow(10, 5-digits/2));

	    // ensure leading zeros
	    easting = easting.pad(digits/2);
	    northing = northing.pad(digits/2);

	    return zone+band + ' ' + e100k+n100k + ' '  + easting + ' ' + northing;
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend Number object with method to pad with leading zeros to make it w chars wide
	 *  (q.v. stackoverflow.com/questions/2998784 */
	if (Number.prototype.pad === undefined) {
	    Number.prototype.pad = function(w) {
	        var n = this.toString();
	        while (n.length < w) n = '0' + n;
	        return n;
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = Mgrs; // ≡ export default Mgrs


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Ordnance Survey Grid Reference functions                           (c) Chris Veness 2005-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong-gridref.html                                            */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-osgridref.html                              */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	if (typeof module!='undefined' && module.exports) var LatLon = __webpack_require__(25); // ≡ import LatLon from 'latlon-ellipsoidal.js'


	/**
	 * Convert OS grid references to/from OSGB latitude/longitude points.
	 *
	 * Formulation implemented here due to Thomas, Redfearn, etc is as published by OS, but is inferior
	 * to Krüger as used by e.g. Karney 2011.
	 *
	 * www.ordnancesurvey.co.uk/docs/support/guide-coordinate-systems-great-britain.pdf.
	 *
	 * @module   osgridref
	 * @requires latlon-ellipsoidal
	 */
	/*
	 * Converted 2015 to work with WGS84 by default, OSGB36 as option;
	 * www.ordnancesurvey.co.uk/blog/2014/12/confirmation-on-changes-to-latitude-and-longitude
	 */


	/**
	 * Creates an OsGridRef object.
	 *
	 * @constructor
	 * @param {number} easting - Easting in metres from OS false origin.
	 * @param {number} northing - Northing in metres from OS false origin.
	 *
	 * @example
	 *   var grid = new OsGridRef(651409, 313177);
	 */
	function OsGridRef(easting, northing) {
	    // allow instantiation without 'new'
	    if (!(this instanceof OsGridRef)) return new OsGridRef(easting, northing);

	    this.easting = Number(easting);
	    this.northing = Number(northing);
	}


	/**
	 * Converts latitude/longitude to Ordnance Survey grid reference easting/northing coordinate.
	 *
	 * Note formulation implemented here due to Thomas, Redfearn, etc is as published by OS, but is
	 * inferior to Krüger as used by e.g. Karney 2011.
	 *
	 * @param   {LatLon}    point - latitude/longitude.
	 * @returns {OsGridRef} OS Grid Reference easting/northing.
	 *
	 * @example
	 *   var p = new LatLon(52.65798, 1.71605);
	 *   var grid = OsGridRef.latLonToOsGrid(p); // grid.toString(): TG 51409 13177
	 *   // for conversion of (historical) OSGB36 latitude/longitude point:
	 *   var p = new LatLon(52.65757, 1.71791, LatLon.datum.OSGB36);
	 */
	OsGridRef.latLonToOsGrid = function(point) {
	    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

	    // if necessary convert to OSGB36 first
	    if (point.datum != LatLon.datum.OSGB36) point = point.convertDatum(LatLon.datum.OSGB36);

	    var φ = point.lat.toRadians();
	    var λ = point.lon.toRadians();

	    var a = 6377563.396, b = 6356256.909;              // Airy 1830 major & minor semi-axes
	    var F0 = 0.9996012717;                             // NatGrid scale factor on central meridian
	    var φ0 = (49).toRadians(), λ0 = (-2).toRadians();  // NatGrid true origin is 49°N,2°W
	    var N0 = -100000, E0 = 400000;                     // northing & easting of true origin, metres
	    var e2 = 1 - (b*b)/(a*a);                          // eccentricity squared
	    var n = (a-b)/(a+b), n2 = n*n, n3 = n*n*n;         // n, n², n³

	    var cosφ = Math.cos(φ), sinφ = Math.sin(φ);
	    var ν = a*F0/Math.sqrt(1-e2*sinφ*sinφ);            // nu = transverse radius of curvature
	    var ρ = a*F0*(1-e2)/Math.pow(1-e2*sinφ*sinφ, 1.5); // rho = meridional radius of curvature
	    var η2 = ν/ρ-1;                                    // eta = ?

	    var Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (φ-φ0);
	    var Mb = (3*n + 3*n*n + (21/8)*n3) * Math.sin(φ-φ0) * Math.cos(φ+φ0);
	    var Mc = ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(φ-φ0)) * Math.cos(2*(φ+φ0));
	    var Md = (35/24)*n3 * Math.sin(3*(φ-φ0)) * Math.cos(3*(φ+φ0));
	    var M = b * F0 * (Ma - Mb + Mc - Md);              // meridional arc

	    var cos3φ = cosφ*cosφ*cosφ;
	    var cos5φ = cos3φ*cosφ*cosφ;
	    var tan2φ = Math.tan(φ)*Math.tan(φ);
	    var tan4φ = tan2φ*tan2φ;

	    var I = M + N0;
	    var II = (ν/2)*sinφ*cosφ;
	    var III = (ν/24)*sinφ*cos3φ*(5-tan2φ+9*η2);
	    var IIIA = (ν/720)*sinφ*cos5φ*(61-58*tan2φ+tan4φ);
	    var IV = ν*cosφ;
	    var V = (ν/6)*cos3φ*(ν/ρ-tan2φ);
	    var VI = (ν/120) * cos5φ * (5 - 18*tan2φ + tan4φ + 14*η2 - 58*tan2φ*η2);

	    var Δλ = λ-λ0;
	    var Δλ2 = Δλ*Δλ, Δλ3 = Δλ2*Δλ, Δλ4 = Δλ3*Δλ, Δλ5 = Δλ4*Δλ, Δλ6 = Δλ5*Δλ;

	    var N = I + II*Δλ2 + III*Δλ4 + IIIA*Δλ6;
	    var E = E0 + IV*Δλ + V*Δλ3 + VI*Δλ5;

	    N = Number(N.toFixed(3)); // round to mm precision
	    E = Number(E.toFixed(3));

	    return new OsGridRef(E, N); // gets truncated to SW corner of 1m grid square
	};


	/**
	 * Converts Ordnance Survey grid reference easting/northing coordinate to latitude/longitude
	 * (SW corner of grid square).
	 *
	 * Note formulation implemented here due to Thomas, Redfearn, etc is as published by OS, but is
	 * inferior to Krüger as used by e.g. Karney 2011.
	 *
	 * @param   {OsGridRef}    gridref - Grid ref E/N to be converted to lat/long (SW corner of grid square).
	 * @param   {LatLon.datum} [datum=WGS84] - Datum to convert grid reference into.
	 * @returns {LatLon}       Latitude/longitude of supplied grid reference.
	 *
	 * @example
	 *   var gridref = new OsGridRef(651409.903, 313177.270);
	 *   var pWgs84 = OsGridRef.osGridToLatLon(gridref);                     // 52°39′28.723″N, 001°42′57.787″E
	 *   // to obtain (historical) OSGB36 latitude/longitude point:
	 *   var pOsgb = OsGridRef.osGridToLatLon(gridref, LatLon.datum.OSGB36); // 52°39′27.253″N, 001°43′04.518″E
	 */
	OsGridRef.osGridToLatLon = function(gridref, datum) {
	    if (!(gridref instanceof OsGridRef)) throw new TypeError('gridref is not OsGridRef object');
	    if (datum === undefined) datum = LatLon.datum.WGS84;

	    var E = gridref.easting;
	    var N = gridref.northing;

	    var a = 6377563.396, b = 6356256.909;              // Airy 1830 major & minor semi-axes
	    var F0 = 0.9996012717;                             // NatGrid scale factor on central meridian
	    var φ0 = (49).toRadians(), λ0 = (-2).toRadians();  // NatGrid true origin is 49°N,2°W
	    var N0 = -100000, E0 = 400000;                     // northing & easting of true origin, metres
	    var e2 = 1 - (b*b)/(a*a);                          // eccentricity squared
	    var n = (a-b)/(a+b), n2 = n*n, n3 = n*n*n;         // n, n², n³

	    var φ=φ0, M=0;
	    do {
	        φ = (N-N0-M)/(a*F0) + φ;

	        var Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (φ-φ0);
	        var Mb = (3*n + 3*n*n + (21/8)*n3) * Math.sin(φ-φ0) * Math.cos(φ+φ0);
	        var Mc = ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(φ-φ0)) * Math.cos(2*(φ+φ0));
	        var Md = (35/24)*n3 * Math.sin(3*(φ-φ0)) * Math.cos(3*(φ+φ0));
	        M = b * F0 * (Ma - Mb + Mc - Md);              // meridional arc

	    } while (N-N0-M >= 0.00001);  // ie until < 0.01mm

	    var cosφ = Math.cos(φ), sinφ = Math.sin(φ);
	    var ν = a*F0/Math.sqrt(1-e2*sinφ*sinφ);            // nu = transverse radius of curvature
	    var ρ = a*F0*(1-e2)/Math.pow(1-e2*sinφ*sinφ, 1.5); // rho = meridional radius of curvature
	    var η2 = ν/ρ-1;                                    // eta = ?

	    var tanφ = Math.tan(φ);
	    var tan2φ = tanφ*tanφ, tan4φ = tan2φ*tan2φ, tan6φ = tan4φ*tan2φ;
	    var secφ = 1/cosφ;
	    var ν3 = ν*ν*ν, ν5 = ν3*ν*ν, ν7 = ν5*ν*ν;
	    var VII = tanφ/(2*ρ*ν);
	    var VIII = tanφ/(24*ρ*ν3)*(5+3*tan2φ+η2-9*tan2φ*η2);
	    var IX = tanφ/(720*ρ*ν5)*(61+90*tan2φ+45*tan4φ);
	    var X = secφ/ν;
	    var XI = secφ/(6*ν3)*(ν/ρ+2*tan2φ);
	    var XII = secφ/(120*ν5)*(5+28*tan2φ+24*tan4φ);
	    var XIIA = secφ/(5040*ν7)*(61+662*tan2φ+1320*tan4φ+720*tan6φ);

	    var dE = (E-E0), dE2 = dE*dE, dE3 = dE2*dE, dE4 = dE2*dE2, dE5 = dE3*dE2, dE6 = dE4*dE2, dE7 = dE5*dE2;
	    φ = φ - VII*dE2 + VIII*dE4 - IX*dE6;
	    var λ = λ0 + X*dE - XI*dE3 + XII*dE5 - XIIA*dE7;

	    var point =  new LatLon(φ.toDegrees(), λ.toDegrees(), LatLon.datum.OSGB36);
	    if (datum != LatLon.datum.OSGB36) point = point.convertDatum(datum);

	    return point;
	};


	/**
	 * Parses grid reference to OsGridRef object.
	 *
	 * Accepts standard grid references (eg 'SU 387 148'), with or without whitespace separators, from
	 * two-digit references up to 10-digit references (1m × 1m square), or fully numeric comma-separated
	 * references in metres (eg '438700,114800').
	 *
	 * @param   {string}    gridref - Standard format OS grid reference.
	 * @returns {OsGridRef} Numeric version of grid reference in metres from false origin (SW corner of
	 *   supplied grid square).
	 * @throws Error on Invalid grid reference.
	 *
	 * @example
	 *   var grid = OsGridRef.parse('TG 51409 13177'); // grid: { easting: 651409, northing: 313177 }
	 */
	OsGridRef.parse = function(gridref) {
	    gridref = String(gridref).trim();

	    // check for fully numeric comma-separated gridref format
	    var match = gridref.match(/^(\d+),\s*(\d+)$/);
	    if (match) return new OsGridRef(match[1], match[2]);

	    // validate format
	    match = gridref.match(/^[A-Z]{2}\s*[0-9]+\s*[0-9]+$/i);
	    if (!match) throw new Error('Invalid grid reference');

	    // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
	    var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	    var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
	    // shuffle down letters after 'I' since 'I' is not used in grid:
	    if (l1 > 7) l1--;
	    if (l2 > 7) l2--;

	    // convert grid letters into 100km-square indexes from false origin (grid square SV):
	    var e100km = ((l1-2)%5)*5 + (l2%5);
	    var n100km = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

	    // skip grid letters to get numeric (easting/northing) part of ref
	    var en = gridref.slice(2).trim().split(/\s+/);
	    // if e/n not whitespace separated, split half way
	    if (en.length == 1) en = [ en[0].slice(0, en[0].length/2), en[0].slice(en[0].length/2) ];

	    // validation
	    if (e100km<0 || e100km>6 || n100km<0 || n100km>12) throw new Error('Invalid grid reference');
	    if (en.length != 2) throw new Error('Invalid grid reference');
	    if (en[0].length != en[1].length) throw new Error('Invalid grid reference');

	    // standardise to 10-digit refs (metres)
	    en[0] = (en[0]+'00000').slice(0, 5);
	    en[1] = (en[1]+'00000').slice(0, 5);

	    var e = e100km + en[0];
	    var n = n100km + en[1];

	    return new OsGridRef(e, n);
	};


	/**
	 * Converts ‘this’ numeric grid reference to standard OS grid reference.
	 *
	 * @param   {number} [digits=10] - Precision of returned grid reference (10 digits = metres).
	 * @returns {string} This grid reference in standard format.
	 */
	OsGridRef.prototype.toString = function(digits) {
	    digits = (digits === undefined) ? 10 : Number(digits);
	    if (isNaN(digits)) throw new Error('Invalid precision');

	    var e = this.easting;
	    var n = this.northing;
	    if (isNaN(e) || isNaN(n)) throw new Error('Invalid grid reference');

	    // use digits = 0 to return numeric format (in metres)
	    if (digits == 0) return e.pad(6)+','+n.pad(6);

	    // get the 100km-grid indices
	    var e100k = Math.floor(e/100000), n100k = Math.floor(n/100000);

	    if (e100k<0 || e100k>6 || n100k<0 || n100k>12) return '';

	    // translate those into numeric equivalents of the grid letters
	    var l1 = (19-n100k) - (19-n100k)%5 + Math.floor((e100k+10)/5);
	    var l2 = (19-n100k)*5%25 + e100k%5;

	    // compensate for skipped 'I' and build grid letter-pairs
	    if (l1 > 7) l1++;
	    if (l2 > 7) l2++;
	    var letPair = String.fromCharCode(l1+'A'.charCodeAt(0), l2+'A'.charCodeAt(0));

	    // strip 100km-grid indices from easting & northing, and reduce precision
	    e = Math.floor((e%100000)/Math.pow(10, 5-digits/2));
	    n = Math.floor((n%100000)/Math.pow(10, 5-digits/2));

	    var gridRef = letPair + ' ' + e.pad(digits/2) + ' ' + n.pad(digits/2);

	    return gridRef;
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Polyfill String.trim for old browsers
	 *  (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
	if (String.prototype.trim === undefined) {
	    String.prototype.trim = function() {
	        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	    };
	}

	/** Extend Number object with method to pad with leading zeros to make it w chars wide
	 *  (q.v. stackoverflow.com/questions/2998784 */
	if (Number.prototype.pad === undefined) {
	    Number.prototype.pad = function(w) {
	        var n = this.toString();
	        while (n.length < w) n = '0' + n;
	        return n;
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = OsGridRef; // ≡ export default OsGridRef


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/* Geodesy representation conversion functions                        (c) Chris Veness 2002-2016  */
	/*                                                                                   MIT Licence  */
	/* www.movable-type.co.uk/scripts/latlong.html                                                    */
	/* www.movable-type.co.uk/scripts/geodesy/docs/module-dms.html                                    */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	'use strict';
	/* eslint no-irregular-whitespace: [2, { skipComments: true }] */


	/**
	 * Latitude/longitude points may be represented as decimal degrees, or subdivided into sexagesimal
	 * minutes and seconds.
	 *
	 * @module dms
	 */


	/**
	 * Functions for parsing and representing degrees / minutes / seconds.
	 * @class Dms
	 */
	var Dms = {};

	// note Unicode Degree = U+00B0. Prime = U+2032, Double prime = U+2033


	/**
	 * Parses string representing degrees/minutes/seconds into numeric degrees.
	 *
	 * This is very flexible on formats, allowing signed decimal degrees, or deg-min-sec optionally
	 * suffixed by compass direction (NSEW). A variety of separators are accepted (eg 3° 37′ 09″W).
	 * Seconds and minutes may be omitted.
	 *
	 * @param   {string|number} dmsStr - Degrees or deg/min/sec in variety of formats.
	 * @returns {number} Degrees as decimal number.
	 *
	 * @example
	 *     var lat = Dms.parseDMS('51° 28′ 40.12″ N');
	 *     var lon = Dms.parseDMS('000° 00′ 05.31″ W');
	 *     var p1 = new LatLon(lat, lon); // 51.4778°N, 000.0015°W
	 */
	Dms.parseDMS = function(dmsStr) {
	    // check for signed decimal degrees without NSEW, if so return it directly
	    if (typeof dmsStr == 'number' && isFinite(dmsStr)) return Number(dmsStr);

	    // strip off any sign or compass dir'n & split out separate d/m/s
	    var dms = String(dmsStr).trim().replace(/^-/, '').replace(/[NSEW]$/i, '').split(/[^0-9.,]+/);
	    if (dms[dms.length-1]=='') dms.splice(dms.length-1);  // from trailing symbol

	    if (dms == '') return NaN;

	    // and convert to decimal degrees...
	    var deg;
	    switch (dms.length) {
	        case 3:  // interpret 3-part result as d/m/s
	            deg = dms[0]/1 + dms[1]/60 + dms[2]/3600;
	            break;
	        case 2:  // interpret 2-part result as d/m
	            deg = dms[0]/1 + dms[1]/60;
	            break;
	        case 1:  // just d (possibly decimal) or non-separated dddmmss
	            deg = dms[0];
	            // check for fixed-width unseparated format eg 0033709W
	            //if (/[NS]/i.test(dmsStr)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
	            //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600;
	            break;
	        default:
	            return NaN;
	    }
	    if (/^-|[WS]$/i.test(dmsStr.trim())) deg = -deg; // take '-', west and south as -ve

	    return Number(deg);
	};


	/**
	 * Separator character to be used to separate degrees, minutes, seconds, and cardinal directions.
	 *
	 * Set to '\u202f' (narrow no-break space) for improved formatting.
	 *
	 * @example
	 *   var p = new LatLon(51.2, 0.33);  // 51°12′00.0″N, 000°19′48.0″E
	 *   Dms.separator = '\u202f';        // narrow no-break space
	 *   var pʹ = new LatLon(51.2, 0.33); // 51° 12′ 00.0″ N, 000° 19′ 48.0″ E
	 */
	Dms.separator = '';


	/**
	 * Converts decimal degrees to deg/min/sec format
	 *  - degree, prime, double-prime symbols are added, but sign is discarded, though no compass
	 *    direction is added.
	 *
	 * @private
	 * @param   {number} deg - Degrees to be formatted as specified.
	 * @param   {string} [format=dms] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use – default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Degrees formatted as deg/min/secs according to specified format.
	 */
	Dms.toDMS = function(deg, format, dp) {
	    if (isNaN(deg)) return null;  // give up here if we can't make a number from deg

	    // default values
	    if (format === undefined) format = 'dms';
	    if (dp === undefined) {
	        switch (format) {
	            case 'd':    case 'deg':         dp = 4; break;
	            case 'dm':   case 'deg+min':     dp = 2; break;
	            case 'dms':  case 'deg+min+sec': dp = 0; break;
	            default:    format = 'dms'; dp = 0;  // be forgiving on invalid format
	        }
	    }

	    deg = Math.abs(deg);  // (unsigned result ready for appending compass dir'n)

	    var dms, d, m, s;
	    switch (format) {
	        default: // invalid format spec!
	        case 'd': case 'deg':
	            d = deg.toFixed(dp);    // round degrees
	            if (d<100) d = '0' + d; // pad with leading zeros
	            if (d<10) d = '0' + d;
	            dms = d + '°';
	            break;
	        case 'dm': case 'deg+min':
	            var min = (deg*60).toFixed(dp); // convert degrees to minutes & round
	            d = Math.floor(min / 60);       // get component deg/min
	            m = (min % 60).toFixed(dp);     // pad with trailing zeros
	            if (d<100) d = '0' + d;         // pad with leading zeros
	            if (d<10) d = '0' + d;
	            if (m<10) m = '0' + m;
	            dms = d + '°'+Dms.separator + m + '′';
	            break;
	        case 'dms': case 'deg+min+sec':
	            var sec = (deg*3600).toFixed(dp); // convert degrees to seconds & round
	            d = Math.floor(sec / 3600);       // get component deg/min/sec
	            m = Math.floor(sec/60) % 60;
	            s = (sec % 60).toFixed(dp);       // pad with trailing zeros
	            if (d<100) d = '0' + d;           // pad with leading zeros
	            if (d<10) d = '0' + d;
	            if (m<10) m = '0' + m;
	            if (s<10) s = '0' + s;
	            dms = d + '°'+Dms.separator + m + '′'+Dms.separator + s + '″';
	            break;
	    }

	    return dms;
	};


	/**
	 * Converts numeric degrees to deg/min/sec latitude (2-digit degrees, suffixed with N/S).
	 *
	 * @param   {number} deg - Degrees to be formatted as specified.
	 * @param   {string} [format=dms] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use – default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Degrees formatted as deg/min/secs according to specified format.
	 */
	Dms.toLat = function(deg, format, dp) {
	    var lat = Dms.toDMS(deg, format, dp);
	    return lat===null ? '–' : lat.slice(1)+Dms.separator + (deg<0 ? 'S' : 'N');  // knock off initial '0' for lat!
	};


	/**
	 * Convert numeric degrees to deg/min/sec longitude (3-digit degrees, suffixed with E/W)
	 *
	 * @param   {number} deg - Degrees to be formatted as specified.
	 * @param   {string} [format=dms] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use – default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Degrees formatted as deg/min/secs according to specified format.
	 */
	Dms.toLon = function(deg, format, dp) {
	    var lon = Dms.toDMS(deg, format, dp);
	    return lon===null ? '–' : lon+Dms.separator + (deg<0 ? 'W' : 'E');
	};


	/**
	 * Converts numeric degrees to deg/min/sec as a bearing (0°..360°)
	 *
	 * @param   {number} deg - Degrees to be formatted as specified.
	 * @param   {string} [format=dms] - Return value as 'd', 'dm', 'dms' for deg, deg+min, deg+min+sec.
	 * @param   {number} [dp=0|2|4] - Number of decimal places to use – default 0 for dms, 2 for dm, 4 for d.
	 * @returns {string} Degrees formatted as deg/min/secs according to specified format.
	 */
	Dms.toBrng = function(deg, format, dp) {
	    deg = (Number(deg)+360) % 360;  // normalise -ve values to 180°..360°
	    var brng =  Dms.toDMS(deg, format, dp);
	    return brng===null ? '–' : brng.replace('360', '0');  // just in case rounding took us up to 360°!
	};


	/**
	 * Returns compass point (to given precision) for supplied bearing.
	 *
	 * @param   {number} bearing - Bearing in degrees from north.
	 * @param   {number} [precision=3] - Precision (1:cardinal / 2:intercardinal / 3:secondary-intercardinal).
	 * @returns {string} Compass point for supplied bearing.
	 *
	 * @example
	 *   var point = Dms.compassPoint(24);    // point = 'NNE'
	 *   var point = Dms.compassPoint(24, 1); // point = 'N'
	 */
	Dms.compassPoint = function(bearing, precision) {
	    if (precision === undefined) precision = 3;
	    // note precision = max length of compass point; it could be extended to 4 for quarter-winds
	    // (eg NEbN), but I think they are little used

	    bearing = ((bearing%360)+360)%360; // normalise to 0..360

	    var point;

	    switch (precision) {
	        case 1: // 4 compass points
	            switch (Math.round(bearing*4/360)%4) {
	                case 0: point = 'N'; break;
	                case 1: point = 'E'; break;
	                case 2: point = 'S'; break;
	                case 3: point = 'W'; break;
	            }
	            break;
	        case 2: // 8 compass points
	            switch (Math.round(bearing*8/360)%8) {
	                case 0: point = 'N';  break;
	                case 1: point = 'NE'; break;
	                case 2: point = 'E';  break;
	                case 3: point = 'SE'; break;
	                case 4: point = 'S';  break;
	                case 5: point = 'SW'; break;
	                case 6: point = 'W';  break;
	                case 7: point = 'NW'; break;
	            }
	            break;
	        case 3: // 16 compass points
	            switch (Math.round(bearing*16/360)%16) {
	                case  0: point = 'N';   break;
	                case  1: point = 'NNE'; break;
	                case  2: point = 'NE';  break;
	                case  3: point = 'ENE'; break;
	                case  4: point = 'E';   break;
	                case  5: point = 'ESE'; break;
	                case  6: point = 'SE';  break;
	                case  7: point = 'SSE'; break;
	                case  8: point = 'S';   break;
	                case  9: point = 'SSW'; break;
	                case 10: point = 'SW';  break;
	                case 11: point = 'WSW'; break;
	                case 12: point = 'W';   break;
	                case 13: point = 'WNW'; break;
	                case 14: point = 'NW';  break;
	                case 15: point = 'NNW'; break;
	            }
	            break;
	        default:
	            throw new RangeError('Precision must be between 1 and 3');
	    }

	    return point;
	};


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Polyfill String.trim for old browsers
	 *  (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
	if (String.prototype.trim === undefined) {
	    String.prototype.trim = function() {
	        return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = Dms; // ≡ export default Dms


/***/ }
/******/ ])