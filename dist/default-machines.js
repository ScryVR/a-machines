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
            console.log("State", state);
            state.el = document.getElementById(state.id);
            state.initialState = {
                position: Object.assign({}, state.el.object3D.position),
                scale: Object.assign({}, state.el.object3D.scale),
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
        drag: (event, state, emit) => {
            const { x, y } = event.detail.delta;
            if (Math.abs(x) > Math.abs(y)) {
                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x;
                state.el.object3D.scale[state.dragProperties.x.attribute] +=
                    (x / 100) * resizeMultiplier;
                state.el.object3D.position[state.dragProperties.x.attribute] +=
                    (x / 200) * offsetMultiplier;
            }
            else {
                const { resizeMultiplier, offsetMultiplier } = state.dragProperties.y;
                state.el.object3D.scale[state.dragProperties.y.attribute] -=
                    (y / 100) * resizeMultiplier;
                state.el.object3D.position[state.dragProperties.y.attribute] -=
                    (y / 200) * offsetMultiplier;
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
        build: createNewBuilding,
        cancelBuilding: (event, state, emit) => {
            state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);
            state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);
            state.el.setAttribute("material", { transparent: true, opacity: 1 });
            emit("modifiedBuilding:builtins", { el: state.el });
        },
        doneBuilding: (event, state, emit, globalState) => {
            // TODO: Handle resources according to the change in size
            try {
                // Handle energy costs
                deductEnergy(10);
            }
            catch (err) {
                // If insuffient resources or energy, revert building state.
                state.el.object3D.position.set(state.initialState.position.x, state.initialState.position.y, state.initialState.position.z);
                state.el.object3D.scale.set(state.initialState.scale.x, state.initialState.scale.y, state.initialState.scale.z);
            }
            state.el.setAttribute("material", { transparent: true, opacity: 1 });
            emit("modifiedBuilding:builtins", {
                type: "object3D",
                data: {
                    position: state.el.object3D.position,
                    scale: state.el.object3D.scale,
                },
            });
        },
    },
};
export const foundation = {
    name: "foundation",
    listeners: {
        build: createNewBuilding,
    },
    canEmit: ["createdBuilding:builtins"],
    metadata: {
        build: {
            description: "Create a new structure.",
        },
    },
};
function setMaterial(event, state, emit, globalState) {
    if (globalState.actionArg) {
        const resource = globalState.actionArg;
        const el = document.getElementById(state.id);
        deductResources(resource, el.object3D.scale.x * el.object3D.scale.y * el.object3D.scale.z);
        deductEnergy(-1);
        document
            .getElementById(state.id)
            .setAttribute("material", globalState.user.resources[globalState.actionArg].material);
        emit(`modifiedBuilding:builtins`, { el });
    }
}
function createNewBuilding(event, state, emit, globalState) {
    var _a;
    if (["box", "sphere", "cylinder"].includes(globalState.actionArg)) {
        const { detail: { intersection: { point, face: { normal }, }, }, } = event;
        const newEl = document.createElement(`a-${globalState.actionArg}`);
        const foundation = document.getElementById(state.id);
        const isFoundation = ((_a = foundation.getAttribute("a-machine")) === null || _a === void 0 ? void 0 : _a.machine) === "foundation";
        const appendTarget = (isFoundation && globalState.foundationAppendTarget) ||
            foundation.parentElement;
        newEl.object3D.position.set(point.x, point.y - appendTarget.object3D.position.y + 0.5, point.z);
        if (!isFoundation) {
            newEl.object3D.position.x += normal.x * 0.5;
            newEl.object3D.position.y += normal.y * 0.5;
            newEl.object3D.position.z += normal.z * 0.5;
        }
        newEl.setAttribute("a-machine", { machine: "building" });
        newEl.setAttribute("shadow", { cast: true, receive: true });
        newEl.setAttribute("material", {
            color: "cyan",
        });
        try {
            deductEnergy(10);
            if (globalState.buildHook &&
                typeof globalState.buildHook === "function") {
                globalState.buildHook(newEl);
            }
            appendTarget.appendChild(newEl);
            emit("createdBuilding:builtins", { el: newEl });
        }
        catch (_) { }
    }
}
