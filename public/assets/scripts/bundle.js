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

/***/ "./node_modules/mafiu/dist/generator.js":
/*!**********************************************!*\
  !*** ./node_modules/mafiu/dist/generator.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"registerMafiuComponent\": () => (/* binding */ registerMafiuComponent)\n/* harmony export */ });\n/* harmony import */ var _getStateObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getStateObject.js */ \"./node_modules/mafiu/dist/getStateObject.js\");\n/* harmony import */ var _getParsedTemplate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getParsedTemplate.js */ \"./node_modules/mafiu/dist/getParsedTemplate.js\");\nfunction registerMafiuComponent({name:t,template:e,data:i={},hooks:s={},handlers:a={}}){getImplicitVariables(e).forEach(t=>{i[t]=null!=(t=i[t])?t:\"\"}),i._stateVars=Object.keys(i),e=(0,_getParsedTemplate_js__WEBPACK_IMPORTED_MODULE_1__.getParsedTemplate)(e,i);var r=class extends HTMLElement{constructor(){super()}static get observedAttributes(){return i._stateVars.map(t=>t.toLowerCase())}connectedCallback(){this.innerHTML=e,this.addListeners(),this.dependencyTree=this.parseDependencies(),Object.assign(s,this.getRenderHooks({data:i,hooks:s})),this.state=(0,_getStateObject_js__WEBPACK_IMPORTED_MODULE_0__.getStateObject)(this,{data:i,hooks:s}),this.handlers=a,this.state._stateVars.forEach(t=>{this.hasAttribute(t)&&this.state&&(this.state[t]=this.getAttribute(t))})}attributeChangedCallback(e,t,s){var a;this.state&&(a=i._stateVars.find(t=>t.toLowerCase()===e),this.state[a]=s)}parseDependencies(){const r={};return this.querySelectorAll(\"[has-mdeps]\").forEach(a=>{const t=a.getAttributeNames().filter(t=>t.startsWith(\"mdep\"));t.forEach(t=>{let[,e,s]=t.split(\"-\");(s=i._stateVars.find(t=>t.toLowerCase()===s))&&(r[s]||(r[s]=[]),r[s].push({el:a,attribute:e,innerText:!e}))})}),r}getRenderHooks({data:t,hooks:s}){return Object.keys(t).reduce((t,e)=>(t[e]=s[e]||[],t[e].push(s=>{var t;this.dependencyTree&&null!=(t=this.dependencyTree[e])&&t.forEach(({el:t,attribute:e})=>{e?t.setAttribute(e,s):t.innerText=s})}),t),{})}addListeners(){this.querySelectorAll(\"[mbind]\").forEach(t=>{const[e,s]=t.getAttribute(\"mbind\").split(\":\");console.log(\"Going to add a listener\",e,s),t.addEventListener(s,t=>{this.state[e]=t.detail||t.target.value})}),this.querySelectorAll(\"[mhandle]\").forEach(t=>{const[e,s]=t.getAttribute(\"mhandle\").split(\":\");t.addEventListener(s,t=>{this.handlers[e].call(this,t),t.stopImmediatePropagation()})})}};window.customElements.define(t,r)}function getImplicitVariables(t){const e=[];return null!=(t=t.match(/{{([^}}]*)}}/gm))&&t.forEach(t=>{t=t.replace(\"{{\",\"\").replace(\"}}\",\"\");e.push(t)}),e}\n\n//# sourceURL=webpack://aframe-machines/./node_modules/mafiu/dist/generator.js?");

/***/ }),

