import { globalState } from "../a-machine";

export function deductEnergy(cost: number) {
  if (globalState.user.energy < cost) {
    throw new Error("Insufficient energy")
  }
  globalState.user.energy -= cost
}