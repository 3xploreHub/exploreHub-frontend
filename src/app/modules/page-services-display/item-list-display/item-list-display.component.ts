import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { LabelledTextDisplayComponent } from '../../page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from '../../page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from '../../page-elements-display/text-display/text-display.component';
import { ItemDisplayComponent } from '../item-display/item-display.component';

@Component({
  selector: 'app-item-list-display',
  templateUrl: './item-list-display.component.html',
  styleUrls: ['./item-list-display.component.scss'],
})
export class ItemListDisplayComponent implements OnInit {
  @ViewChild('serviceElement', { read: ViewContainerRef }) serviceElement: ViewContainerRef;
  @Input() values: ElementValues;
  @Output() onHasUpdate: EventEmitter<ElementValues> = new EventEmitter();
  @ViewChild('listInfo', { read: ViewContainerRef }) listInfo: ViewContainerRef;
  @Output() onRender: EventEmitter<any> = new EventEmitter();
  @Output() emitEvent: EventEmitter<any> =  new EventEmitter();

  components = {
    'item': ItemDisplayComponent,
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
  }

  constructor(public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,) { }

  ngOnInit() {
    this.onRender.emit();
    setTimeout(() => {
      if (this.values.data.length > 0) {
        this.setService(this.values.data)
      }
    }, 400);
  }

  setService(component) {
    if (component.length > 0) {
      component.forEach((component: any) => {
        this.renderComponent(component.type, component)
      })
    }
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      let domRef = this.serviceElement
      let parent = "component";
      if (componentName != "item") {
        domRef = this.listInfo;
        parent = "service"
      }
      if (domRef) {
        const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
        const comp = domRef.createComponent<ElementComponent>(factory);
        comp.instance.values = componentValues;
        comp.instance.parentId = this.values._id;
        comp.instance.parent = parent;
        comp.instance.emitEvent = new EventEmitter();
        comp.instance.emitEvent.subscribe(itemId => this.emitEvent.emit({itemId: itemId, serviceId: this.values._id}));
      }
    }
  }

}
