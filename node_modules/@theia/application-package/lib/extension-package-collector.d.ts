import { NodePackage, PublishedNodePackage } from './npm-registry';
import { ExtensionPackage, ExtensionPackageOptions } from './extension-package';
export declare class ExtensionPackageCollector {
    protected readonly extensionPackageFactory: (raw: PublishedNodePackage, options?: ExtensionPackageOptions) => ExtensionPackage;
    protected readonly resolveModule: (modulePath: string) => string;
    protected readonly sorted: ExtensionPackage[];
    protected readonly visited: Map<string, boolean>;
    constructor(extensionPackageFactory: (raw: PublishedNodePackage, options?: ExtensionPackageOptions) => ExtensionPackage, resolveModule: (modulePath: string) => string);
    protected root: NodePackage;
    collect(pck: NodePackage): ReadonlyArray<ExtensionPackage>;
    protected collectPackages(pck: NodePackage): void;
    protected parent: ExtensionPackage | undefined;
    protected collectPackagesWithParent(pck: NodePackage, parent: ExtensionPackage): void;
    protected collectPackage(name: string, versionRange: string): void;
}
//# sourceMappingURL=extension-package-collector.d.ts.map