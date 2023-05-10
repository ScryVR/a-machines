// @ts-ignore
import { registerMafiuComponent } from "mafiu/dist/generator";
import { machineState } from "../machineState";
const name = "a-machine--footer";
const ACTIONS = ["interact", "build", "set material"];
let template = /*html*/ `
<style>
  scrolling-selector.has-swiping-indicator::before {
    content: "";
    height: 30px;
    width: 30px;
    position: absolute;
    top: 0;
    left: 60px;
    background: rgba(0,255,255,0.3);
    border-radius: 100%;
    opacity: 0;
    animation: swipe 800ms infinite ease-out;
    animation-delay: 3s;
  }
  @keyframes swipe {
    from, to { top: 70px; opacity: 1; }
    90% { top: 20px; opacity: 1; }
  }
  scrolling-selector {
    transition: max-width 0.8s, padding 0.2s;
    transition-delay: 0.5s;
    max-width: 200px;
  }
  scrolling-selector.collapsed {
    max-width: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
<scrolling-selector
  class="has-swiping-indicator"
  style="position: relative;"
  options="{{actions}}"
  mhandle="onSelectAction:select">
</scrolling-selector>
<scrolling-selector
  class="collapsed"
  id="arg-selector"
  options=""
  mhandle="onSelectArg:select"
>
</scrolling-selector>
`;
registerMafiuComponent({
  name,
  template,
  data: {
    collapsed: true,
    actions: ACTIONS.join(",")
  },
  hooks: {
    selectedAction: [
      (action: string) => {
        machineState.selectedAction = action.replace(/\s/g, "_"); // TODO: find a better way of converting between nice human names and action names
      },
    ],
    hasArg: [
      function (newVal: boolean) {
        if (newVal) {
          // @ts-ignore
          const args = getArgs(this.state.selectedAction);
          this.querySelector("#arg-selector").setAttribute(
            "options",
            args.join(",")
          );
          this.querySelector("#arg-selector").classList.remove("collapsed");
        } else {
          this.querySelector("#arg-selector").classList.add("collapsed");
        }
      },
    ],
  },
  handlers: {
    onSelectAction(event: any) {
      this.state.selectedAction = event.detail.selection;
      this.state.hasArg = getArgs(event.detail.selection).length;
      this.querySelector(".has-swiping-indicator")?.classList.remove(
        "has-swiping-indicator"
      );
      this.dispatchEvent(new CustomEvent("selection", { detail: { action: event.detail.selection } }))
    },
    onSelectArg(event: any) {
      machineState.actionArg = event.detail.selection;
      this.dispatchEvent(new CustomEvent("selection", { detail: { arg: event.detail.selection } }))
    },
  },
});

function getArgs(action: string) {
  switch (action) {
    case "build":
      return ["box", "sphere", "cylinder", "copy", ...(machineState.user.customBuildings || [])]
    case "set material":
      return Object.keys(machineState.user.resources).filter(key => machineState.user.resources[key].quantity).sort()
    default:
      return []
  }
}
