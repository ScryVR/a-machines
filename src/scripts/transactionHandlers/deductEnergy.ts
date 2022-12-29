import { machineState } from "../machineState"

export function deductEnergy(cost: number) {
  if (machineState.user.energy < cost) {
    throw new Error("Insufficient energy")
  }
  machineState.user.energy -= cost
}

export function deductResources(resource: string, consumption: number) {
  if (machineState.user.resources[resource]?.quantity < consumption) {
    throw new Error("Insufficient resources")
  }
  machineState.user.resources[resource].quantity -= consumption
}