import { builtinRegistry, IMachine, machineRegistry } from "./a-machine";
import { IBuiltin } from "./default-builtins";

export function graphMachines(machines: Array<IMachine>) {
  let diagram = "sequenceDiagram\n";
  diagram += getParticipants(machines)
  diagram += getSequence(machines)
  return diagram

}

function getParticipants(machines: Array<IMachine>) {
  let groupedParticipants = machines.reduce(
    (acc: any, machine) => {
      acc.machines.add(machine.name);
      if (Object.keys(machine.listeners).includes("interact")) {
        acc.system.add("user");
      }
      machine.canEmit?.forEach((event) => {
        const [eventName, scope = "siblings"] = event.split(":");
        if (scope === "builtins") {
          acc.builtins.add(eventName);
        }
      });
      return acc;
    },
    { system: new Set(), builtins: new Set(), machines: new Set() }
  );
  let participantString = "";
  const orderedParticipants = ["system", "builtins", "machines"].reduce((acc, key) => {
    acc = acc.concat(Array.from(groupedParticipants[key]))
    return acc
  }, [])
  orderedParticipants.forEach((p: string) => {
    participantString += `\tparticipant ${p}\n`;
  });
  return participantString
}

function getSequence(machines: Array<IMachine>) {
  let sequenceString = ""
  let allListeners: Record<string, Set<string>> = {}
  Object.keys(builtinRegistry).forEach(event => {
    allListeners[`${event}:builtins`] = new Set()
    allListeners[`${event}:builtins`].add(`${event}:builtins`)
  })
  allListeners = machines.reduce((acc: Record<string, Set<string>>, machine) => {
    Object.keys(machine.listeners).forEach(event => {
      if (!acc[event]) {
        acc[event] = new Set()
      }
      acc[event].add(machine.name)
    })
    return acc
  }, allListeners)
  console.log({ allListeners })
  machines.forEach(machine => {
    if (machine.listeners.interact) {
      sequenceString += `\n\tuser->>${machine.name}: on user interaction`
      sequenceString += recurseSequencePath(machine, "interact", allListeners, "")
    }
  })
  return sequenceString
}

function recurseSequencePath(machine: IMachine | IBuiltin, event: string, allListeners: Record<string, Set<string>>, sequenceString = "") {
  // Add description for internal handling
  let description = `${machine.name} handler for "${event}"`
  try {
    description = machine.metadata[event].description
  } catch(_) {}
  sequenceString += `\n\t${machine.name}->>${machine.name}: ${description}`
  // Recursively add paths based on events that the machine can emit
  machine.canEmit?.forEach(event => {
    let scopedEvent = event
    const [eventName, scope = "siblings"] = event.split(":")
    if (scope !== "builtins") {
      scopedEvent = eventName
    }
    allListeners[scopedEvent]?.forEach((listeningMachine) => {
      const machineOrBuiltin = machineRegistry[listeningMachine] || builtinRegistry[listeningMachine.split(":")[0]]
      const duplicateLine = sequenceString.split("\n").find(str => str.startsWith(`\t${machine.name}->>${machineOrBuiltin.name}: on "${scopedEvent}" event`))
      if (!duplicateLine) {
        sequenceString += `\n\t${machine.name}->>${listeningMachine.split(":")[0]}: on "${scopedEvent}" event`
        sequenceString = recurseSequencePath(machineOrBuiltin, scopedEvent, allListeners, sequenceString)
      }
    })
  })
  return sequenceString
}