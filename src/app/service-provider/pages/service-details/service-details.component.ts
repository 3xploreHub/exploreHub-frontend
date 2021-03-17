import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from 'src/app/modules/page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from 'src/app/modules/page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from 'src/app/modules/page-elements-display/text-display/text-display.component';
import { ChoicesInputDisplayComponent } from 'src/app/modules/page-input-field-display/choices-input-display/choices-input-display.component';
import { DateInputDisplayComponent } from 'src/app/modules/page-input-field-display/date-input-display/date-input-display.component';
import { NumberInputDisplayComponent } from 'src/app/modules/page-input-field-display/number-input-display/number-input-display.component';
import { TextInputDisplayComponent } from 'src/app/modules/page-input-field-display/text-input-display/text-input-display.component';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

export interface serviceInfo {
  pageType: string;
  pageId: string;
  serviceGroupId: string;
}

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @Input() values: ElementValues;
  @Input() serviceInfo: serviceInfo;
  public pageWidth: number;
  public pageHeight: number;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  components = {
    'text': TextDisplayComponent,
    'bullet-form-text': BulletFormTextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
    'text-input': TextInputDisplayComponent,
    'number-input': NumberInputDisplayComponent,
    'date-input': DateInputDisplayComponent,
    'choices-input': ChoicesInputDisplayComponent
  }
  constructor(
    public mainService: MainServicesService,
    public componentFactoryResolver: ComponentFactoryResolver,
    public route: ActivatedRoute,
    public router: Router,
    public creator: PageCreatorService) {
    this.values = { _id: "", type: "item", data: [], styles: [], default: false }
    this.serviceInfo = { pageId: "", serviceGroupId: "", pageType: "" }
  }

  ngOnInit() {
    this.pageWidth = window.innerWidth;
    this.pageHeight = window.innerHeight - 30;
    this.setPage()
  }

  setPage() {
    setTimeout(() => {
      this.pageElement.clear()
      if (this.values.type == "item") {
        this.values.data.forEach((component: any) => {
          this.renderComponent(component, "page")
        })
      }

    }, 100);

  }
  getServiceName() {
    let name = ""
    this.values.data.forEach(component => {
      if (component.data.defaultName && component.data.defaultName == "name") {
        name = component.data.text
      }
    });
    return name;
  }

  selectService() {
    const firstServiceSelected = { serviceId: this.values._id, serviceName: this.getServiceName(), serviceGroupId: this.serviceInfo.serviceGroupId }
    const data = { pageId: this.serviceInfo.pageId, pageType: this.serviceInfo.pageType, firstService: firstServiceSelected };

    this.mainService.createBooking(data).subscribe(
      (response: bookingData) => {

        this.router.navigate(["/service-provider/select-service", response._id])
      })
  }


  renderComponent(componentValues: any, parent) {
    // if (componentValues.type) {
    const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
    const comp = this.pageElement.createComponent<ElementComponent>(factory);
    comp.instance.values = componentValues.unSaved ? null : componentValues;
    // comp.instance.parentId = this.page._id;
    comp.instance.parent = "page";
    comp.instance.emitEvent = new EventEmitter();
    // }
  }
}
