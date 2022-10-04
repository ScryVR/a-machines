export interface IBuiltin {
  name: string;
  listener: Function;
  canEmit?: Array<string>;
  metadata?: Record<string, Record<string, string>>;
}
export const promptForText: IBuiltin = {
  name: "promptForText",
  listener: promptForTextListener,
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
  listener: createDomTouchListener,
  canEmit: ["drag", "twoFingerDrag"]
}

function createDomTouchListener(event: any) {
  console.log("Okay, creating")
  const scene: any = document.querySelector("a-scene")
  if (!scene.getAttribute("webxr")?.overlayElement) {
    console.warn("a-machine could not prompt for text - no webxr.overlayElement defined on a-scene")
    return
  }
  const touchListener = document.createElement("div")
  touchListener.style.position = "fixed"
  touchListener.style.top = "0"
  touchListener.style.left = "0"
  touchListener.style.width = "100vw"
  touchListener.style.height = "100vh"
  touchListener.style.backgroundColor = "rgba(0, 0, 0, 0.1)" // Temporary, for debugging purposes
  let prevTouch: any = null
  touchListener.addEventListener("touchstart", (event) => {
    prevTouch = event.touches[0]
  })
  touchListener.addEventListener("touchend", (event) => {
    console.log("Should pass event along", event)
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