/***/ "./node_modules/mafiu/dist/getParsedTemplate.js":
/*!******************************************************!*\
  !*** ./node_modules/mafiu/dist/getParsedTemplate.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getParsedTemplate\": () => (/* binding */ getParsedTemplate)\n/* harmony export */ });\nfunction getParsedTemplate(e,r){var a;let c=e;null!=(a=e.match(/[a-zA-Z-]*=\"{{[^}}]*}}\"/gm))&&a.forEach(e=>{const[a,l]=e.split(\"=\");var p=l.replace('\"{{',\"\").replace('}}\"',\"\"),p=`has-mdeps mdep-${a}-${p} ${a}=\"${null!=(p=r[p])?p:\"\"}\"`;c=c.replace(e,p)});return null!=(a=e.match(/{{[^}}]*}}/gm))&&a.forEach(e=>{var a=e.replace(\"{{\",\"\").replace(\"}}\",\"\"),a=`<span has-mdeps mdep--${a}>${null!=(a=r[a])?a:\"\"}</span>`;c=c.replace(e,a)}),c}\n\n//# sourceURL=webpack://aframe-machines/./node_modules/mafiu/dist/getParsedTemplate.js?");

/***/ }),

/***/ "./node_modules/mafiu/dist/getStateObject.js":
/*!***************************************************!*\
  !*** ./node_modules/mafiu/dist/getStateObject.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getStateObject\": () => (/* binding */ getStateObject)\n/* harmony export */ });\nfunction getStateObject(a,t){const{data:e={},hooks:c={}}=t;return new Proxy(e,{get(t,e){return\"addHook\"===e?(t,e)=>{c[t]||(c[t]=[]),c[t].push(e)}:Reflect.get(t,e)},set(e,r,o){var t;return null!=(t=c[r])&&t.forEach(t=>t.call(a,o,e[r])),Reflect.set(e,r,o)}})}\n\n//# sourceURL=webpack://aframe-machines/./node_modules/mafiu/dist/getStateObject.js?");

/***/ }),

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"builtinRegistry\": () => (/* binding */ builtinRegistry),\n/* harmony export */   \"globalState\": () => (/* binding */ globalState),\n/* harmony export */   \"machineRegistry\": () => (/* binding */ machineRegistry),\n/* harmony export */   \"registerBuiltin\": () => (/* binding */ registerBuiltin),\n/* harmony export */   \"registerMachine\": () => (/* binding */ registerMachine)\n/* harmony export */ });\nconst globalState = {\n    buildMode: \"edit\",\n    selectedAction: \"interact\",\n    // Todo: replace with class instance\n    user: {\n        energy: 100,\n        resources: {\n            wood: { color: \"brown\", quantity: 100 },\n            stone: { color: \"gray\", quantity: 100 }\n        }\n    }\n};\n// @ts-ignore\nAFRAME.registerComponent(\"a-machine\", {\n    schema: {\n        machine: { type: \"string\" },\n    },\n    init() {\n        if (!machineRegistry[this.data.machine]) {\n            console.error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`);\n            return;\n        }\n        if (!this.el.id) {\n            this.el.id = id();\n        }\n        this.state = { id: this.el.id };\n        Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {\n            const [eventName, scope = \"siblings\"] = event.split(\":\");\n            this.el.addEventListener(`aMachine:${eventName}`, (e) => {\n                listener(e, this.state, this.emitFactory(this.data.machine), globalState);\n            });\n        });\n        this.el.addEventListener(\"click\", (event) => {\n            const listener = machineRegistry[this.data.machine].listeners[globalState.selectedAction];\n            if (listener) {\n                listener(event, this.state, this.emitFactory(this.data.machine), globalState);\n            }\n            event.stopPropagation();\n        });\n    },\n    emitFactory(machine) {\n        return (event, payload) => {\n            var _a;\n            if ((_a = machineRegistry[machine].canEmit) === null || _a === void 0 ? void 0 : _a.includes(event)) {\n                this.emit.call(this, event, payload);\n            }\n            else {\n                console.error(`a-machine \"${this.data.machine}\" tried to emit event \"${event}\", but did not include it in its \"canEmit\" array`);\n            }\n        };\n    },\n    emit(event, payload) {\n        // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver\n        // Emit events to the direct children, direct parent, or direct siblings\n        const [eventName, scope = \"siblings\"] = event.split(\":\");\n        let connected = [this.el.parentElement];\n        if (scope === \"siblings\") {\n            connected = Array.from(this.el.parentElement.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"children\") {\n            connected = Array.from(this.el.children).filter((el) => el.hasAttribute(\"a-machine\"));\n        }\n        else if (scope === \"builtins\") {\n            if (builtinRegistry[eventName]) {\n                // NOTE: Calls to built-in handlers have a different signature. Might change this later.\n                builtinRegistry[eventName].listener({ detail: payload });\n            }\n            else {\n                console.warn(`Received a call to a unregistered built-in event: ${eventName}`);\n            }\n        }\n        connected.forEach((el) => {\n            el.dispatchEvent(new CustomEvent(`aMachine:${eventName}`, { detail: payload }));\n        });\n    },\n});\nconst machineRegistry = {};\nfunction registerMachine(machine) {\n    if (machineRegistry[machine.name]) {\n        throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`);\n    }\n    machineRegistry[machine.name] = machine;\n}\nconst builtinRegistry = {};\nfunction registerBuiltin(event, builtin) {\n    if (builtinRegistry[event]) {\n        throw new Error(`a-machine tried to register ${event}, but a built-in with this name is already registered`);\n    }\n    builtinRegistry[event] = builtin;\n}\nfunction id() {\n    return \"machine-\" + crypto.randomUUID();\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/a-machine.ts?");

