export interface IBuiltin {
  name: string;
  listener: Function;
  canEmit?: Array<string>;
  metadata?: Record<string, Record<string, string>>;
}
export const promptForText: IBuiltin = {
  name: "promptForText",
  listener: promptForTextListener,
  metadata: {
    "promptForText:builtins": {
      description: "Show text input modal with submit button"
    }
  },
  canEmit: ["_textChanged"]
}

function promptForTextListener(event: any) {
  const scene: any = document.querySelector("a-scene")
  if (!scene.getAttribute("webxr")?.overlayElement) {
    console.warn("a-machine could not prompt for text - no webxr.overlayElement defined on a-scene")
    return
  }
  const textInputModal = document.createElement("div")
  textInputModal.innerHTML = "<textarea></textarea><button>Submit</button>"
  textInputModal.querySelector("button").addEventListener("click", () => {
    sendEventToTarget(event.detail.id, "_textChanged", { text: textInputModal.querySelector("textarea").value })
    textInputModal.remove()
  })
  scene.getAttribute("webxr").overlayElement.appendChild(textInputModal)
  textInputModal.querySelector("textarea").focus()
}

export const activateTouchListener: IBuiltin = {
  name: "activateTouchListener",
  metadata: {
    "activateTouchListener:builtins": {
      description: "Add drag handler to DOM overlay"
    }
  },
  listener: createDomTouchListener,
  canEmit: ["drag", "twoFingerDrag"]
}

function createDomTouchListener(event: any) {
  const scene: any = document.querySelector("a-scene")
  if (!scene.getAttribute("webxr")?.overlayElement) {
    console.warn("a-machine could not prompt for text - no webxr.overlayElement defined on a-scene")
    return
  }
  const touchListener = document.createElement("div")
  touchListener.classList.add("a-machine-touch-listener")
  if (customElements.get("a-machine-touch-ui")) {
    touchListener.innerHTML = "<a-machine-touch-ui></a-machine-touch-ui>"
  } else {
    console.warn("To add custom UI to the touch listener, define a Web Component named <a-machine-touch-ui>")
    touchListener.innerHTML = "<button id='done-btn'>Done</button>"
    touchListener.querySelector("#done-btn").addEventListener("click", () => {
      touchListener.remove()
    })
  }
  let prevTouch: any = null
  touchListener.addEventListener("touchstart", (event) => {
    prevTouch = event.touches[0]
  })
  touchListener.addEventListener("touchend", (event) => {
    // @ts-ignore
    // const cursor = document.querySelector("[cursor]").components.cursor
    // if (cursor) {
    //   cursor.onCursorDown.call(cursor, event)
    //   cursor.twoWayEmit("click")
    // }
  })
  touchListener.addEventListener("touchmove", (touchEvent) => {
    const delta = {
      x: touchEvent.touches[0].clientX - prevTouch.clientX,
      y: touchEvent.touches[0].clientY - prevTouch.clientY,
    }
    if (touchEvent.touches.length === 1) {
      sendEventToTarget(event.detail.id, "drag", { delta })
    }
    if (touchEvent.touches.length === 2) {
      sendEventToTarget(event.detail.id, "twoFingerDrag", { delta })
    }
    prevTouch = touchEvent.touches[0]
  })
  scene.getAttribute("webxr").overlayElement.appendChild(touchListener)
}

function sendEventToTarget(id: string, eventName: string, detail: any) {
  document.getElementById(id).dispatchEvent(new CustomEvent(
    `aMachine:${eventName}`,
    {
      detail
    }
  ))
}