import { globalState } from "../a-machine";
export function deductEnergy(cost) {
    if (globalState.user.energy < cost) {
        throw new Error("Insufficient energy");
    }
    globalState.user.energy -= cost;
}
