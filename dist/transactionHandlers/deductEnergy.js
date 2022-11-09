import { globalState } from "../a-machine";
export function deductEnergy(cost) {
    if (globalState.user.energy < cost) {
        throw new Error("Insufficient energy");
    }
    globalState.user.energy -= cost;
}
export function deductResources(resource, consumption) {
    var _a;
    if (((_a = globalState.user.resources[resource]) === null || _a === void 0 ? void 0 : _a.quantity) < consumption) {
        throw new Error("Insufficient resources");
    }
    globalState.user.resources[resource].quantity -= consumption;
}
