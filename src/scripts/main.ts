import './components'
import * as defaultMachines from "./default-machines"
import * as defaultBuiltins from "./default-builtins"
import { registerMachine, registerBuiltin, machineRegistry } from "./a-machine"
import { graphMachines } from "./graphMachines"

Object.values(defaultMachines).forEach(registerMachine)
Object.entries(defaultBuiltins).forEach(([event, builtinMachine]) => registerBuiltin(event, builtinMachine))

console.log(graphMachines(Object.values(machineRegistry)))