/***/ }),

/***/ "./src/scripts/components/a-machine--footer.ts":
/*!*****************************************************!*\
  !*** ./src/scripts/components/a-machine--footer.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mafiu_dist_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mafiu/dist/generator */ \"./node_modules/mafiu/dist/generator.js\");\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../a-machine */ \"./src/scripts/a-machine.ts\");\n// @ts-ignore\n\n\nconst name = \"a-machine--footer\";\nconst actions = [\"interact\", \"build\", \"multiselect\", \"set material\"];\nlet template = /*html*/ `<scrolling-selector style=\"width: 200px;\" options=\"${actions.join(\",\")}\" mhandle=\"onSelectAction:select\"></scrolling-selector>`;\n_a_machine__WEBPACK_IMPORTED_MODULE_1__.globalState.action = \"interact\";\n(0,mafiu_dist_generator__WEBPACK_IMPORTED_MODULE_0__.registerMafiuComponent)({\n    name,\n    template,\n    data: {\n        actionIndex: 0,\n        actions,\n    },\n    hooks: {\n        selectedAction: [(action) => {\n                _a_machine__WEBPACK_IMPORTED_MODULE_1__.globalState.selectedAction = action;\n            }]\n    },\n    handlers: {\n        onSelectAction(event) {\n            this.state.selectedAction = event.detail.selection;\n        }\n    }\n});\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/components/a-machine--footer.ts?");

/***/ }),

/***/ "./src/scripts/components/index.ts":
/*!*****************************************!*\
  !*** ./src/scripts/components/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _a_machine_footer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a-machine--footer */ \"./src/scripts/components/a-machine--footer.ts\");\n/* harmony import */ var _scrolling_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scrolling-selector */ \"./src/scripts/components/scrolling-selector.ts\");\n\n\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/components/index.ts?");

/***/ }),

