import { IMachine } from "./a-machine";

export const buttonMachine: IMachine = {
  name: "button",
  listeners: {
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      emit("trigger")
    }
  },
  metadata: {
    interact: {
      description: "Emit 'trigger' event to siblings"
    }
  },
  canEmit: ["trigger"]
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
      entity.emit("startAnimation", null, false)
    }
  },
  metadata: {
    trigger: {
      description: "Directly modify object3D to move entity"
    }
  }
}

export const building: IMachine = {
  name: "building",
  canEmit: ["activateTouchListener:builtins"],
  metadata: {
    drag: {
      description: "Resize object"
    },
    twoFingerDrag: {
      description: "Move object"
    }
  },
  listeners: {
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      state.el = document.getElementById(state.id)
      const { face: { normal: { x, y, z } }, uv } = event.detail.intersection
      if (y) {
        return
      }
      // Update state to indicate how to respond to different drags
      state.dragProperties = {
        y: {
          resizeMultiplier: uv.y < 0.5 ? -1 : 1,
          offsetMultiplier: 1,
          attribute: "y"
        },
        x: {
          resizeMultiplier: uv.x < 0.5 ? -1 : 1,
          offsetMultiplier: -x || z,
          attribute: z ? "x" : "z"
        }
      }
      emit("activateTouchListener:builtins", { id: state.id })
    },
    drag: (event: any, state: Record<string, any>) => {
      const { x, y } = event.detail.delta
      if (Math.abs(x) > Math.abs(y)) {
        const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x
        state.el.object3D.scale[state.dragProperties.x.attribute] += x / 100 * resizeMultiplier
        state.el.object3D.position[state.dragProperties.x.attribute] += x / 200 * offsetMultiplier
      } else {
        const { resizeMultiplier, offsetMultiplier } = state.dragProperties.y
        state.el.object3D.scale[state.dragProperties.y.attribute] -= y / 100 * resizeMultiplier
        state.el.object3D.position[state.dragProperties.y.attribute] -= y / 200 * offsetMultiplier
      }
    },
    twoFingerDrag: (event: any, state: Record<string, any>) => {
      const { x, y } = event.detail.delta
      if (Math.abs(x) > Math.abs(y)) {
        const { offsetMultiplier } = state.dragProperties.x
        state.el.object3D.position[state.dragProperties.x.attribute] += x / 100 * offsetMultiplier
      } else {
        state.el.object3D.position[state.dragProperties.y.attribute] -= y / 100
      }
    }
  }
}