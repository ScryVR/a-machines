
/**
 * The multiselection thing is probably the most complicated bit of machinery.
 * Therefore, I'm splitting out into its own function.
 * I should probably do this for all the other default machine handlers tbh
 */
export function transformMultiple(event: CustomEvent, state: Record<string, any>, globalState: Record<string, any>) {
  // Transform the group proxy parent
  const { x, y } = event.detail.delta;
  const property = state.selectedProperty || "scale"
  if (Math.abs(x) > Math.abs(y)) {
    let xAttribute = state.dragProperties.x.attribute
    if (property === "rotation") {
      xAttribute = state.dragProperties.y.attribute
    }
    const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x;
    globalState.groupProxy.object3D[property][xAttribute] +=
      (x / 100) * resizeMultiplier;
    if (property === "scale") {
      globalState.groupProxy.object3D.position[state.dragProperties.x.attribute] +=
        (x / 200) * offsetMultiplier;
    }
  } else {
    let yAttribute = state.dragProperties.y.attribute
    if (property === "rotation") {
      yAttribute = state.dragProperties.x.attribute
    }
    const { resizeMultiplier, offsetMultiplier } = state.dragProperties.y;
    globalState.groupProxy.object3D[property][yAttribute] -=
      (y / 100) * resizeMultiplier;
    if (property === "scale") {
      globalState.groupProxy.object3D.position[state.dragProperties.y.attribute] -=
        (y / 200) * offsetMultiplier;
    }
  }
  // Iterate over the proxy children and transform the original elements accordingly
  // @ts-ignore
  let quat = new THREE.Quaternion()
  const root = document.querySelector(globalState.rootSelector)
  // @ts-ignore
  let rootWorldPos = new THREE.Vector3()
  root.object3D.getWorldPosition(rootWorldPos)
  globalState.groupProxy.querySelectorAll(".proxy").forEach((proxyEl: any) => {
    proxyEl.object3D.getWorldPosition(proxyEl.original.object3D.position)
    proxyEl.original.object3D.position.y -= rootWorldPos.y
    proxyEl.object3D.getWorldScale(proxyEl.original.object3D.scale)
    if (property === "rotation") {
      proxyEl.object3D.getWorldQuaternion(quat)
      proxyEl.original.object3D.setRotationFromQuaternion(quat)
    }
  })
}

export function translateMultiple(event: CustomEvent, state: Record<string, any>, globalState: Record<string, any>) {
  // Iterate over all the group elements and apply the translation
  const { x, y } = event.detail.delta;
  if (Math.abs(x) > Math.abs(y)) {
    const { offsetMultiplier } = state.dragProperties.x;
    globalState.groupProxy.object3D.position[state.dragProperties.x.attribute] +=
      (x / 100) * offsetMultiplier;
  } else {
    globalState.groupProxy.object3D.position[state.dragProperties.y.attribute] -= y / 100;
  }
  const root = document.querySelector(globalState.rootSelector)
  // @ts-ignore
  let rootWorldPos = new THREE.Vector3()
  root.object3D.getWorldPosition(rootWorldPos)
  globalState.groupProxy.querySelectorAll(".proxy").forEach((proxyEl: any) => {
    // The original's new position is the proxy's world position minus the proxy parent's world position
    proxyEl.object3D.getWorldPosition(proxyEl.original.object3D.position)
    proxyEl.original.object3D.position.y -= rootWorldPos.y
  })
}

export function select(event: CustomEvent, state: Record<string, any>, emit: Function, globalState: Record<string, any>) {
  state.el.setAttribute("data-current-group", "true")

  if (state.el.hasAttribute("groupId")) {
    const groupMates = document.querySelectorAll(`[groupId=${state.el.getAttribute("groupId")}]`)
    groupMates.forEach((el: any) => {
      el.setAttribute("data-current-group", "true")
      el.components["a-machine"].state.initialState = {
        position: { ...el.object3D.position },
        scale: { ...el.object3D.scale },
        rotation: { ...el.object3D.rotation }
      }
    })
  }

  globalState.groupProxy?.remove()
  globalState.groupProxy = getGroupProxy("[data-current-group]", globalState)
}

