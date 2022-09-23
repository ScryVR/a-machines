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
    document.getElementById(event.detail.id).dispatchEvent(new CustomEvent(
      "aMachine:_textChanged",
      {
        detail: {
          text: textInputModal.querySelector("textarea").value
        }
      }
    ))
    textInputModal.remove()
  })
  scene.getAttribute("webxr").overlayElement.appendChild(textInputModal)
  textInputModal.querySelector("textarea").focus()
}