/***/ "./src/scripts/components/scrolling-selector.ts":
/*!******************************************************!*\
  !*** ./src/scripts/components/scrolling-selector.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mafiu_dist_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mafiu/dist/generator */ \"./node_modules/mafiu/dist/generator.js\");\n/* harmony import */ var mafiu_dist_getParsedTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mafiu/dist/getParsedTemplate */ \"./node_modules/mafiu/dist/getParsedTemplate.js\");\n// @ts-ignore\n\n// @ts-ignore\n\nconst name = \"scrolling-selector\";\nfunction generateSelectOptions(options) {\n    return /*html*/ `\n  <div class=\"empty-spacer\"></div>\n  ${options.map(a => `<button class=\"${a === \"use\" ? \"selected-action\" : \"not-selected\"}\" data-option=\"${a}\">${a}</button>`).join(\"\")}\n  <div class=\"empty-spacer\"></div>\n  `;\n}\nconst template = /*html*/ `\n<style>\n  .scrolling-selector .selected-option {\n    color: cyan !important;\n  }\n  .scrolling-selector button {\n    height: 20px;\n    font-size: 16px;\n    flex-shrink: 0;\n    background: none;\n    outline: none;\n    border: none;\n    padding: 0;\n    margin: 0;\n    color: transparent;\n    transition: color 0.5s;\n  }\n  .scrolling-selector.active button {\n    color: rgba(0,0,0,0.5);\n  }\n  .scrolling-selector {\n    display: flex;\n    flex-direction: column;\n    flex-wrap: nowrap;\n    max-height: 60px;\n    overflow: auto;\n    pointer-events: auto;\n  }\n  .empty-spacer {\n    min-height: 20px;\n    width: 100%;\n  }\n</style>\n<div\n  class=\"scrolling-selector\"\n  mhandle=\"onScroll:scroll\"\n>\n</div>\n`;\n(0,mafiu_dist_generator__WEBPACK_IMPORTED_MODULE_0__.registerMafiuComponent)({\n    name,\n    template,\n    data: {\n        options: \"\"\n    },\n    hooks: {\n        selectedOption: [function (newSelection, oldSelection) {\n                if (newSelection !== oldSelection) {\n                    this.dispatchEvent(new CustomEvent(\"select\", { detail: { selection: newSelection } }));\n                }\n            }],\n        selectedBtn: [function (newVal, oldVal) {\n                oldVal === null || oldVal === void 0 ? void 0 : oldVal.classList.remove(\"selected-option\");\n                newVal === null || newVal === void 0 ? void 0 : newVal.classList.add(\"selected-option\");\n            }],\n        options: [function (options) {\n                this.querySelector(\".scrolling-selector\").innerHTML = (0,mafiu_dist_getParsedTemplate__WEBPACK_IMPORTED_MODULE_1__.getParsedTemplate)(generateSelectOptions(options.split(\",\")));\n                this.state.selectedBtn = this.querySelector(\"button\");\n            }]\n    },\n    handlers: {\n        onScroll(event) {\n            // Update selected action\n            const buttons = Array.from(event.target.querySelectorAll(\"button\"));\n            const buttonIndex = Math.round(event.target.scrollTop / 20);\n            this.state.selectedBtn = buttons[buttonIndex];\n            this.state.selectedOption = this.state.selectedBtn.getAttribute(\"data-option\");\n            // UI stuff\n            event.target.classList.add(\"active\");\n            clearTimeout(this.state.setInactiveTimeout);\n            this.state.setInactiveTimeout = setTimeout(() => {\n                event.target.classList.remove(\"active\");\n            }, 300);\n        }\n    }\n});\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/components/scrolling-selector.ts?");

/***/ }),

