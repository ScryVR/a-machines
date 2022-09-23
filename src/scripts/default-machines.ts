import { IMachine } from "./a-machine";

export const buttonMachine: IMachine = {
  name: "button",
  listeners: {
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      console.log("You interacted with", state.el)
      emit("trigger")
    }
  }
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
  }
}

export const textInputMachine: IMachine = {
  name: "textInput",
  listeners: {
    newText: (event: any, state: Record<string, any>, emit: Function) => {
      state.text = event.text
      emit("textChanged", state)
    },
    interact: (event: any, state: Record<string, any>, emit: Function) => {
      window.postMessage({ type: "promptForText", el: state.el })
    }
  }
}

export const helloWorld: IMachine = {
  name: "helloWorld",
  listeners: {
    textChanged: (event: any) => {
      alert(`Hello ${event.text}`)
    }
  }
}