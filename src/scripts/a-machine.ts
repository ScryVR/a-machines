// @ts-ignore
AFRAME.registerComponent("a-machine", {
  schema: {
    machine: { type: "string" }
  },
  init() {
    if (!machineRegistry[this.data.machine]) {
      throw new Error(`a-machine could not register machine of type ${this.data.machine} - has this machine type been registered?`)
    }
    this.state = { el: this.el }
    Object.entries(machineRegistry[this.data.machine].listeners).forEach(([event, listener]) => {
      this.el.addEventListener(`aMachine:${event}`, (e: any) => {
        listener(e, this.state, this.emit.bind(this))
      })
    })
    this.el.addEventListener("click", (event: any) => {
      this.el.dispatchEvent(new CustomEvent("aMachine:interact", { detail: event }))
    })
  },
  emit(event: string, payload: any) {
    // TODO: Find a way to avoid computing the connected elements on the fly. Probably some kind of MutationObserver
    // Emit events to the direct children, direct parent, and direct siblings
    const directChildrenSelector = "[a-machine]:not([a-machine] [a-machine])"
    const connected = [
      this.el.parentElement,
      ...Array.from(this.el.querySelectorAll(directChildrenSelector)),
      ...Array.from(this.el.parentElement.querySelectorAll(directChildrenSelector))
    ]
    connected.forEach(el => {
      el.dispatchEvent(new CustomEvent(`aMachine:${event}`, { detail: payload }))
    })
  }
})

export interface IMachine {
  name: string;
  listeners: Record<string, Function>
}

const machineRegistry: Record<string, IMachine> = {}

export function registerMachine(machine: IMachine) {
  if (machineRegistry[machine.name]) {
    throw new Error(`a-machine tried to register ${machine.name}, but a machine with this name is already registered`)
  }
  machineRegistry[machine.name] = machine
}