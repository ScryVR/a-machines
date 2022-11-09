import { globalState } from "../a-machine";

export function deductEnergy(cost: number) {
  if (globalState.user.energy < cost) {
    throw new Error("Insufficient energy")
  }
  globalState.user.energy -= cost
}

export function deductResources(resource: string, consumption: number) {
  if (globalState.user.resources[resource]?.quantity < consumption) {
    throw new Error("Insufficient resources")
  }
  globalState.user.resources[resource].quantity -= consumption
}