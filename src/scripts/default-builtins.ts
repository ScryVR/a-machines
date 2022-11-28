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
      description: "Show text input modal with submit button",
    },
  },
  canEmit: ["_textChanged"],
};

function promptForTextListener(event: any) {
  const scene: any = document.querySelector("a-scene");
  if (!scene.getAttribute("webxr")?.overlayElement) {
    console.warn(
      "a-machine could not prompt for text - no webxr.overlayElement defined on a-scene"
    );
    return;
  }
  const textInputModal = document.createElement("div");
  textInputModal.classList.add("a-machine-modal")
  textInputModal.innerHTML = "<textarea></textarea><button>Submit</button>";
  textInputModal.querySelector("button").addEventListener("click", () => {
    sendEventToTarget(event.detail.id, "_textChanged", {
      text: textInputModal.querySelector("textarea").value,
    });
    textInputModal.remove();
  });
  scene.getAttribute("webxr").overlayElement.appendChild(textInputModal);
  textInputModal.querySelector("textarea").focus();
}

export const activateTouchListener: IBuiltin = {
  name: "activateTouchListener",
  metadata: {
    "activateTouchListener:builtins": {
      description: "Add drag handler to DOM overlay",
    },
  },
  listener: createDomTouchListener,
  canEmit: ["drag", "twoFingerDrag", "setDragProperty"],
};

let dragTargetId: string = "";
function createDomTouchListener(event: any) {
  dragTargetId = event.detail.id;
  let touchListener: HTMLElement = document.querySelector(
    ".a-machine-touch-listener"
  );
  if (touchListener) {
    touchListener.style.pointerEvents = "auto";
    touchListener.style.visibility = "visible";
    return;
  }
  const scene: any = document.querySelector("a-scene");
  if (!scene.getAttribute("webxr")?.overlayElement) {
    console.warn(
      "a-machine could not prompt for text - no webxr.overlayElement defined on a-scene"
    );
    return;
  }
  touchListener = document.createElement("div");
  touchListener.classList.add("a-machine-touch-listener");
  if (customElements.get("a-machine-touch-ui")) {
    touchListener.innerHTML = "<a-machine-touch-ui></a-machine-touch-ui>";
  } else {
    console.warn(
      "To add custom UI to the touch listener, define a Web Component named <a-machine-touch-ui>"
    );
    touchListener.innerHTML =
      /*html*/`
      <div class="button-wrapper">
        <button id='done-btn'>Done</button>
        <button id='rotate-btn'>Rotate</button>
        <button id='grid-btn'>Grid snap</button>
        <button id='cancel-btn'>Cancel</button>
      </div>
      `;
    touchListener.querySelector("#done-btn").addEventListener("click", () => {
      sendEventToTarget(dragTargetId, "doneBuilding", {});
      touchListener.style.pointerEvents = "none";
      touchListener.style.visibility = "hidden";
    });
    touchListener.querySelector("#rotate-btn").addEventListener("click", (event: any) => {
      console.log("Okay, doing the thing")
      event.target.classList.toggle("active")
      const selectedProperty = event.target.classList.contains("active") ? "rotation" : "scale"
      sendEventToTarget(dragTargetId, "setDragProperty", { selectedProperty })
    })
    touchListener.querySelector("#grid-btn").addEventListener("click", () => {
      sendEventToTarget(dragTargetId, "gridAlign", {})
    })
    touchListener.querySelector("#cancel-btn").addEventListener("click", () => {
      sendEventToTarget(dragTargetId, "cancelBuilding", {});
      touchListener.style.pointerEvents = "none";
      touchListener.style.visibility = "hidden";
    });
  }
  let prevTouch: any = null;
  touchListener.addEventListener(
    "touchstart",
    (event) => {
      prevTouch = event.touches[0];
    },
    { passive: true }
  );
  touchListener.addEventListener(
    "touchmove",
    (touchEvent) => {
      const delta = {
        x: touchEvent.touches[0].clientX - prevTouch.clientX,
        y: touchEvent.touches[0].clientY - prevTouch.clientY,
      };
      if (touchEvent.touches.length === 1) {
        sendEventToTarget(dragTargetId, "drag", { delta });
      }
      if (touchEvent.touches.length === 2) {
        sendEventToTarget(dragTargetId, "twoFingerDrag", { delta });
      }
      prevTouch = touchEvent.touches[0];
    },
    { passive: true }
  );
  scene.getAttribute("webxr").overlayElement.appendChild(touchListener);
}

function sendEventToTarget(id: string, eventName: string, detail: any) {
  document.getElementById(id).dispatchEvent(
    new CustomEvent(`aMachine:${eventName}`, {
      detail,
    })
  );
}