/***/ "./src/scripts/default-builtins.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-builtins.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"activateTouchListener\": () => (/* binding */ activateTouchListener),\n/* harmony export */   \"promptForText\": () => (/* binding */ promptForText)\n/* harmony export */ });\nconst promptForText = {\n    name: \"promptForText\",\n    listener: promptForTextListener,\n    metadata: {\n        \"promptForText:builtins\": {\n            description: \"Show text input modal with submit button\"\n        }\n    },\n    canEmit: [\"_textChanged\"]\n};\nfunction promptForTextListener(event) {\n    var _a;\n    const scene = document.querySelector(\"a-scene\");\n    if (!((_a = scene.getAttribute(\"webxr\")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {\n        console.warn(\"a-machine could not prompt for text - no webxr.overlayElement defined on a-scene\");\n        return;\n    }\n    const textInputModal = document.createElement(\"div\");\n    textInputModal.innerHTML = \"<textarea></textarea><button>Submit</button>\";\n    textInputModal.querySelector(\"button\").addEventListener(\"click\", () => {\n        sendEventToTarget(event.detail.id, \"_textChanged\", { text: textInputModal.querySelector(\"textarea\").value });\n        textInputModal.remove();\n    });\n    scene.getAttribute(\"webxr\").overlayElement.appendChild(textInputModal);\n    textInputModal.querySelector(\"textarea\").focus();\n}\nconst activateTouchListener = {\n    name: \"activateTouchListener\",\n    metadata: {\n        \"activateTouchListener:builtins\": {\n            description: \"Add drag handler to DOM overlay\"\n        }\n    },\n    listener: createDomTouchListener,\n    canEmit: [\"drag\", \"twoFingerDrag\"]\n};\nfunction createDomTouchListener(event) {\n    var _a;\n    let touchListener = document.querySelector(\".a-machine-touch-listener\");\n    if (touchListener) {\n        touchListener.style.pointerEvents = \"auto\";\n        touchListener.style.visibility = \"visible\";\n        return;\n    }\n    const scene = document.querySelector(\"a-scene\");\n    if (!((_a = scene.getAttribute(\"webxr\")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {\n        console.warn(\"a-machine could not prompt for text - no webxr.overlayElement defined on a-scene\");\n        return;\n    }\n    touchListener = document.createElement(\"div\");\n    touchListener.classList.add(\"a-machine-touch-listener\");\n    if (customElements.get(\"a-machine-touch-ui\")) {\n        touchListener.innerHTML = \"<a-machine-touch-ui></a-machine-touch-ui>\";\n    }\n    else {\n        console.warn(\"To add custom UI to the touch listener, define a Web Component named <a-machine-touch-ui>\");\n        touchListener.innerHTML = \"<button id='done-btn'>Done</button><button id='cancel-btn'>Cancel</button>\";\n        touchListener.querySelector(\"#done-btn\").addEventListener(\"click\", () => {\n            sendEventToTarget(event.detail.id, \"doneBuilding\", {});\n            touchListener.style.pointerEvents = \"none\";\n            touchListener.style.visibility = \"hidden\";\n        });\n        touchListener.querySelector(\"#cancel-btn\").addEventListener(\"click\", () => {\n            sendEventToTarget(event.detail.id, \"cancelBuilding\", {});\n            touchListener.style.pointerEvents = \"none\";\n            touchListener.style.visibility = \"hidden\";\n        });\n    }\n    let prevTouch = null;\n    touchListener.addEventListener(\"touchstart\", (event) => {\n        prevTouch = event.touches[0];\n    }, { passive: true });\n    touchListener.addEventListener(\"touchmove\", (touchEvent) => {\n        const delta = {\n            x: touchEvent.touches[0].clientX - prevTouch.clientX,\n            y: touchEvent.touches[0].clientY - prevTouch.clientY,\n        };\n        if (touchEvent.touches.length === 1) {\n            sendEventToTarget(event.detail.id, \"drag\", { delta });\n        }\n        if (touchEvent.touches.length === 2) {\n            sendEventToTarget(event.detail.id, \"twoFingerDrag\", { delta });\n        }\n        prevTouch = touchEvent.touches[0];\n    }, { passive: true });\n    scene.getAttribute(\"webxr\").overlayElement.appendChild(touchListener);\n}\nfunction sendEventToTarget(id, eventName, detail) {\n    document.getElementById(id).dispatchEvent(new CustomEvent(`aMachine:${eventName}`, {\n        detail\n    }));\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-builtins.ts?");

/***/ }),

