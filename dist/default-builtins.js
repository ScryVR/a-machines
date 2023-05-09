export const promptForText = {
    name: "promptForText",
    listener: promptForTextListener,
    metadata: {
        "promptForText:builtins": {
            description: "Show text input modal with submit button",
        },
    },
    canEmit: ["_textChanged"],
};
function promptForTextListener(event) {
    var _a;
    const scene = document.querySelector("a-scene");
    if (!((_a = scene.getAttribute("webxr")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {
        console.warn("a-machine could not prompt for text - no webxr.overlayElement defined on a-scene");
        return;
    }
    const textInputModal = document.createElement("div");
    textInputModal.classList.add("a-machine-modal");
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
export const activateTouchListener = {
    name: "activateTouchListener",
    metadata: {
        "activateTouchListener:builtins": {
            description: "Add drag handler to DOM overlay",
        },
    },
    listener: createDomTouchListener,
    canEmit: ["drag", "twoFingerDrag", "setDragProperty"],
};
let dragTargetId = "";
function createDomTouchListener(event) {
    var _a;
    dragTargetId = event.detail.id;
    let touchListener = document.querySelector(".a-machine-touch-listener");
    if (touchListener) {
        touchListener.style.pointerEvents = "auto";
        touchListener.style.visibility = "visible";
        return;
    }
    const scene = document.querySelector("a-scene");
    if (!((_a = scene.getAttribute("webxr")) === null || _a === void 0 ? void 0 : _a.overlayElement)) {
        console.warn("a-machine could not prompt for text - no webxr.overlayElement defined on a-scene");
        return;
    }
    touchListener = document.createElement("div");
    touchListener.classList.add("a-machine-touch-listener");
    if (customElements.get("a-machine-touch-ui")) {
        touchListener.innerHTML = "<a-machine-touch-ui></a-machine-touch-ui>";
    }
    else {
        console.warn("To add custom UI to the touch listener, define a Web Component named <a-machine-touch-ui>");
        touchListener.innerHTML =
            /*html*/ `
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
        touchListener.querySelector("#rotate-btn").addEventListener("click", (event) => {
            event.target.classList.toggle("active");
            const selectedProperty = event.target.classList.contains("active") ? "rotation" : "scale";
            sendEventToTarget(dragTargetId, "setDragProperty", { selectedProperty });
        });
        touchListener.querySelector("#grid-btn").addEventListener("click", () => {
            sendEventToTarget(dragTargetId, "gridAlign", {});
        });
        touchListener.querySelector("#cancel-btn").addEventListener("click", () => {
            sendEventToTarget(dragTargetId, "cancelBuilding", {});
            touchListener.style.pointerEvents = "none";
            touchListener.style.visibility = "hidden";
        });
    }
    let prevTouch = null;
    let touchStartEvt = null;
    let isClicking = true;
    touchListener.addEventListener("touchstart", (event) => {
        prevTouch = event.touches[0];
        touchStartEvt = event;
        isClicking = true;
    }, { passive: true });
    touchListener.addEventListener("touchmove", (touchEvent) => {
        isClicking = false;
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
    }, { passive: true });
    touchListener.addEventListener("touchend", (touchEvent) => {
        if (!isClicking) {
            return;
        }
        console.log("Clicky time???");
        // @ts-ignore
        const cursor = document.querySelector("[cursor]").components.cursor;
        if (cursor) {
            console.log("should do the thing");
            cursor.onCursorDown.call(cursor, touchStartEvt);
            cursor.twoWayEmit("click");
        }
        // sendEventToTarget(dragTargetId, "interact", { touch: touchEvent.touches[0] })
    });
    scene.getAttribute("webxr").overlayElement.appendChild(touchListener);
}
function sendEventToTarget(id, eventName, detail) {
    document.getElementById(id).dispatchEvent(new CustomEvent(`aMachine:${eventName}`, {
        detail,
    }));
}
