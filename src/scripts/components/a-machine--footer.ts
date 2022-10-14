// @ts-ignore
import { registerMafiuComponent } from 'mafiu/dist/generator'
import { globalState } from '../a-machine'
const name = "a-machine--footer"
const ACTIONS = ["interact", "build", "multiselect", "set material"]
const ACTIONS_WITH_ARGS = ["build", "set material"]
const ARGS_BY_ACTION = {
  build: ["box", "sphere", "cylinder"],
  "set material": ["red", "green", "blue"]
}
let template = /*html*/`
<style>
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
  options="${ACTIONS.join(",")}"
  mhandle="onSelectAction:select">
</scrolling-selector>
<scrolling-selector
  class="collapsed"
  id="arg-selector"
  options=""
  mhandle="onSelectArg:select"
>
</scrolling-selector>
`
registerMafiuComponent({
  name,
  template,
  data: {
    collapsed: true
  },
  hooks: {
    selectedAction: [(action: string) => {
      globalState.selectedAction = action
    }],
    hasArg: [function (newVal: boolean, oldVal: boolean) {
      if (newVal) {
        // @ts-ignore
        const args = ARGS_BY_ACTION[this.state.selectedAction]
        this.querySelector("#arg-selector").setAttribute("options", args.join(","))
        this.querySelector("#arg-selector").classList.remove("collapsed")
      } else {
        this.querySelector("#arg-selector").classList.add("collapsed")
      }
    }]
  },
  handlers: {
    onSelectAction(event: any) {
      this.state.selectedAction = event.detail.selection
      this.state.hasArg = ACTIONS_WITH_ARGS.includes(event.detail.selection)
    },
    onSelectArg(event: any) {
    }
  }
})
