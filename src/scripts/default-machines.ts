import { IMachine } from "./a-machine";

export const buttonMachine: IMachine = {
  name: "button",
  listeners: {
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      emit("trigger:siblings")
    }
  },
  metadata: {
    interact: {
      description: "Emit 'trigger' event to siblings"
    }
  },
  canEmit: ["trigger:siblings"]
}

export const triggerTest: IMachine = {
  name: "triggerTest",
  listeners: {
    trigger: (event: any, state: Record<string, any>) => {
      if (!state.count) {
        state.count = 0
      }
      state.count++
      console.log(`Machine has been triggered ${state.count} times`)
    }
  },
  metadata: {
    trigger: {
      description: "Update internal trigger count and log event"
    }
  }
}

export const textInputMachine: IMachine = {
  name: "textInput",
  listeners: {
    _textChanged: (event: any, state: Record<string, any>, emit: Function) => {
      state.text = event.detail.text
      emit("textChanged", state)
    },
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      emit("promptForText:builtins", { id: state.id })
    }
  },
  metadata: {
    _textChanged: {
      description: "receive internal callback from DOM and progagate to siblings"
    },
    interact: {
      description: "Show input field for text entry"
    }
  },
  canEmit: [
    "promptForText:builtins",
    "textChanged"
  ]
}

export const textRenderer: IMachine = {
  name: "textRenderer",
  listeners: {
    textChanged: (event: any, state: Record<string, any>) => {
      const entity: any = document.getElementById(state.id)
      entity.setAttribute("text", { value: event.detail.text, side: "double" })
    }
  },
  metadata: {
    textChanged: {
      description: "Show text in VR environment"
    }
  }
}

export const movingMachine: IMachine = {
  name: "movingMachine",
  listeners: {
    trigger: (event: any, state: Record<string, any>, emit: Function) => {
      // NOTE: If I want to run this in a vertex worker, this is no good. Machines should instead invoke a builtin by emitting an event.
      // This is okay just for development
      const entity: any = document.getElementById(state.id)
      entity.object3D.position.y += 0.2
    }
  },
  metadata: {
    trigger: {
      description: "Directly modify object3D to move entity"
    }
  }
}
