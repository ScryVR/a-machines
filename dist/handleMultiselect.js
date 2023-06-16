/**
 * The multiselection thing is probably the most complicated bit of machinery.
 * Therefore, I'm splitting out into its own function.
 * I should probably do this for all the other default machine handlers tbh
 */
export function transformMultiple(event, state, globalState) {
    // Transform the group proxy parent
    const { x, y } = event.detail.delta;
    const property = state.selectedProperty || "scale";
    if (Math.abs(x) > Math.abs(y)) {
        let xAttribute = state.dragProperties.x.attribute;
        if (property === "rotation") {
            xAttribute = state.dragProperties.y.attribute;
        }
        const { resizeMultiplier, offsetMultiplier } = state.dragProperties.x;
        globalState.groupProxy.object3D[property][xAttribute] +=
            (x / 100) * resizeMultiplier;
        if (property === "scale") {
            globalState.groupProxy.object3D.position[state.dragProperties.x.attribute] +=
                (x / 200) * offsetMultiplier;
        }
    }
    else {
        let yAttribute = state.dragProperties.y.attribute;
        if (property === "rotation") {
            yAttribute = state.dragProperties.x.attribute;
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
    let quat = new THREE.Quaternion();
    const root = document.querySelector(globalState.rootSelector);
    // @ts-ignore
    let rootWorldPos = new THREE.Vector3();
    root.object3D.getWorldPosition(rootWorldPos);
    globalState.groupProxy.querySelectorAll(".proxy").forEach((proxyEl) => {
        proxyEl.object3D.getWorldPosition(proxyEl.original.object3D.position);
        proxyEl.original.object3D.position.y -= rootWorldPos.y;
        proxyEl.object3D.getWorldScale(proxyEl.original.object3D.scale);
        if (property === "rotation") {
            proxyEl.object3D.getWorldQuaternion(quat);
            proxyEl.original.object3D.setRotationFromQuaternion(quat);
        }
    });
}
export function translateMultiple(event, state, globalState) {
    // Iterate over all the group elements and apply the translation
    const { x, y } = event.detail.delta;
    if (Math.abs(x) > Math.abs(y)) {
        const { offsetMultiplier } = state.dragProperties.x;
        globalState.groupProxy.object3D.position[state.dragProperties.x.attribute] +=
            (x / 100) * offsetMultiplier;
    }
    else {
        globalState.groupProxy.object3D.position[state.dragProperties.y.attribute] -= y / 100;
    }
    const root = document.querySelector(globalState.rootSelector);
    // @ts-ignore
    let rootWorldPos = new THREE.Vector3();
    root.object3D.getWorldPosition(rootWorldPos);
    globalState.groupProxy.querySelectorAll(".proxy").forEach((proxyEl) => {
        // The original's new position is the proxy's world position minus the proxy parent's world position
        proxyEl.object3D.getWorldPosition(proxyEl.original.object3D.position);
        proxyEl.original.object3D.position.y -= rootWorldPos.y;
    });
}
export function select(event, state, emit, globalState) {
    var _a;
    state.el.setAttribute("data-current-group", "true");
    state.el.removeAttribute("data-unselected");
    if (state.el.hasAttribute("groupId")) {
        const groupMates = document.querySelectorAll(`[groupId=${state.el.getAttribute("groupId")}]`);
        groupMates.forEach((el) => {
            var _a;
            el.setAttribute("data-current-group", "true");
            el.components["a-machine"].state.initialState = {
                position: Object.assign({}, el.object3D.position),
                scale: Object.assign({}, el.object3D.scale),
                rotation: Object.assign({}, el.object3D.rotation)
            };
            (_a = el.querySelector(".selection-indicator")) === null || _a === void 0 ? void 0 : _a.remove();
            const selectionIndicator = document.createElement(el.tagName.toLowerCase());
            selectionIndicator.setAttribute("material", { emissive: "#0ff", wireframe: true, color: "#0ff" });
            if (el.tagName === "A-CYLINDER") {
                selectionIndicator.setAttribute("geometry", {
                    segmentsRadial: 6,
                    segmentsHeight: 1
                });
            }
            else if (el.tagName === "A-SPHERE") {
                selectionIndicator.setAttribute("geometry", {
                    segmentsWidth: 12,
                    segmentsHeight: 12
                });
            }
            selectionIndicator.classList.add("selection-indicator");
            el.appendChild(selectionIndicator);
        });
    }
    (_a = globalState.groupProxy) === null || _a === void 0 ? void 0 : _a.remove();
    globalState.groupProxy = getGroupProxy("[data-current-group]:not([data-unselected])", globalState);
}
export function unselect(event, state, emit, globalState) {
    var _a, _b;
    // Instead of removing data-current-group, mark the unselected element as unselected
    // Preserving data-current-group makes it easy to do things like revert the state
    document.getElementById(state.id).setAttribute("data-unselected", "true");
    (_a = state.el.querySelector(".selection-indicator")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = globalState.groupProxy) === null || _b === void 0 ? void 0 : _b.remove();
    globalState.groupProxy = getGroupProxy("[data-current-group]:not([data-unselected])", globalState);
}
export function createFromBlueprint(event, state, emit, globalState) {
    const { detail: { groupId } } = event;
    const group = Array.from(document.querySelectorAll(`[groupId=${groupId}]`));
    const newGroupId = crypto.randomUUID().split("-")[4];
    const root = document.querySelector(globalState.rootSelector);
    let newGroupMember;
    group.forEach((el) => {
        const copyEl = document.createElement(el.tagName.toLowerCase());
        copyEl.object3D.copy(el.object3D, false);
        copyEl.setAttribute("groupId", `group-${newGroupId}`);
        ["material", "a-machine", "shadow", "light", "resource"].forEach((attr) => {
            const originalAttr = el.getAttribute(attr);
            if (originalAttr) {
                copyEl.setAttribute(attr, originalAttr);
            }
        });
        root.appendChild(copyEl);
        newGroupMember || (newGroupMember = copyEl);
    });
    setTimeout(() => {
        newGroupMember.dispatchEvent(new CustomEvent("aMachine:interact", event));
    });
}
/**
 * This function receives a reference to a group of scene elements.
 * It returns a set of elements whose scales, rotations, and world positions are identical to the original group's.
 * The new elements (referred to as proxy elements) differ in that they are nested inside a wrapper element.
 * This wrapper element can be moved, rotated, scaled, etc.
 * Any edits to the proxy elements can be propagated to the originals.
 */
function getGroupProxy(groupSelector, globalState) {
    // Get all group elements
    const group = Array.from(document.querySelectorAll(groupSelector));
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
    const root = document.querySelector(globalState.rootSelector);
    // @ts-ignore
    centroid.y -= root.object3D.position.y;
    centroidWrapperEl.object3D.position.set(centroid.x, centroid.y, centroid.z);
    root.appendChild(centroidWrapperEl);
    if (group.length > 1) {
        const groupWrapperBox = document.createElement("a-box");
        groupWrapperBox.setAttribute("material", { wireframe: true, emissive: "#faf", color: "#faf" });
        groupWrapperBox.object3D.scale.set(centroid.maxes.x - centroid.mins.x, centroid.maxes.y - centroid.mins.y, centroid.maxes.z - centroid.mins.z);
        centroidWrapperEl.appendChild(groupWrapperBox);
    }
    // Create proxy children and append them to wrapper
    group.forEach((el) => {
        const proxyEl = document.createElement("a-entity");
        proxyEl.classList.add("proxy");
        proxyEl.original = el;
        // I'm making some assumptions here about the DOM structure.
        // This code won't work as expected if the group's parents have a non-zero rotation. This should be fine, at least for now.
        const { scale, rotation } = el.object3D;
        proxyEl.object3D.scale.set(scale.x, scale.y, scale.z);
        proxyEl.object3D.rotation.set(rotation.x, rotation.y, rotation.z);
        el.object3D.getWorldPosition(proxyEl.object3D.position);
        proxyEl.object3D.position.sub(centroid);
        proxyEl.object3D.position.y -= root.object3D.position.y;
        centroidWrapperEl.appendChild(proxyEl);
    });
    return centroidWrapperEl;
}
