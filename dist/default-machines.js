import { deductEnergy, deductResources, } from "./transactionHandlers/deductEnergy";
export const buttonMachine = {
    name: "button",
    listeners: {
        interact: (event, state, emit) => {
            emit("trigger");
        },
    },
    metadata: {
        interact: {
            description: "Emit 'trigger' event to siblings",
        },
    },
    canEmit: ["trigger"],
};
export const triggerTest = {
    name: "triggerTest",
    canEmit: ["consumedResources:builtins"],
    listeners: {
        trigger: (event, state) => {
            if (!state.count) {
                state.count = 0;
            }
            state.count++;
            console.log(`Machine has been triggered ${state.count} times`);
        },
        set_material: setMaterial,
    },
    metadata: {
        trigger: {
            description: "Update internal trigger count and log event",
        },
    },
};
export const textInputMachine = {
    name: "textInput",
    listeners: {
        _textChanged: (event, state, emit) => {
            state.text = event.detail.text;
            emit("textChanged", state);
        },
        interact: (event, state, emit) => {
            emit("promptForText:builtins", { id: state.id });
        },
        set_material: setMaterial,
    },
    metadata: {
        _textChanged: {
            description: "receive internal callback from DOM and progagate to siblings",
        },
        interact: {
            description: "Show input field for text entry",
        },
    },
    canEmit: ["promptForText:builtins", "textChanged"],
};
export const textRenderer = {
    name: "textRenderer",
    listeners: {
        textChanged: (event, state) => {
            const entity = document.getElementById(state.id);
            entity.setAttribute("text", { value: event.detail.text, side: "double" });
        },
    },
    metadata: {
        textChanged: {
            description: "Show text in VR environment",
        },
    },
};
export const movingMachine = {
    name: "movingMachine",
    canEmit: ["consumedResources:builtins"],
    listeners: {
        trigger: (event, state, emit) => {
            // NOTE: If I want to run this in a vertex worker, this is no good. Machines should instead invoke a builtin by emitting an event.
            // This is okay just for development
            const entity = document.getElementById(state.id);
            entity.emit("startAnimation", null, false);
        },
        set_material: setMaterial,
    },
    metadata: {
        trigger: {
            description: "Directly modify object3D to move entity",
        },
    },
};
export const building = {
    name: "building",
    canEmit: [
        "activateTouchListener:builtins",
        "createdBuilding:builtins",
        "modifiedBuilding:builtins",
        "consumedResources:builtins",
        "outOfEnergy:builtins",
        "outOfResources:builtins",
    ],
    metadata: {
        drag: {
            description: "Resize object",
        },
        twoFingerDrag: {
            description: "Move object",
        },
    },
    listeners: {
        interact: (event, state, emit) => {
            state.el = document.getElementById(state.id);
            state.initialState = {
                position: Object.assign({}, state.el.object3D.position),
                scale: Object.assign({}, state.el.object3D.scale),
                rotation: Object.assign({}, state.el.object3D.rotation)
            };
            state.el.setAttribute("material", { transparent: true, opacity: 0.7 });
            const { face: { normal: { x, y, z }, }, uv, } = event.detail.intersection;
            // Update state to indicate how to respond to different drags
            state.dragProperties = {
                y: {
                    resizeMultiplier: uv.y < 0.5 ? -1 : 1,
                    offsetMultiplier: 1,
                    attribute: "y",
                },
                x: {
                    resizeMultiplier: uv.x < 0.5 ? -1 : 1,
                    offsetMultiplier: -x || z,
                    attribute: Math.abs(z) > Math.abs(x) ? "x" : "z",
                },
            };
            emit("activateTouchListener:builtins", { id: state.id });
        },
        set_material: setMaterial,
        setDragProperty: (event, state) => {
            state.selectedProperty = event.detail.selectedProperty;
        },
        drag: (event, state, emit) => {
            const { x, y } = event.detail.delta;
            const property = state.selectedProperty || "scale";
            if (Math.abs(x) > Math.abs(y)) {
                let xAttribute = state.dragProperties.x.attribute;
                if (property === "rotation") {
                    xAttribute = state.dragProperties.y.attribute;
                }
                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x;
                state.el.object3D[property][xAttribute] +=
                    (x / 100) * resizeMultiplier;
                if (property === "scale") {
                    state.el.object3D.position[state.dragProperties.x.attribute] +=
                        (x / 200) * offsetMultiplier;
                }
            }
            else {
                let yAttribute = state.dragProperties.y.attribute;
                if (property === "rotation") {
                    yAttribute = state.dragProperties.x.attribute;
                }
                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.y;
                state.el.object3D[property][yAttribute] -=
                    (y / 100) * resizeMultiplier;
                if (property === "scale") {
                    state.el.object3D.position[state.dragProperties.y.attribute] -=
                        (y / 200) * offsetMultiplier;
                }
            }
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        twoFingerDrag: (event, state, emit) => {
            const { x, y } = event.detail.delta;
            if (Math.abs(x) > Math.abs(y)) {
                const { offsetMultiplier } = state.dragProperties.x;
                state.el.object3D.position[state.dragProperties.x.attribute] +=
                    (x / 100) * offsetMultiplier;
            }
            else {
                state.el.object3D.position[state.dragProperties.y.attribute] -= y / 100;
            }
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        scaleChange: (event, state) => {
            if (!state.initialState) {
                return;
            }
            const newScale = {
                x: event.detail.scaleChange.x * state.initialState.scale.x,
                y: event.detail.scaleChange.y * state.initialState.scale.y,
                z: event.detail.scaleChange.z * state.initialState.scale.z,
            };
            state.el.object3D.scale.set(newScale.x, newScale.y, newScale.z);
        },
        rotationChange: (event, state, emit) => {
            if (!state.initialState) {
                return;
            }
            const newRotation = {
                x: event.detail.rotationChange.x + state.initialState.rotation._x,
                y: event.detail.rotationChange.y + state.initialState.rotation._y,
                z: event.detail.rotationChange.z + state.initialState.rotation._z,
            };
            state.el.object3D.rotation.set(newRotation.x, newRotation.y, newRotation.z);
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        moveCentroid: (event, state, emit) => {
            if (!state.initialState) {
                return;
            }
            if (!state.el) {
                state.el = document.getElementById(state.id);
            }
            state.el.object3D.position.set(event.detail.centroid.x, event.detail.centroid.y, event.detail.centroid.z);
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        gridAlign: (event, state) => {
            const { position, rotation } = state.el.object3D;
            state.el.object3D.position.set(Math.round(position.x * 4) / 4, Math.round(position.y * 4) / 4, Math.round(position.z * 4) / 4);
            const piOver4 = Math.PI / 4;
            state.el.object3D.rotation.set(Math.round(rotation._x * piOver4) * piOver4, Math.round(rotation._y * piOver4) / piOver4, Math.round(rotation._z * piOver4) / piOver4);
        },
        build: createNewBuilding,
        cancelBuilding: (event, state, emit) => {
            state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);
            state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);
            state.el.object3D.rotation.set(state.initialState.rotation._x, state.initialState.rotation._y, state.initialState.rotation._z);
            state.el.setAttribute("material", { transparent: true, opacity: 1 });
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        doneBuilding: (event, state, emit, globalState) => {
            try {
                // Handle energy costs
                const { x, y, z } = state.el.object3D.scale;
                const newSize = x * y * z;
                const { x: oldX, y: oldY, z: oldZ } = state.initialState.scale;
                const oldSize = oldX * oldY * oldZ;
                const energyCost = Math.ceil(Math.abs(newSize - oldSize) / 4);
                deductEnergy(energyCost);
                emit("consumedResources:builtins", { energy: energyCost });
                // Silently handle consuming resources for now - I'm lazy
                if (state.el.hasAttribute("resource")) {
                    let resource = state.el.getAttribute("resource");
                    try {
                        deductResources(resource, newSize - oldSize);
                        if (newSize < oldSize) {
                            // Making structures smaller doesn't give you all the resources back.
                            deductResources(resource, (oldSize - newSize) * 0.8);
                        }
                        console.log("modified resources due to size change");
                    }
                    catch (err) {
                        // If the user doesn't have enough resources, at least give the energy back.
                        deductEnergy(energyCost);
                        throw err;
                    }
                }
            }
            catch (err) {
                console.error("Couldn't finish building", err);
                // If insuffient resources or energy, revert building state.
                state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);
                state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);
                handleOverdraw(err, emit, event);
            }
            state.el.setAttribute("material", { transparent: true, opacity: 1 });
            emit("modifiedBuilding:builtins", { el: state.el });
        },
    },
};
export const foundation = {
    name: "foundation",
    listeners: {
        build: createNewBuilding,
    },
    canEmit: [
        "createdBuilding:builtins",
        "outOfEnergy:builtins",
        "outOfResources:builtins",
    ],
    metadata: {
        build: {
            description: "Create a new structure.",
        },
    },
};
function setMaterial(event, state, emit, globalState) {
    if (globalState.actionArg) {
        const resource = globalState.actionArg;
        // @ts-ignore
        const currentResource = document.getElementById(state.id).getAttribute("resource");
        const selectedResource = globalState.actionArg;
        if (currentResource !== selectedResource) {
            const el = document.getElementById(state.id);
            const resourcesConsumed = el.object3D.scale.x * el.object3D.scale.y * el.object3D.scale.z;
            if (currentResource) {
                console.log("Should give back some resources...");
                // We are silently giving resources back for now. I'll worry about emitting an event later.
                // Recycling resources isn't 100% efficient.
                if (!globalState.user.resources[currentResource]) {
                    globalState.user.resources[currentResource] = {
                        quantity: 0,
                        material: Object.entries(el.getAttribute("material")).reduce((acc, [key, val]) => {
                            if (["color", "transparent", "opacity", "shader", "wireframe", "emissive", "emissiveIntensity"].includes(key)) {
                                acc[key] = val;
                            }
                            return acc;
                        }, {})
                    };
                    if (el.hasAttribute("light")) {
                        globalState.user.resources[currentResource].light = Object.entries(el.getAttribute("light").reduce((acc, [key, val]) => {
                            if (["color", "intensity", "decay", "distance", "type", "castShadow"].includes(key)) {
                                acc[key] = val;
                            }
                            return acc;
                        }, {}));
                    }
                }
                globalState.user.resources[currentResource].quantity += 0.8 * resourcesConsumed;
            }
            try {
                deductResources(resource, resourcesConsumed);
                deductEnergy(1);
                emit("consumedResources:builtins", { amount: resourcesConsumed, resource, energy: 1 });
                document
                    .getElementById(state.id)
                    .setAttribute("material", globalState.user.resources[selectedResource].material);
                if (globalState.user.resources[selectedResource].light) {
                    document
                        .getElementById(state.id)
                        .setAttribute("light", globalState.user.resources[selectedResource].light);
                }
                else {
                    document.getElementById(state.id).removeAttribute("light");
                }
                document.getElementById(state.id).setAttribute("resource", selectedResource);
                emit(`modifiedBuilding:builtins`, { el });
            }
            catch (err) {
                handleOverdraw(err, emit, event);
            }
        }
    }
}
function createNewBuilding(event, state, emit, globalState) {
    var _a;
    const element = document.getElementById(state.id);
    let tag = globalState.actionArg;
    let scale = { x: 1, y: 1, z: 1 };
    if (globalState.actionArg === "copy") {
        tag = document.getElementById(state.id).tagName.toLowerCase().replace("a-", "");
        scale = element.object3D.scale;
    }
    if (["box", "sphere", "cylinder", ...(globalState.user.customBuildings || [])].includes(tag)) {
        const { detail: { intersection: { point, face: { normal }, }, }, } = event;
        const newEl = document.createElement(`a-${tag}`);
        const foundation = document.getElementById(state.id);
        const isFoundation = ((_a = foundation.getAttribute("a-machine")) === null || _a === void 0 ? void 0 : _a.machine) === "foundation";
        const appendTarget = (isFoundation && globalState.foundationAppendTarget) ||
            foundation.parentElement;
        newEl.object3D.position.set(point.x, point.y - appendTarget.object3D.position.y + scale.y / 2, point.z);
        newEl.object3D.scale.set(scale.x, scale.y, scale.z);
        if (!isFoundation) {
            newEl.object3D.position.x += normal.x * scale.x / 2;
            newEl.object3D.position.y += normal.y * scale.y / 2;
            newEl.object3D.position.z += normal.z * scale.z / 2;
        }
        newEl.setAttribute("a-machine", { machine: "building" });
        newEl.setAttribute("shadow", { cast: true, receive: true });
        newEl.setAttribute("material", {
            color: "cyan",
        });
        try {
            deductEnergy(2);
            if (globalState.buildHook &&
                typeof globalState.buildHook === "function") {
                globalState.buildHook(newEl);
            }
            appendTarget.appendChild(newEl);
            emit("createdBuilding:builtins", { el: newEl });
        }
        catch (err) {
            handleOverdraw(err, emit, event);
        }
    }
    else {
        console.warn("Tried to create unknown building", globalState.actionArg);
    }
}
function handleOverdraw(err, emit, event) {
    if (err.message === "Insufficient energy") {
        emit("outOfEnergy:builtins", { event });
    }
    else {
        emit("outOfResources:builtins", { event });
    }
}
