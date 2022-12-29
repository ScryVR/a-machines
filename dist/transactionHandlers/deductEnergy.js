import { machineState } from "../machineState";
export function deductEnergy(cost) {
    if (machineState.user.energy < cost) {
        throw new Error("Insufficient energy");
    }
    machineState.user.energy -= cost;
}
export function deductResources(resource, consumption) {
    var _a;
    if (((_a = machineState.user.resources[resource]) === null || _a === void 0 ? void 0 : _a.quantity) < consumption) {
        throw new Error("Insufficient resources");
    }
    machineState.user.resources[resource].quantity -= consumption;
}
