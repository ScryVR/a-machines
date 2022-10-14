// @ts-ignore
import { registerMafiuComponent } from 'mafiu/dist/generator'
import { globalState, machineRegistry } from '../a-machine'
const name = "a-machine--footer"
const actions = ["interact", "build", "multiselect", "set material"]
let template = /*html*/`<scrolling-selector style="width: 200px;" options="${actions.join(",")}" mhandle="onSelectAction:select"></scrolling-selector>`
globalState.action = "interact"
registerMafiuComponent({
  name,
  template,
  data: {
    actionIndex: 0,
    actions,
  },
  hooks: {
    selectedAction: [(action: string) => {
      globalState.selectedAction = action
    }]
  },
  handlers: {
    onSelectAction(event: any) {
      this.state.selectedAction = event.detail.selection
    }
  }
})
