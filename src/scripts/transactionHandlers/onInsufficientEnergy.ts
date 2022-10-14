import { globalState } from "../a-machine"

export async function onInsufficientEnergy() {
  console.log("Adding free energy")
  globalState.energy = 100
}