export function splitEntity(
  event: CustomEvent,
  state: Record<string, any>
) {
  if (["A-SPHERE", "A-CYLINDER"].includes(state.el.tagName)) {
    // I have no way of splitting a sphere.
    // It is possible to split a cylinder if the splitting plane is parallel to the circular faces, but I won't bother with this for now.
    return;
  }
  const original = state.el;
  // Get the current size of the original box.
  const originalScale = original.object3D.scale

  // Get the current rotation of the original box.
  const originalQuaternion = original.object3D.quaternion;

  // Calculate the new width for the split boxes (half of the original width).
  const originalWidth = originalScale.x;
  const newWidth = originalWidth * 0.5;

  // Remove the original box entity from its parent node.
  const originalParent = original.parentNode;

  // Create two new box entities with the updated dimensions and rotation.

  const newEntity = document.createElement("a-box") as any;

  newEntity.object3D.copy(original.object3D, false)


  newEntity.setAttribute("a-machine", { machine: "building" });
  newEntity.setAttribute("shadow", { cast: true, receive: true });
  newEntity.setAttribute("material", original.getAttribute("material"))
  newEntity.setAttribute("data-current-group", "true")
  const optionalAttrs = ["resource", "groupId"]
  optionalAttrs.forEach(attr => {
    if (original.hasAttribute(attr)) {
      newEntity.setAttribute(attr, original.getAttribute(attr))
    }
  })

  original.object3D.scale.x *= 0.5
  newEntity.object3D.scale.x *= 0.5

  // Calculate the offset for the split box positions based on the rotated width.
  // @ts-ignore
  const offset = new THREE.Vector3(newWidth, 0, 0).applyQuaternion(
    originalQuaternion
  );

  // Set the positions for the two new box entities using object3D.position.set().
  const { x, y, z } = original.object3D.position;
  original.object3D.position.set(
    x - offset.x * 0.51,
    y - offset.y * 0.51,
    z - offset.z * 0.51
  );

  newEntity.object3D.position.set(
    x + offset.x * 0.51,
    y + offset.y * 0.51,
    z + offset.z * 0.51
  );

  // Append the new box entity to the original parent node.
  originalParent.appendChild(newEntity);
}
