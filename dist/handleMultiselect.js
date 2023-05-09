/**
 * The multiselection thing is probably the most complicated bit of machinery.
 * Therefore, I'm splitting out into its own function.
 * I should probably do this for all the other default machine handlers tbh
 */
export function scaleMultiple(event, state, emit) {
    if (!state.group) {
        return;
    }
    console.log("Should scale the group proxy parent");
}
export function rotateMultiple() {
    // Rotate the proxy group wrapper
    // Update the original group elements' rotations
}
export function translateMultiple() {
    // Iterate over all the group elements and apply the translation
}
export function select(event, state, emit, globalState) {
    var _a;
    state.el = state.el || document.getElementById(state.id);
    let groupId = globalState.selectedGroup;
    if (!groupId) {
        // There's an edge case here where the user selects an element that is already in a different group
        // @ts-ignore
        groupId = state.el.getAttribute("groupId") || crypto.randomUUID();
    }
    state.el.setAttribute("groupId", groupId);
    globalState.selectedGroup = groupId;
    (_a = globalState.groupProxy) === null || _a === void 0 ? void 0 : _a.remove();
    globalState.groupProxy = getGroupProxy(groupId, globalState);
}
export function unselect(event, state, emit, globalState) {
    var _a;
    if (!globalState.selectedGroup) {
        return;
    }
    document.getElementById(state.id).removeAttribute("groupId");
    (_a = globalState.groupProxy) === null || _a === void 0 ? void 0 : _a.remove();
    globalState.groupProxy = getGroupProxy(globalState.selectedGroup, globalState);
}
/**
 * This function receives a reference to a group of scene elements.
 * It returns a set of elements whose scales, rotations, and world positions are identical to the original group's.
 * The new elements (referred to as proxy elements) differ in that they are nested inside a wrapper element.
 * This wrapper element can be moved, rotated, scaled, etc.
 * Any edits to the proxy elements can be propagated to the originals.
 */
function getGroupProxy(groupId, globalState) {
    // Get all group elements
    const group = Array.from(document.querySelectorAll(`[groupId="${groupId}"]`));
    console.log("The group has: ", group);
    // Create wrapper and position at the centroid
    const centroidWrapperEl = document.createElement("a-entity");
    // Compute the centroid of all the group elements.
    // The size of the group elements does not affect this calculation.
    let centroid = group.reduce((acc, el) => {
        el.object3D.getWorldPosition(centroidWrapperEl.object3D.position);
        acc.x += centroidWrapperEl.object3D.position.x;
        acc.y += centroidWrapperEl.object3D.position.y;
        acc.z += centroidWrapperEl.object3D.position.z;
        const { scale, position } = el.object3D;
        acc.maxes.x = Math.max(acc.maxes.x, position.x + scale.x / 2);
        acc.mins.x = Math.min(acc.mins.x, position.x - scale.x / 2);
        acc.maxes.y = Math.max(acc.maxes.y, position.y + scale.y / 2);
        acc.mins.y = Math.min(acc.mins.y, position.y - scale.y / 2);
        acc.maxes.z = Math.max(acc.maxes.z, position.z + scale.z / 2);
        acc.mins.z = Math.min(acc.mins.z, position.z - scale.z / 2);
        return acc;
    }, { x: 0, y: 0, z: 0, maxes: { x: -99999, y: -99999, z: -99999 }, mins: { x: 99999, y: 99999, z: 99999 } });
    centroid.x /= group.length;
    centroid.y /= group.length;
    centroid.z /= group.length;
    // @ts-ignore
    centroid.y -= document.querySelector(globalState.rootSelector).object3D.position.y;
    const groupWrapperBox = document.createElement("a-box");
    groupWrapperBox.setAttribute("material", { wireframe: true, emissive: "#0ff" });
    groupWrapperBox.object3D.scale.set(centroid.maxes.x - centroid.mins.x + 0.2, centroid.maxes.y - centroid.mins.y + 0.2, centroid.maxes.z - centroid.mins.z + 0.2);
    centroidWrapperEl.appendChild(groupWrapperBox);
    centroidWrapperEl.object3D.position.set(centroid.x, centroid.y, centroid.z);
    console.log("centroid?", centroid);
    // Create proxy children and append them to wrapper
    group.forEach((el) => {
        const proxyEl = document.createElement("a-entity");
        // const proxyEl: any = document.createElement(el.tagName.toLowerCase())
        // el.setAttribute("visible", false)
        // I'm making some assumptions here about the DOM structure.
        // This code won't work as expected if the group's parents have a non-zero rotation. This should be fine, at least for now.
        const { scale, rotation } = el.object3D;
        proxyEl.object3D.scale.set(scale.x, scale.y, scale.z);
        proxyEl.object3D.rotation.set(rotation.x, rotation.y, rotation.z);
        el.object3D.getWorldPosition(proxyEl.object3D.position);
        proxyEl.object3D.position.sub(centroid);
        // const attributes = ["material", "color", "resource", "light"]
        // attributes.forEach(attr => {
        //   proxyEl.setAttribute(attr, el.getAttribute(attr))
        // })
        centroidWrapperEl.appendChild(proxyEl);
    });
    document.querySelector(globalState.rootSelector).appendChild(centroidWrapperEl);
    console.log("Hmmm", centroidWrapperEl);
    return centroidWrapperEl;
}