export function unselect(event: CustomEvent, state: Record<string, any>, emit: Function, globalState: Record<string, any>) {
  document.getElementById(state.id).removeAttribute("data-current-group")
  globalState.groupProxy?.remove()
  globalState.groupProxy = getGroupProxy("[data-current-group]", globalState)
}

/**
 * This function receives a reference to a group of scene elements.
 * It returns a set of elements whose scales, rotations, and world positions are identical to the original group's.
 * The new elements (referred to as proxy elements) differ in that they are nested inside a wrapper element.
 * This wrapper element can be moved, rotated, scaled, etc.
 * Any edits to the proxy elements can be propagated to the originals.
 */
function getGroupProxy(groupSelector: string, globalState: Record<string, any>) {
  // Get all group elements
  const group: any = Array.from(document.querySelectorAll(groupSelector))

  // Create wrapper and position at the centroid
  const centroidWrapperEl: any = document.createElement("a-entity");

  // Compute the centroid of all the group elements.
  // The size of the group elements does not affect this calculation.
  let centroid = group.reduce((acc: Record<string, number | any>, el: any) => {
    el.object3D.getWorldPosition(centroidWrapperEl.object3D.position)
    acc.x += centroidWrapperEl.object3D.position.x
    acc.y += centroidWrapperEl.object3D.position.y
    acc.z += centroidWrapperEl.object3D.position.z
    
    const { scale, position } = el.object3D
    acc.maxes.x = Math.max(acc.maxes.x, position.x + scale.x / 2)
    acc.mins.x = Math.min(acc.mins.x, position.x - scale.x / 2)
    acc.maxes.y = Math.max(acc.maxes.y, position.y + scale.y / 2)
    acc.mins.y = Math.min(acc.mins.y, position.y - scale.y / 2)
    acc.maxes.z = Math.max(acc.maxes.z, position.z + scale.z / 2)
    acc.mins.z = Math.min(acc.mins.z, position.z - scale.z / 2)
    return acc
  }, { x: 0, y: 0, z: 0, maxes: { x: -99999, y: -99999, z: -99999 }, mins: { x: 99999, y: 99999, z: 99999 } })
  centroid.x /= group.length
  centroid.y /= group.length
  centroid.z /= group.length
  
  const root = document.querySelector(globalState.rootSelector)
  // @ts-ignore
  centroid.y -= root.object3D.position.y 
  
  if (group.length > 1) {
    const groupWrapperBox: any = document.createElement("a-box")
    groupWrapperBox.setAttribute("material", { wireframe: true, emissive: "#faf", color: "#faf" })
    groupWrapperBox.object3D.scale.set(
      centroid.maxes.x - centroid.mins.x,
      centroid.maxes.y - centroid.mins.y,
      centroid.maxes.z - centroid.mins.z,
    )
    centroidWrapperEl.appendChild(groupWrapperBox)
  }

  centroidWrapperEl.object3D.position.set(centroid.x, centroid.y, centroid.z);
  // Create proxy children and append them to wrapper
  group.forEach((el: any) => {
    const proxyEl: any = document.createElement("a-entity")
    proxyEl.classList.add("proxy")
    proxyEl.original = el
    // I'm making some assumptions here about the DOM structure.
    // This code won't work as expected if the group's parents have a non-zero rotation. This should be fine, at least for now.
    const  { scale, rotation } = el.object3D
    proxyEl.object3D.scale.set(scale.x, scale.y, scale.z)
    proxyEl.object3D.rotation.set(rotation.x, rotation.y, rotation.z)

    el.object3D.getWorldPosition(proxyEl.object3D.position)
    proxyEl.object3D.position.sub(centroid)
    proxyEl.object3D.position.y -= root.object3D.position.y
    // const attributes = ["material", "color", "resource", "light"]
    // attributes.forEach(attr => {
    //   proxyEl.setAttribute(attr, el.getAttribute(attr))
    // })

    centroidWrapperEl.appendChild(proxyEl)
  })
  document.querySelector(globalState.rootSelector).appendChild(centroidWrapperEl)
  return centroidWrapperEl
}