/***/ "./src/scripts/default-machines.ts":
/*!*****************************************!*\
  !*** ./src/scripts/default-machines.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"building\": () => (/* binding */ building),\n/* harmony export */   \"buttonMachine\": () => (/* binding */ buttonMachine),\n/* harmony export */   \"movingMachine\": () => (/* binding */ movingMachine),\n/* harmony export */   \"textInputMachine\": () => (/* binding */ textInputMachine),\n/* harmony export */   \"textRenderer\": () => (/* binding */ textRenderer),\n/* harmony export */   \"triggerTest\": () => (/* binding */ triggerTest)\n/* harmony export */ });\n/* harmony import */ var _transactionHandlers_deductEnergy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./transactionHandlers/deductEnergy */ \"./src/scripts/transactionHandlers/deductEnergy.ts\");\n\nconst buttonMachine = {\n    name: \"button\",\n    listeners: {\n        interact: (event, state, emit) => {\n            emit(\"trigger\");\n        }\n    },\n    metadata: {\n        interact: {\n            description: \"Emit 'trigger' event to siblings\"\n        }\n    },\n    canEmit: [\"trigger\"]\n};\nconst triggerTest = {\n    name: \"triggerTest\",\n    listeners: {\n        trigger: (event, state) => {\n            if (!state.count) {\n                state.count = 0;\n            }\n            state.count++;\n            console.log(`Machine has been triggered ${state.count} times`);\n        }\n    },\n    metadata: {\n        trigger: {\n            description: \"Update internal trigger count and log event\"\n        }\n    }\n};\nconst textInputMachine = {\n    name: \"textInput\",\n    listeners: {\n        _textChanged: (event, state, emit) => {\n            state.text = event.detail.text;\n            emit(\"textChanged\", state);\n        },\n        interact: (event, state, emit) => {\n            emit(\"promptForText:builtins\", { id: state.id });\n        }\n    },\n    metadata: {\n        _textChanged: {\n            description: \"receive internal callback from DOM and progagate to siblings\"\n        },\n        interact: {\n            description: \"Show input field for text entry\"\n        }\n    },\n    canEmit: [\n        \"promptForText:builtins\",\n        \"textChanged\"\n    ]\n};\nconst textRenderer = {\n    name: \"textRenderer\",\n    listeners: {\n        textChanged: (event, state) => {\n            const entity = document.getElementById(state.id);\n            entity.setAttribute(\"text\", { value: event.detail.text, side: \"double\" });\n        }\n    },\n    metadata: {\n        textChanged: {\n            description: \"Show text in VR environment\"\n        }\n    }\n};\nconst movingMachine = {\n    name: \"movingMachine\",\n    listeners: {\n        trigger: (event, state, emit) => {\n            // NOTE: If I want to run this in a vertex worker, this is no good. Machines should instead invoke a builtin by emitting an event.\n            // This is okay just for development\n            const entity = document.getElementById(state.id);\n            entity.emit(\"startAnimation\", null, false);\n        }\n    },\n    metadata: {\n        trigger: {\n            description: \"Directly modify object3D to move entity\"\n        }\n    }\n};\nconst building = {\n    name: \"building\",\n    canEmit: [\"activateTouchListener:builtins\"],\n    metadata: {\n        drag: {\n            description: \"Resize object\"\n        },\n        twoFingerDrag: {\n            description: \"Move object\"\n        }\n    },\n    listeners: {\n        interact: (event, state, emit) => {\n            console.log(\"State\", state);\n            state.el = document.getElementById(state.id);\n            state.initialState = {\n                position: Object.assign({}, state.el.object3D.position),\n                scale: Object.assign({}, state.el.object3D.scale),\n            };\n            state.el.setAttribute(\"material\", { transparent: true, opacity: 0.7 });\n            const { face: { normal: { x, y, z } }, uv } = event.detail.intersection;\n            if (y) {\n                return state;\n            }\n            // Update state to indicate how to respond to different drags\n            state.dragProperties = {\n                y: {\n                    resizeMultiplier: uv.y < 0.5 ? -1 : 1,\n                    offsetMultiplier: 1,\n                    attribute: \"y\"\n                },\n                x: {\n                    resizeMultiplier: uv.x < 0.5 ? -1 : 1,\n                    offsetMultiplier: -x || z,\n                    attribute: z ? \"x\" : \"z\"\n                }\n            };\n            emit(\"activateTouchListener:builtins\", { id: state.id });\n        },\n        drag: (event, state) => {\n            const { x, y } = event.detail.delta;\n            if (Math.abs(x) > Math.abs(y)) {\n                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x;\n                state.el.object3D.scale[state.dragProperties.x.attribute] += x / 100 * resizeMultiplier;\n                state.el.object3D.position[state.dragProperties.x.attribute] += x / 200 * offsetMultiplier;\n            }\n            else {\n                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.y;\n                state.el.object3D.scale[state.dragProperties.y.attribute] -= y / 100 * resizeMultiplier;\n                state.el.object3D.position[state.dragProperties.y.attribute] -= y / 200 * offsetMultiplier;\n            }\n        },\n        twoFingerDrag: (event, state) => {\n            const { x, y } = event.detail.delta;\n            if (Math.abs(x) > Math.abs(y)) {\n                const { offsetMultiplier } = state.dragProperties.x;\n                state.el.object3D.position[state.dragProperties.x.attribute] += x / 100 * offsetMultiplier;\n            }\n            else {\n                state.el.object3D.position[state.dragProperties.y.attribute] -= y / 100;\n            }\n        },\n        cancelBuilding: (event, state) => {\n            state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);\n            state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);\n            state.el.setAttribute(\"material\", { transparent: true, opacity: 1 });\n        },\n        doneBuilding: (event, state, emit, globalState) => {\n            // TODO: Handle resources according to the change in size\n            try {\n                // Handle energy costs\n                (0,_transactionHandlers_deductEnergy__WEBPACK_IMPORTED_MODULE_0__.deductEnergy)(10);\n                console.log(\"Remaining energy\", globalState.user.energy);\n            }\n            catch (err) {\n                // If insuffient resources or energy, revert building state.\n                state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);\n                state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);\n            }\n            state.el.setAttribute(\"material\", { transparent: true, opacity: 1 });\n        }\n    }\n};\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/default-machines.ts?");

