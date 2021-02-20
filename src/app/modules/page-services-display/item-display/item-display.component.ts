import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { LabelledTextDisplayComponent } from '../../page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from '../../page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from '../../page-elements-display/text-display/text-display.component';


@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss'],
})
export class ItemDisplayComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() onEditing: boolean = false;
  @Output() onHasUpdate: EventEmitter<ElementValues> = new EventEmitter();

  components = {
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService
  ) {
    this.values = {
      data: [],
      _id: null,
      styles: [],
      default: false,
      type: null
    }
  }

  ngOnInit() {
    if (this.onEditing) {
      this.creator.getItemUpdatedData(this.parentId, this.values._id).subscribe((updatedData: ElementValues) => {
        this.values = updatedData[0].services[0].data[0]
        // setTimeout(() => {
          if (this.values.data.length > 0) {
            this.setPage(this.values.data)
            this.onHasUpdate.emit(this.values)
          }
        // }, 100);
      })
    } else {
      // setTimeout(() => {
        if (this.values.data.length > 0) {
          this.setPage(this.values.data)
        }
      // }, 500);
    }
  }



  setPage(component) {
    setTimeout(() => {
      component.forEach((component: any) => {
        this.renderComponent(component.type, component)
      })
    }, 500);
   
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.pageElement.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.values._id;
    }
  }
}
