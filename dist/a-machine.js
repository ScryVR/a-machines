export const globalState = {
    buildMode: "edit",
    selectedAction: "interact",
    // Todo: replace with class instance
    user: {
        energy: 100,
        resources: {
            wood: { material: { color: "brown" }, quantity: 100 },
            stone: { material: { color: "gray" }, quantity: 100 }
        }
    }
};
// @ts-ignore
AFRAME.registerComponent("a-machine", {
    schema: {
        machine: { type: "string" },
    },
    init() {
        if (!machineRegistry[this.data.machine]) {
            console.error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`);
            return;
        }
        if (!this.el.id) {
            this.el.id = id();
        }
        this.state = { id: this.el.id };
        Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {
            const [eventName, scope = "siblings"] = event.split(":");
            this.el.addEventListener(`aMachine:${eventName}`, (e) => {
                listener(e, this.state, this.emitFactory(this.data.machine), globalState);
            });
        });
        this.el.addEventListener("click", (event) => {
            const listener = machineRegistry[this.data.machine].listeners[globalState.selectedAction];
            if (listener) {
                listener(event, this.state, this.emitFactory(this.data.machine), globalState);
            }
            event.stopPropagation();
        });
    },
    emitFactory(machine) {
        return (event, payload) => {
            var _a;
            if ((_a = machineRegistry[machine].canEmit) === null || _a === void 0 ? void 0 : _a.includes(event)) {
                this.emit.call(this, event, payload);
            }
            else {
                console.error(`a-machine "${this.data.machine}" tried to emit event "${event}", but did not include it in its "canEmit" array`);
            }
        };
    },
    emit(event, payload) {
        // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver
        // Emit events to the direct children, direct parent, or direct siblings
        const [eventName, scope = "siblings"] = event.split(":");
        let connected = [this.el.parentElement];
        if (scope === "siblings") {
            connected = Array.from(this.el.parentElement.children).filter((el) => el.hasAttribute("a-machine"));
        }
        else if (scope === "children") {
            connected = Array.from(this.el.children).filter((el) => el.hasAttribute("a-machine"));
        }
        else if (scope === "builtins") {
            if (builtinRegistry[eventName]) {
                // NOTE: Calls to built-in handlers have a different signature. Might change this later.
                builtinRegistry[eventName].listener({ detail: payload });
            }
            else {
                console.warn(`Received a call to a unregistered built-in event: ${eventName}`);
            }
        }
        connected.forEach((el) => {
            el.dispatchEvent(new CustomEvent(`aMachine:${eventName}`, { detail: payload }));
        });
    },
});
export const machineRegistry = {};
export function registerMachine(machine) {
    if (machineRegistry[machine.name]) {
        throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`);
    }
    machineRegistry[machine.name] = machine;
}
export const builtinRegistry = {};
export function registerBuiltin(event, builtin) {
    if (builtinRegistry[event]) {
        throw new Error(`a-machine tried to register ${event}, but a built-in with this name is already registered`);
    }
    builtinRegistry[event] = builtin;
}
function id() {
    // There's some kind of weird typing issue where this function is not recognized by TS
    // This is a dumb way around that.
    const c = crypto;
    return "machine-" + c.randomUUID();
}
