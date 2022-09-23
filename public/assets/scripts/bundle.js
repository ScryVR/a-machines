/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://aframe-machines/./src/styles/main.scss?");

/***/ }),

/***/ "./src/scripts/a-machine.ts":
/*!**********************************!*\
  !*** ./src/scripts/a-machine.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"registerBuiltin\": () => (/* binding */ registerBuiltin),\n/* harmony export */   \"registerMachine\": () => (/* binding */ registerMachine)\n/* harmony export */ });\n// @ts-ignore\nAFRAME.registerComponent(\"a-machine\", {\n    schema: {\n        machine: { type: \"string\" },\n    },\n    init() {\n        if (!machineRegistry[this.data.machine]) {\n            throw new Error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`);\n        }\n        if (!this.el.id) {\n            this.el.id = id();\n        }\n        this.state = { id: this.el.id };\n        Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {\n            const [eventName, scope = \"siblings\"] = event.split(\":\");\n            this.el.addEventListener(`aMachine:${eventName}`, (e) => {\n                listener(e, this.state, this.emitFactory(this.data.machine));\n            });\n        });\n        const interactListener = machineRegistry[this.data.machine].listeners.interact;\n        this.el.addEventListener(\"click\", (event) => {\n            if (interactListener) {\n                interactListener(event, this.state, this.emitFactory(this.data.machine));\n            }\n            event.stopPropagation();\n        });\n    },\n    emitFactory(machine) {\n        return (event, payload) => {\n            var _a;\n            if ((_a = machineRegistry[machine].canEmit) === null || _a === void 0 ? void 0 : _a.includes(event)) {\n                this.emit.call(this, event, payload);\n            }\n            else {\n                console.error(`a-machine \"${this.data.machine}\" tried to emit event \"${event}\", but did not include it in its \"canEmit\" array`);\n            }\n        };\n    },\n    emit(event, payload) {\n        // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver\n        // Emit events to the direct children, direct parent, or direct siblings\n        const [eventName, scope = \"siblings\"] = event.split(\":\");\n        let connected = [this.el.parentElement];\n        if (scope === \"siblings\") {\n            connected = Array.from(this.el.parentElement.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"children\") {\n            connected = Array.from(this.el.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"builtins\") {\n            if (builtinRegistry[eventName]) {\n                // NOTE: Calls to built-in handlers have a different signature. Might change this later.\n                builtinRegistry[eventName]({ detail: payload });\n            }\n            else {\n                console.warn(`Received a call to a unregistered built-in event: ${eventName}`);\n            }\n        }\n        connected.forEach((el) => {\n            el.dispatchEvent(new CustomEvent(`aMachine:${eventName}`, { detail: payload }));\n        });\n    },\n});\nconst machineRegistry = {};\nfunction registerMachine(machine) {\n    if (machineRegistry[machine.name]) {\n        throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`);\n    }\n    machineRegistry[machine.name] = machine;\n}\nconst builtinRegistry = {};\nfunction registerBuiltin(event, listener) {\n    if (builtinRegistry[event]) {\n        throw new Error(`a-machine tried to register ${event}, but a built-in with this name is already registered`);\n    }\n    builtinRegistry[event] = listener;\n}\nfunction id() {\n    return \"machine-\" + crypto.randomUUID();\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/a-machine.ts?");

/***/ }),

/***/ "./src/scripts/default-builtins.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-builtins.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"promptForText\": () => (/* binding */ promptForText)\n/* harmony export */ });\nfunction promptForText(event) {\n    var _a;\n    const scene = document.querySelector(\"a-scene\");\n    if (!((_a = scene.getAttribute(\"webxr\")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {\n        console.warn(\"a-machine could not prompt for text - no webxr.overlayElement defined on a-scene\");\n        return;\n    }\n    const textInputModal = document.createElement(\"div\");\n    textInputModal.innerHTML = \"<textarea></textarea><button>Submit</button>\";\n    textInputModal.querySelector(\"button\").addEventListener(\"click\", () => {\n        document.getElementById(event.detail.id).dispatchEvent(new CustomEvent(\"aMachine:_textChanged\", {\n            detail: {\n                text: textInputModal.querySelector(\"textarea\").value\n            }\n        }));\n        textInputModal.remove();\n    });\n    scene.getAttribute(\"webxr\").overlayElement.appendChild(textInputModal);\n    textInputModal.querySelector(\"textarea\").focus();\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-builtins.ts?");

/***/ }),

/***/ "./src/scripts/default-machines.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-machines.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"buttonMachine\": () => (/* binding */ buttonMachine),\n/* harmony export */   \"helloWorld\": () => (/* binding */ helloWorld),\n/* harmony export */   \"textInputMachine\": () => (/* binding */ textInputMachine),\n/* harmony export */   \"triggerTest\": () => (/* binding */ triggerTest)\n/* harmony export */ });\nconst buttonMachine = {\n    name: \"button\",\n    listeners: {\n        interact: (event, state, emit) => {\n            emit(\"trigger:siblings\");\n        }\n    },\n    canEmit: [\"trigger:siblings\"]\n};\nconst triggerTest = {\n    name: \"triggerTest\",\n    listeners: {\n        trigger: (event, state) => {\n            if (!state.count) {\n                state.count = 0;\n            }\n            state.count++;\n            console.log(`Machine has been triggered ${state.count} times`);\n        }\n    }\n};\nconst textInputMachine = {\n    name: \"textInput\",\n    listeners: {\n        _textChanged: (event, state, emit) => {\n            state.text = event.detail.text;\n            emit(\"textChanged\", state);\n        },\n        interact: (event, state, emit) => {\n            emit(\"promptForText:builtins\", { id: state.id });\n        }\n    },\n    canEmit: [\n        \"textChanged\",\n        \"promptForText:builtins\"\n    ]\n};\nconst helloWorld = {\n    name: \"helloWorld\",\n    listeners: {\n        textChanged: (event) => {\n            alert(`Hello ${event.detail.text}`);\n        }\n    }\n};\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-machines.ts?");

/***/ }),

/***/ "./src/scripts/main.ts":
/*!*****************************!*\
  !*** ./src/scripts/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _default_machines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default-machines */ \"./src/scripts/default-machines.ts\");\n/* harmony import */ var _default_builtins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default-builtins */ \"./src/scripts/default-builtins.ts\");\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n\n\n\nObject.values(_default_machines__WEBPACK_IMPORTED_MODULE_0__).forEach(_a_machine__WEBPACK_IMPORTED_MODULE_2__.registerMachine);\nObject.entries(_default_builtins__WEBPACK_IMPORTED_MODULE_1__).forEach(([event, listener]) => (0,_a_machine__WEBPACK_IMPORTED_MODULE_2__.registerBuiltin)(event, listener));\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./src/scripts/main.ts");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/styles/main.scss");
/******/ 	
/******/ })()
;