/***/ }),

/***/ "./src/scripts/graphMachines.ts":
/*!**************************************!*\
  !*** ./src/scripts/graphMachines.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"graphMachines\": () => (/* binding */ graphMachines)\n/* harmony export */ });\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n\nfunction graphMachines(machines) {\n    let diagram = \"sequenceDiagram\\n\";\n    diagram += getParticipants(machines);\n    diagram += getSequence(machines);\n    return diagram;\n}\nfunction getParticipants(machines) {\n    let groupedParticipants = machines.reduce((acc, machine) => {\n        var _a;\n        acc.machines.add(machine.name);\n        if (Object.keys(machine.listeners).includes(\"interact\")) {\n            acc.system.add(\"user\");\n        }\n        (_a = machine.canEmit) === null || _a === void 0 ? void 0 : _a.forEach((event) => {\n            const [eventName, scope = \"siblings\"] = event.split(\":\");\n            if (scope === \"builtins\") {\n                acc.builtins.add(eventName);\n            }\n        });\n        return acc;\n    }, { system: new Set(), builtins: new Set(), machines: new Set() });\n    let participantString = \"\";\n    const orderedParticipants = [\"system\", \"builtins\", \"machines\"].reduce((acc, key) => {\n        acc = acc.concat(Array.from(groupedParticipants[key]));\n        return acc;\n    }, []);\n    orderedParticipants.forEach((p) => {\n        participantString += `\\tparticipant ${p}\\n`;\n    });\n    return participantString;\n}\nfunction getSequence(machines) {\n    let sequenceString = \"\";\n    let allListeners = {};\n    Object.keys(_a_machine__WEBPACK_IMPORTED_MODULE_0__.builtinRegistry).forEach(event => {\n        allListeners[`${event}:builtins`] = new Set();\n        allListeners[`${event}:builtins`].add(`${event}:builtins`);\n    });\n    allListeners = machines.reduce((acc, machine) => {\n        Object.keys(machine.listeners).forEach(event => {\n            if (!acc[event]) {\n                acc[event] = new Set();\n            }\n            acc[event].add(machine.name);\n        });\n        return acc;\n    }, allListeners);\n    console.log({ allListeners });\n    machines.forEach(machine => {\n        if (machine.listeners.interact) {\n            sequenceString += `\\n\\tuser->>${machine.name}: on user interaction`;\n            sequenceString += recurseSequencePath(machine, \"interact\", allListeners, \"\");\n        }\n    });\n    return sequenceString;\n}\nfunction recurseSequencePath(machine, event, allListeners, sequenceString = \"\") {\n    var _a;\n    // Add description for internal handling\n    let description = `${machine.name} handler for \"${event}\"`;\n    try {\n        description = machine.metadata[event].description;\n    }\n    catch (_) { }\n    sequenceString += `\\n\\t${machine.name}->>${machine.name}: ${description}`;\n    // Recursively add paths based on events that the machine can emit\n    (_a = machine.canEmit) === null || _a === void 0 ? void 0 : _a.forEach(event => {\n        var _a;\n        let scopedEvent = event;\n        const [eventName, scope = \"siblings\"] = event.split(\":\");\n        if (scope !== \"builtins\") {\n            scopedEvent = eventName;\n        }\n        (_a = allListeners[scopedEvent]) === null || _a === void 0 ? void 0 : _a.forEach((listeningMachine) => {\n            const machineOrBuiltin = _a_machine__WEBPACK_IMPORTED_MODULE_0__.machineRegistry[listeningMachine] || _a_machine__WEBPACK_IMPORTED_MODULE_0__.builtinRegistry[listeningMachine.split(\":\")[0]];\n            const duplicateLine = sequenceString.split(\"\\n\").find(str => str.startsWith(`\\t${machine.name}->>${machineOrBuiltin.name}: on \"${scopedEvent}\" event`));\n            if (!duplicateLine) {\n                sequenceString += `\\n\\t${machine.name}->>${listeningMachine.split(\":\")[0]}: on \"${scopedEvent}\" event`;\n                sequenceString = recurseSequencePath(machineOrBuiltin, scopedEvent, allListeners, sequenceString);\n            }\n        });\n    });\n    return sequenceString;\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/graphMachines.ts?");

