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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"registerMachine\": () => (/* binding */ registerMachine)\n/* harmony export */ });\n// @ts-ignore\nAFRAME.registerComponent(\"a-machine\", {\n    schema: {\n        machine: { type: \"string\" }\n    },\n    init() {\n        if (!machineRegistry[this.data.machine]) {\n            throw new Error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`);\n        }\n        this.state = { el: this.el };\n        Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {\n            this.el.addEventListener(`aMachine:${event}`, (e) => {\n                listener(e, this.state, this.emit.bind(this));\n            });\n        });\n        this.el.addEventListener(\"click\", (event) => {\n            this.el.dispatchEvent(new CustomEvent(\"aMachine:interact\", { detail: event }));\n        });\n    },\n    emit(event, payload) {\n        // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver\n        // Emit events to the direct children, direct parent, and direct siblings\n        const directChildrenSelector = \"[a-machine]:not([a-machine] [a-machine])\";\n        const connected = [\n            this.el.parentElement,\n            ...Array.from(this.el.querySelectorAll(directChildrenSelector)),\n            ...Array.from(this.el.parentElement.querySelectorAll(directChildrenSelector))\n        ];\n        connected.forEach(el => {\n            el.dispatchEvent(new CustomEvent(`aMachine:${event}`, { detail: payload }));\n        });\n    }\n});\nconst machineRegistry = {};\nfunction registerMachine(machine) {\n    if (machineRegistry[machine.name]) {\n        throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`);\n    }\n    machineRegistry[machine.name] = machine;\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/a-machine.ts?");

/***/ }),

/***/ "./src/scripts/default-machines.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-machines.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"buttonMachine\": () => (/* binding */ buttonMachine),\n/* harmony export */   \"helloWorld\": () => (/* binding */ helloWorld),\n/* harmony export */   \"textInputMachine\": () => (/* binding */ textInputMachine),\n/* harmony export */   \"triggerTest\": () => (/* binding */ triggerTest)\n/* harmony export */ });\nconst buttonMachine = {\n    name: \"button\",\n    listeners: {\n        interact: (event, state, emit) => {\n            console.log(\"You interacted with\", state.el);\n            emit(\"trigger\");\n        }\n    }\n};\nconst triggerTest = {\n    name: \"triggerTest\",\n    listeners: {\n        trigger: (event, state) => {\n            if (!state.count) {\n                state.count = 0;\n            }\n            state.count++;\n            console.log(`Machine has been triggered ${state.count} times`);\n        }\n    }\n};\nconst textInputMachine = {\n    name: \"textInput\",\n    listeners: {\n        newText: (event, state, emit) => {\n            state.text = event.text;\n            emit(\"textChanged\", state);\n        },\n        interact: (event, state, emit) => {\n            window.postMessage({ type: \"promptForText\", el: state.el });\n        }\n    }\n};\nconst helloWorld = {\n    name: \"helloWorld\",\n    listeners: {\n        textChanged: (event) => {\n            alert(`Hello ${event.text}`);\n        }\n    }\n};\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-machines.ts?");

/***/ }),

/***/ "./src/scripts/main.ts":
/*!*****************************!*\
  !*** ./src/scripts/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _default_machines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default-machines */ \"./src/scripts/default-machines.ts\");\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n\n\nObject.values(_default_machines__WEBPACK_IMPORTED_MODULE_0__).forEach(_a_machine__WEBPACK_IMPORTED_MODULE_1__.registerMachine);\nconst buttonMachine = document.createElement(\"a-box\");\nbuttonMachine.object3D.position.set(0, 1.5, -3);\nbuttonMachine.setAttribute(\"a-machine\", { machine: \"button\" });\nbuttonMachine.setAttribute(\"color\", \"cyan\");\nsetTimeout(() => {\n    console.log(\"appending...\");\n    document.body.querySelector(\"a-scene\").appendChild(buttonMachine);\n}, 2000);\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/main.ts?");

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