import './components';
import * as defaultMachines from "./default-machines";
import * as defaultBuiltins from "./default-builtins";
import { registerMachine, registerBuiltin } from "./a-machine";
Object.values(defaultMachines).forEach(registerMachine);
Object.entries(defaultBuiltins).forEach(([event, builtinMachine]) => registerBuiltin(event, builtinMachine));
