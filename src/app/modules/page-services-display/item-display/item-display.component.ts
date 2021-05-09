import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from '../../page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
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
  noAvailable = false
  @Input() onEditing: boolean = false;
  @Output() onClick: EventEmitter<any>  = new EventEmitter();
  @Output() onHasUpdate: EventEmitter<ElementValues> = new EventEmitter();
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  public hasMoreContent: boolean = false;
  @ViewChild('item', { static: false }) item: ElementRef;

  components = {
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
    'bullet-form-text': BulletFormTextDisplayComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public mainService: MainServicesService
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
    // setTimeout(() => {
      if (this.values.data.length > 0) {
        this.setPage(this.values.data)
      }
    // }, 400);
    this.mainService.notification.subscribe(
      (data: any) => {
       
      }
    )
  }

  setPage(component) {
    setTimeout(() => {
      component.forEach((component: any) => {
        let available = 0
        if (component.data.defaultName == "quantity") {
          component.data.label = "Available"
          const booked = (this.values["booked"] + this.values["manuallyBooked"] + this.values["toBeBooked"] + this.values['pending'])
          
          available = component.data.text - booked 
          available = available == null || available == NaN? 0: available
          this.noAvailable = available == 0
          component.data.text = available
          
        }
        this.renderComponent(component.type, component)
        this.checkHeight();
      })
    }, 500);

  }

  checkHeight() {
    setTimeout(() => {
      this.hasMoreContent = this.item.nativeElement.clientHeight >= 430;
    }, 300);
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.pageElement.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.values._id;
      comp.instance.parent = "component";
    }
  }

  itemClicked() {
    this.emitEvent.emit(this.values._id);
  }
}
