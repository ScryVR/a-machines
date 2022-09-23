import { IBuiltin } from "./default-builtins";

// @ts-ignore
AFRAME.registerComponent("a-machine", {
  schema: {
    machine: { type: "string" },
  },
  init() {
    if (!machineRegistry[this.data.machine]) {
      console.error(
        `a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`
      );
      return
    }
    if (!this.el.id) {
      this.el.id = id();
    }
    this.state = { id: this.el.id };
    Object.entries(machineRegistry[this.data.machine].listeners).forEach(
      ([event, listener]) => {
        const [eventName, scope = "siblings"] = event.split(":");
        this.el.addEventListener(`aMachine:${eventName}`, (e: any) => {
          listener(e, this.state, this.emitFactory(this.data.machine));
        });
      }
    );
    const interactListener =
      machineRegistry[this.data.machine].listeners.interact;
    this.el.addEventListener("click", (event: any) => {
      if (interactListener) {
        interactListener(event, this.state, this.emitFactory(this.data.machine));
      }
      event.stopPropagation();
    });
  },
  emitFactory(machine: string) {
    return (event: string, payload: any) => {
      if (machineRegistry[machine].canEmit?.includes(event)) {
        this.emit.call(this, event, payload);
      } else {
        console.error(
          `a-machine "${this.data.machine}" tried to emit event "${event}", but did not include it in its "canEmit" array`
        );
      }
    };
  },
  emit(event: string, payload: any) {
    // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver
    // Emit events to the direct children, direct parent, or direct siblings
    const [eventName, scope = "siblings"] = event.split(":");
    let connected = [this.el.parentElement];
    if (scope === "siblings") {
      connected = Array.from(this.el.parentElement.children).filter(
        (el: HTMLElement) => el.hasAttribute("a-machine")
      );
    } else if (scope === "children") {
      connected = Array.from(this.el.children).filter((el: HTMLElement) =>
        el.hasAttribute("a-machine")
      );
    } else if (scope === "builtins") {
      if (builtinRegistry[eventName]) {
        // NOTE: Calls to built-in handlers have a different signature. Might change this later.
        builtinRegistry[eventName].listener({ detail: payload });
      } else {
        console.warn(
          `Received a call to a unregistered built-in event: ${eventName}`
        );
      }
    }
    connected.forEach((el) => {
      el.dispatchEvent(
        new CustomEvent(`aMachine:${eventName}`, { detail: payload })
      );
    });
  },
});

export interface IMachine {
  name: string;
  listeners: Record<string, Function>;
  metadata?: Record<string, Record<string, string>>
  canEmit?: Array<string>;
}

export const machineRegistry: Record<string, IMachine> = {};

export function registerMachine(machine: IMachine) {
  if (machineRegistry[machine.name]) {
    throw new Error(
      `a-machine tried to register ${machine.name}, but a machine with this name is already registered`
    );
  }
  machineRegistry[machine.name] = machine;
}

export const builtinRegistry: Record<string, IBuiltin> = {};
export function registerBuiltin(event: string, builtin: IBuiltin) {
  if (builtinRegistry[event]) {
    throw new Error(
      `a-machine tried to register ${event}, but a built-in with this name is already registered`
    );
  }
  builtinRegistry[event] = builtin;
}

function id() {
  return "machine-" + crypto.randomUUID();
}
