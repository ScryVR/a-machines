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

export const helloWorld: IMachine = {
  name: "helloWorld",
  listeners: {
    textChanged: (event: any) => {
      alert(`Hello ${event.detail.text}`)
    }
  },
  metadata: {
    textChanged: {
      description: "Show updated text in alert"
    }
  }
}
