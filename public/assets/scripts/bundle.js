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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"builtinRegistry\": () => (/* binding */ builtinRegistry),\n/* harmony export */   \"machineRegistry\": () => (/* binding */ machineRegistry),\n/* harmony export */   \"registerBuiltin\": () => (/* binding */ registerBuiltin),\n/* harmony export */   \"registerMachine\": () => (/* binding */ registerMachine)\n/* harmony export */ });\n// @ts-ignore\nAFRAME.registerComponent(\"a-machine\", {\n    schema: {\n        machine: { type: \"string\" },\n    },\n    init() {\n        if (!machineRegistry[this.data.machine]) {\n            console.error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`);\n            return;\n        }\n        if (!this.el.id) {\n            this.el.id = id();\n        }\n        this.state = { id: this.el.id };\n        Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {\n            const [eventName, scope = \"siblings\"] = event.split(\":\");\n            this.el.addEventListener(`aMachine:${eventName}`, (e) => {\n                listener(e, this.state, this.emitFactory(this.data.machine));\n            });\n        });\n        const interactListener = machineRegistry[this.data.machine].listeners.interact;\n        this.el.addEventListener(\"click\", (event) => {\n            if (interactListener) {\n                interactListener(event, this.state, this.emitFactory(this.data.machine));\n            }\n            event.stopPropagation();\n        });\n    },\n    emitFactory(machine) {\n        return (event, payload) => {\n            var _a;\n            if ((_a = machineRegistry[machine].canEmit) === null || _a === void 0 ? void 0 : _a.includes(event)) {\n                this.emit.call(this, event, payload);\n            }\n            else {\n                console.error(`a-machine \"${this.data.machine}\" tried to emit event \"${event}\", but did not include it in its \"canEmit\" array`);\n            }\n        };\n    },\n    emit(event, payload) {\n        // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver\n        // Emit events to the direct children, direct parent, or direct siblings\n        const [eventName, scope = \"siblings\"] = event.split(\":\");\n        let connected = [this.el.parentElement];\n        if (scope === \"siblings\") {\n            connected = Array.from(this.el.parentElement.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"children\") {\n            connected = Array.from(this.el.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"builtins\") {\n            if (builtinRegistry[eventName]) {\n                // NOTE: Calls to built-in handlers have a different signature. Might change this later.\n                builtinRegistry[eventName].listener({ detail: payload });\n            }\n            else {\n                console.warn(`Received a call to a unregistered built-in event: ${eventName}`);\n            }\n        }\n        connected.forEach((el) => {\n            el.dispatchEvent(new CustomEvent(`aMachine:${eventName}`, { detail: payload }));\n        });\n    },\n});\nconst machineRegistry = {};\nfunction registerMachine(machine) {\n    if (machineRegistry[machine.name]) {\n        throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`);\n    }\n    machineRegistry[machine.name] = machine;\n}\nconst builtinRegistry = {};\nfunction registerBuiltin(event, builtin) {\n    if (builtinRegistry[event]) {\n        throw new Error(`a-machine tried to register ${event}, but a built-in with this name is already registered`);\n    }\n    builtinRegistry[event] = builtin;\n}\nfunction id() {\n    return \"machine-\" + crypto.randomUUID();\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/a-machine.ts?");

/***/ }),

/***/ "./src/scripts/default-builtins.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-builtins.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"promptForText\": () => (/* binding */ promptForText)\n/* harmony export */ });\nconst promptForText = {\n    name: \"promptForText\",\n    listener: promptForTextListener,\n    canEmit: [\"_textChanged\"]\n};\nfunction promptForTextListener(event) {\n    var _a;\n    const scene = document.querySelector(\"a-scene\");\n    if (!((_a = scene.getAttribute(\"webxr\")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {\n        console.warn(\"a-machine could not prompt for text - no webxr.overlayElement defined on a-scene\");\n        return;\n    }\n    const textInputModal = document.createElement(\"div\");\n    textInputModal.innerHTML = \"<textarea></textarea><button>Submit</button>\";\n    textInputModal.querySelector(\"button\").addEventListener(\"click\", () => {\n        document.getElementById(event.detail.id).dispatchEvent(new CustomEvent(\"aMachine:_textChanged\", {\n            detail: {\n                text: textInputModal.querySelector(\"textarea\").value\n            }\n        }));\n        textInputModal.remove();\n    });\n    scene.getAttribute(\"webxr\").overlayElement.appendChild(textInputModal);\n    textInputModal.querySelector(\"textarea\").focus();\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-builtins.ts?");

