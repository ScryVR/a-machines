import { builtinRegistry } from "./a-machine";
import { machineState } from "./machineState";
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
    canEmit: ["drag", "twoFingerDrag", "setDragProperty", "gridAlign", "createdGroup"],
};
let dragTargetId = "";
const groupNumber = groupNumberGenerator();
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
      <!--div class="advanced-menu">
        <button>Group</button>
        <button>Blueprint</button>
      </div>
      <button id='advanced-menu-btn'>&Hat;</button-->
      <div class="button-wrapper">
        <button id='done-btn'>Done</button>
        <button id='rotate-btn'>Rotate</button>
        <button id='cancel-btn'>Cancel</button>
      </div>
      `;
        touchListener.querySelector("#done-btn").addEventListener("click", () => {
            var _a;
            (_a = machineState.groupProxy) === null || _a === void 0 ? void 0 : _a.setAttribute("visible", false);
            document.querySelectorAll("[data-current-group]").forEach((el) => {
                el.removeAttribute("data-current-group");
                el.removeAttribute("data-unselected");
                sendEventToTarget(el.getAttribute("id"), "doneBuilding", {});
            });
            touchListener.style.pointerEvents = "none";
            touchListener.style.visibility = "hidden";
        });
        touchListener.querySelector("#rotate-btn").addEventListener("click", (event) => {
            event.target.classList.toggle("active");
            const selectedProperty = event.target.classList.contains("active") ? "rotation" : "scale";
            sendEventToTarget(dragTargetId, "setDragProperty", { selectedProperty });
        });
        touchListener.querySelector("#cancel-btn").addEventListener("click", () => {
            var _a;
            (_a = machineState.groupProxy) === null || _a === void 0 ? void 0 : _a.setAttribute("visible", false);
            document.querySelectorAll("[data-current-group]").forEach((el) => {
                el.removeAttribute("data-current-group");
                el.removeAttribute("data-unselected");
                sendEventToTarget(el.getAttribute("id"), "cancelBuilding", {});
            });
            touchListener.style.pointerEvents = "none";
            touchListener.style.visibility = "hidden";
        });
        // touchListener.querySelector("#advanced-menu-btn").addEventListener("click", () => {
        //   document.querySelector(".advanced-menu").classList.toggle("visible")
        //   document.querySelector("#advanced-menu-btn").classList.toggle("flipped")
        // })
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
    let debouncing = false;
    touchListener.addEventListener("touchend", (touchEvent) => {
        var _a;
        if (!isClicking || debouncing) {
            return;
        }
        debouncing = true;
        setTimeout(() => {
            debouncing = false;
        }, 100);
        if (touchEvent.touches.length === 0) {
            // @ts-ignore
            const cursor = document.querySelector("[cursor]").components.cursor;
            if (cursor) {
                cursor.onCursorDown.call(cursor, touchStartEvt);
                cursor.twoWayEmit("click");
            }
        }
        else if (touchEvent.touches.length === 1) {
            sendEventToTarget(dragTargetId, "gridAlign", {});
        }
        else if (touchEvent.touches.length === 2) {
            const currentGroup = document.querySelectorAll("[data-current-group]:not([data-unselected])");
            if (currentGroup.length === 1 || isAlreadyGroup(Array.from(currentGroup))) {
                return;
            }
            const groupId = groupNumber.next().value;
            currentGroup.forEach(el => {
                el.setAttribute("groupId", `group-${groupId}`);
            });
            (_a = builtinRegistry.createdGroup) === null || _a === void 0 ? void 0 : _a.listener({ detail: { group: currentGroup, groupId } });
        }
    });
    touchListener.oncontextmenu = () => false;
    scene.getAttribute("webxr").overlayElement.appendChild(touchListener);
}
function sendEventToTarget(id, eventName, detail) {
    document.getElementById(id).dispatchEvent(new CustomEvent(`aMachine:${eventName}`, {
        detail,
    }));
}
function* groupNumberGenerator() {
    let groupNumber = document.querySelectorAll("[groupId").length;
    while (1) {
        groupNumber++;
        yield groupNumber;
    }
}
function isAlreadyGroup(selection) {
    const groupId = selection[0].getAttribute("groupId");
    return groupId && selection.every(el => el.getAttribute("groupId") === groupId);
}
