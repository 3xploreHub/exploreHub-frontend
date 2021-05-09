import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
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
  serviceGroupName: string;
  bookingId: string;
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
  @Input() noAvailable = false
  @Input() notOperating: boolean;
  public pageWidth: number;
  public pageHeight: number;
  public fromReviewBooking: boolean = false;
  public fromDraft: boolean = false;
  public editing: boolean = false;
  public quantity: number = 1
  public enterQuant: string;
  public invalidQuantity: boolean = false;
  public isManual: boolean = false;
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
    this.serviceInfo = { pageId: "", serviceGroupName: "", serviceGroupId: "", pageType: "", bookingId: "" }
  }

  ngOnInit() {
    this.pageWidth = window.innerWidth;
    this.pageHeight = window.innerHeight - 30;
    this.setPage()
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.fromReviewBooking) {
          this.fromReviewBooking = true
        }
        if (params.manual) {
          this.isManual = true
        }
        if (params.edit) {
          this.editing = true
        }
        if (params.draft) {
          this.fromDraft = true
        }
      }

    })
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

  selectService() {
    console.log(this.values)
    if (this.values["inputQuantity"]) {
      this.enterQuant = this.values._id;
    } else {
      this.submitSelected()
    }
  }

  cancelSelection() {
    setTimeout(() => {
      this.quantity = 1;
      this.invalidQuantity = false
      this.enterQuant = null
    }, 300);
  }

  checkQuantity() {
    const servQuant = this.values.data.filter(data => data.data.defaultName == "quantity")
    const quantity = servQuant.length > 0 ? servQuant[0].data.text : null
    if (quantity) {
      if (parseInt(quantity) >= this.quantity && this.quantity > 0) {
        this.invalidQuantity = false
        this.submitSelected()
      } else {
        this.invalidQuantity = true
      }
    }
  }

  submitSelected() {
    const firstServiceSelected = { service: this.values._id, serviceGroupName: this.serviceInfo.serviceGroupName, quantity: this.quantity, serviceGroupId: this.serviceInfo.serviceGroupId }
    const data = { pageId: this.serviceInfo.pageId, pageType: this.serviceInfo.pageType, firstService: firstServiceSelected, bookingId: this.serviceInfo.bookingId ? this.serviceInfo.bookingId : null };
    this.mainService.createBooking(data).subscribe((response: bookingData) => {
      this.enterQuant = null;
      let params = { queryParams: {} }
      if (this.fromDraft) params.queryParams["draft"] = true
      if (this.isManual) params.queryParams["manual"] = true
      if (this.editing) params.queryParams["edit"] = true
      if (this.fromReviewBooking) params.queryParams["fromReviewBooking"] = true
      this.router.navigate(["/service-provider/select-service", this.serviceInfo.pageId, response._id], params)
    })
  }

  renderComponent(componentValues: any, parent) {
    const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
    const comp = this.pageElement.createComponent<ElementComponent>(factory);
    comp.instance.values = componentValues.unSaved ? null : componentValues;
    comp.instance.parent = "page";
    comp.instance.emitEvent = new EventEmitter();
  }
}
