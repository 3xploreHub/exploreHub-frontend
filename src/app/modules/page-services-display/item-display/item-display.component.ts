import { AfterContentChecked, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { LabelledTextDisplayComponent } from '../../page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from '../../page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from '../../page-elements-display/text-display/text-display.component';
import { LabelledTextComponent } from '../../page-elements/labelled-text/labelled-text.component';
import { PhotoComponent } from '../../page-elements/photo/photo.component';
import { TextComponent } from '../../page-elements/text/text.component';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss'],
})
export class ItemDisplayComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @Input() values: ElementValues;

  components = {
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
  }


  constructor(
    private cdr: ChangeDetectorRef,
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
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
    
    setTimeout(() => {
      if (this.values.data.length > 0) {
        this.setPage(this.values.data)
      }
    }, 500);
  }


  
  setPage(component) {
    component.forEach((component: any) => {
      this.renderComponent(component.type, component)
    })
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