/***/ }),

/***/ "./src/scripts/main.ts":
/*!*****************************!*\
  !*** ./src/scripts/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ \"./src/scripts/components/index.ts\");\n/* harmony import */ var _default_machines__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default-machines */ \"./src/scripts/default-machines.ts\");\n/* harmony import */ var _default_builtins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./default-builtins */ \"./src/scripts/default-builtins.ts\");\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./a-machine */ \"./src/scripts/a-machine.ts\");\n/* harmony import */ var _graphMachines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphMachines */ \"./src/scripts/graphMachines.ts\");\n\n\n\n\n\nObject.values(_default_machines__WEBPACK_IMPORTED_MODULE_1__).forEach(_a_machine__WEBPACK_IMPORTED_MODULE_3__.registerMachine);\nObject.entries(_default_builtins__WEBPACK_IMPORTED_MODULE_2__).forEach(([event, builtinMachine]) => (0,_a_machine__WEBPACK_IMPORTED_MODULE_3__.registerBuiltin)(event, builtinMachine));\nconsole.log((0,_graphMachines__WEBPACK_IMPORTED_MODULE_4__.graphMachines)(Object.values(_a_machine__WEBPACK_IMPORTED_MODULE_3__.machineRegistry)));\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/main.ts?");

/***/ }),

/***/ "./src/scripts/transactionHandlers/deductEnergy.ts":
/*!*********************************************************!*\
  !*** ./src/scripts/transactionHandlers/deductEnergy.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"deductEnergy\": () => (/* binding */ deductEnergy)\n/* harmony export */ });\n/* harmony import */ var _a_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../a-machine */ \"./src/scripts/a-machine.ts\");\n\nfunction deductEnergy(cost) {\n    if (_a_machine__WEBPACK_IMPORTED_MODULE_0__.globalState.user.energy < cost) {\n        throw new Error(\"Insufficient energy\");\n    }\n    _a_machine__WEBPACK_IMPORTED_MODULE_0__.globalState.user.energy -= cost;\n}\n\n\n//# sourceURL=webpack://aframe-machines/./src/scripts/transactionHandlers/deductEnergy.ts?");

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