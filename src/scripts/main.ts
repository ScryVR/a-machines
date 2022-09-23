import * as defaultMachines from "./default-machines"
import { registerMachine } from "./a-machine"
Object.values(defaultMachines).forEach(registerMachine)

const buttonMachine: any = document.createElement("a-box")
buttonMachine.object3D.position.set(0, 1.5, -3)
buttonMachine.setAttribute("a-machine", { machine: "button" })
buttonMachine.setAttribute("color", "cyan")
setTimeout(() => {
  console.log("appending...")
  document.body.querySelector("a-scene").appendChild(buttonMachine)
}, 2000)