/***/ }),

/***/ "./src/scripts/default-machines.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-machines.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"buttonMachine\": () => (/* binding */ buttonMachine),\n/* harmony export */   \"movingMachine\": () => (/* binding */ movingMachine),\n/* harmony export */   \"textInputMachine\": () => (/* binding */ textInputMachine),\n/* harmony export */   \"textRenderer\": () => (/* binding */ textRenderer),\n/* harmony export */   \"triggerTest\": () => (/* binding */ triggerTest)\n/* harmony export */ });\nconst buttonMachine = {\n    name: \"button\",\n    listeners: {\n        interact: (event, state, emit) => {\n            emit(\"trigger:siblings\");\n        }\n    },\n    metadata: {\n        interact: {\n            description: \"Emit 'trigger' event to siblings\"\n        }\n    },\n    canEmit: [\"trigger:siblings\"]\n};\nconst triggerTest = {\n    name: \"triggerTest\",\n    listeners: {\n        trigger: (event, state) => {\n            if (!state.count) {\n                state.count = 0;\n            }\n            state.count++;\n            console.log(`Machine has been triggered ${state.count} times`);\n        }\n    },\n    metadata: {\n        trigger: {\n            description: \"Update internal trigger count and log event\"\n        }\n    }\n};\nconst textInputMachine = {\n    name: \"textInput\",\n    listeners: {\n        _textChanged: (event, state, emit) => {\n            state.text = event.detail.text;\n            emit(\"textChanged\", state);\n        },\n        interact: (event, state, emit) => {\n            emit(\"promptForText:builtins\", { id: state.id });\n        }\n    },\n    metadata: {\n        _textChanged: {\n            description: \"receive internal callback from DOM and progagate to siblings\"\n        },\n        interact: {\n            description: \"Show input field for text entry\"\n        }\n    },\n    canEmit: [\n        \"promptForText:builtins\",\n        \"textChanged\"\n    ]\n};\nconst textRenderer = {\n    name: \"textRenderer\",\n    listeners: {\n        textChanged: (event, state) => {\n            const entity = document.getElementById(state.id);\n            entity.setAttribute(\"text\", { value: event.detail.text, side: \"double\" });\n        }\n    },\n    metadata: {\n        textChanged: {\n            description: \"Show text in VR environment\"\n        }\n    }\n};\nconst movingMachine = {\n    name: \"movingMachine\",\n    listeners: {\n        trigger: (event, state, emit) => {\n            // NOTE: If I want to run this in a vertex worker, this is no good. Machines should instead invoke a builtin by emitting an event.\n            // This is okay just for development\n            const entity = document.getElementById(state.id);\n            entity.object3D.position.y += 0.2;\n        }\n    },\n    metadata: {\n        trigger: {\n            description: \"Directly modify object3D to move entity\"\n        }\n    }\n};\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-machines.ts?");

/***/ }),

