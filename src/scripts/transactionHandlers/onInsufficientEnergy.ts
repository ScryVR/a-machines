import { machineState } from "../machineState"

export async function onInsufficientEnergy() {
  console.log("Adding free energy")
  machineState.energy = 100
}