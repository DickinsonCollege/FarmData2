"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingletonServiceDescriptors = exports.registerSingleton = void 0;
const descriptors_1 = require("./descriptors");
const _registry = [];
function registerSingleton(id, ctorOrDescriptor, supportsDelayedInstantiation) {
    if (!(ctorOrDescriptor instanceof descriptors_1.SyncDescriptor)) {
        ctorOrDescriptor = new descriptors_1.SyncDescriptor(ctorOrDescriptor, [], supportsDelayedInstantiation);
    }
    _registry.push([id, ctorOrDescriptor]);
}
exports.registerSingleton = registerSingleton;
function getSingletonServiceDescriptors() {
    return _registry;
}
exports.getSingletonServiceDescriptors = getSingletonServiceDescriptors;
//# sourceMappingURL=extensions.js.map