/***/ "./src/scripts/graphMachines.ts":
/*!**************************************!*\
  !*** ./src/scripts/graphMachines.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"graphMachines\": () => (/* binding */ graphMachines)\n/* harmony export */ });\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n\nfunction graphMachines(machines) {\n    let diagram = \"sequenceDiagram\\n\";\n    diagram += getParticipants(machines);\n    diagram += getSequence(machines);\n    return diagram;\n}\nfunction getParticipants(machines) {\n    let groupedParticipants = machines.reduce((acc, machine) => {\n        var _a;\n        acc.machines.add(machine.name);\n        if (Object.keys(machine.listeners).includes(\"interact\")) {\n            acc.system.add(\"user\");\n        }\n        (_a = machine.canEmit) === null || _a === void 0 ? void 0 : _a.forEach((event) => {\n            const [eventName, scope = \"siblings\"] = event.split(\":\");\n            if (scope === \"builtins\") {\n                acc.builtins.add(eventName);\n            }\n        });\n        return acc;\n    }, { system: new Set(), builtins: new Set(), machines: new Set() });\n    let participantString = \"\";\n    const orderedParticipants = [\"system\", \"builtins\", \"machines\"].reduce((acc, key) => {\n        acc = acc.concat(Array.from(groupedParticipants[key]));\n        return acc;\n    }, []);\n    orderedParticipants.forEach((p) => {\n        participantString += `\\tparticipant ${p}\\n`;\n    });\n    return participantString;\n}\nfunction getSequence(machines) {\n    let sequenceString = \"\";\n    let allListeners = {};\n    Object.keys(_a_machine__WEBPACK_IMPORTED_MODULE_0__.builtinRegistry).forEach(event => {\n        allListeners[`${event}:builtins`] = new Set();\n        allListeners[`${event}:builtins`].add(`${event}:builtins`);\n    });\n    allListeners = machines.reduce((acc, machine) => {\n        Object.keys(machine.listeners).forEach(event => {\n            if (!acc[event]) {\n                acc[event] = new Set();\n            }\n            acc[event].add(machine.name);\n        });\n        return acc;\n    }, allListeners);\n    console.log({ allListeners });\n    machines.forEach(machine => {\n        if (machine.listeners.interact) {\n            sequenceString += `\\n\\tuser->>${machine.name}: on user interaction`;\n            sequenceString += recurseSequencePath(machine, \"interact\", allListeners, \"\");\n        }\n    });\n    return sequenceString;\n}\nfunction recurseSequencePath(machine, event, allListeners, sequenceString = \"\") {\n    var _a;\n    // Add description for internal handling\n    let description = `${machine.name} handler for ${event}`;\n    try {\n        description = machine.metadata[event].description;\n    }\n    catch (_) { }\n    sequenceString += `\\n\\t${machine.name}->>${machine.name}: ${description}`;\n    // Recursively add paths based on events that the machine can emit\n    (_a = machine.canEmit) === null || _a === void 0 ? void 0 : _a.forEach(event => {\n        var _a;\n        let scopedEvent = event;\n        const [eventName, scope = \"siblings\"] = event.split(\":\");\n        if (scope !== \"builtins\") {\n            scopedEvent = eventName;\n        }\n        (_a = allListeners[scopedEvent]) === null || _a === void 0 ? void 0 : _a.forEach((listeningMachine) => {\n            const machineOrBuiltin = _a_machine__WEBPACK_IMPORTED_MODULE_0__.machineRegistry[listeningMachine] || _a_machine__WEBPACK_IMPORTED_MODULE_0__.builtinRegistry[listeningMachine.split(\":\")[0]];\n            const duplicateLine = sequenceString.split(\"\\n\").find(str => str.startsWith(`\\t${machine.name}->>${machineOrBuiltin.name}`));\n            if (!duplicateLine) {\n                sequenceString += `\\n\\t${machine.name}->>${listeningMachine.split(\":\")[0]}: on \"${scopedEvent}\" event`;\n                sequenceString = recurseSequencePath(machineOrBuiltin, scopedEvent, allListeners, sequenceString);\n            }\n            else {\n                console.log(\"Skipping adding redundant line\", { machine, machineOrBuiltin, duplicateLine });\n            }\n        });\n    });\n    return sequenceString;\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/graphMachines.ts?");

/***/ }),

/***/ "./src/scripts/main.ts":
/*!*****************************!*\
  !*** ./src/scripts/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _default_machines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default-machines */ \"./src/scripts/default-machines.ts\");\n/* harmony import */ var _default_builtins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default-builtins */ \"./src/scripts/default-builtins.ts\");\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n/* harmony import */ var _graphMachines__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graphMachines */ \"./src/scripts/graphMachines.ts\");\n\n\n\n\nObject.values(_default_machines__WEBPACK_IMPORTED_MODULE_0__).forEach(_a_machine__WEBPACK_IMPORTED_MODULE_2__.registerMachine);\nObject.entries(_default_builtins__WEBPACK_IMPORTED_MODULE_1__).forEach(([event, builtinMachine]) => (0,_a_machine__WEBPACK_IMPORTED_MODULE_2__.registerBuiltin)(event, builtinMachine));\nconsole.log((0,_graphMachines__WEBPACK_IMPORTED_MODULE_3__.graphMachines)(Object.values(_a_machine__WEBPACK_IMPORTED_MODULE_2__.machineRegistry)));\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/main.ts?");

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