import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
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
  components = {
    'item': ItemDisplayComponent
  }

  constructor(public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,) { }

  ngOnInit() {
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
      console.log(componentName)
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.serviceElement.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.values._id;
      comp.instance.parent = "component";
    }
  }

}
