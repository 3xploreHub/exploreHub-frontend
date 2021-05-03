import { EventEmitter } from "@angular/core";
import { ElementValues } from "./ElementValues";

export interface ElementComponent {
    values: ElementValues;
    parentId: string;
    parent: string;
    grandParentId: string;
    emitEvent: EventEmitter<any>;
    hasError: boolean;
}
