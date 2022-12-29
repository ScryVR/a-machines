export const machineState: Record<string, any> = {
  buildMode: "edit",
  selectedAction: "interact",
  // Todo: replace with class instance
  user: {
    energy: 100,
    resources: {
      wood: { material: { color: "brown" }, quantity: 100 },
      stone: { material: { color: "gray" }, quantity: 100 }
    }
  }
}