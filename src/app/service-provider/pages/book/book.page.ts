import { Component, ComponentFactoryResolver, EventEmitter, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ElementComponent } from 'src/app/modules/elementTools/interfaces/element-component';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { InputValue } from 'src/app/modules/elementTools/interfaces/InputValues';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { ChoicesInputDisplayComponent } from 'src/app/modules/page-input-field-display/choices-input-display/choices-input-display.component';
import { DateInputDisplayComponent } from 'src/app/modules/page-input-field-display/date-input-display/date-input-display.component';
import { NumberInputDisplayComponent } from 'src/app/modules/page-input-field-display/number-input-display/number-input-display.component';
import { TextInputDisplayComponent } from 'src/app/modules/page-input-field-display/text-input-display/text-input-display.component';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss', '../../../modules/page-creator/page-creator.component.scss'],
})
export class BookPage implements OnInit, ViewWillEnter {
  public bookingInfo: ElementValues[] = [];
  public bookingId: String;
  public pageType: string;
  public isManual: boolean = false;
  public pageId: string;
  public requiredInputs: string[] = []
  public fromDraft: boolean = false
  public update: boolean = false;
  public inputValue: InputValue[] = [];
  components = {
    'text-input': TextInputDisplayComponent,
    'number-input': NumberInputDisplayComponent,
    'date-input': DateInputDisplayComponent,
    'choices-input': ChoicesInputDisplayComponent
  }
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  constructor(
    public route: ActivatedRoute,
    public mainService: MainServicesService,
    public creator: PageCreatorService,
    public alertController: AlertController,
    public router: Router,
    public componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.mainService.canLeave = false;
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.edit) {
          this.mainService.canLeave = true
        } 
        if (params.manual) {
          this.isManual = true
        }
        if (params.draft) {
          this.fromDraft = true;
        }
      }

    })
    this.route.paramMap.subscribe(params => {
      this.pageId = params.get('pageId');
      this.pageType = params.get('pageType');
      this.bookingId = params.get('bookingId')
      this.mainService.getPageBookingInfo({ pageId: this.pageId, pageType: this.pageType, bookingId: this.bookingId }).subscribe(
        (response: any) => {
          this.bookingInfo = response.bookingInfo;
          if (response.booking) {
            this.update = response.booking.bookingInfo.length > 0;
            this.inputValue = response.booking.bookingInfo;
            this.setValues();
          }
          this.setPage(this.bookingInfo);
        }
      )
    })
  }

  setValues() {
    if (this.inputValue.length > 0) {
      this.inputValue.forEach(value => {
        this.bookingInfo = this.bookingInfo.map(input => {
          if (input._id == value.inputId) {
            input.data.defaultValue = value.value;
          }
          return input;
        })
      })
    }
  }

  ionViewWillEnter() {
    this.bookingInfo = [];
  }

  setPage(page) {
    if (this.pageInputField) this.pageInputField.clear()
    this.creator.preview = true;
    setTimeout(() => {
      this.bookingInfo.forEach((component: any) => {
        let hasError = false
        this.requiredInputs.forEach(field => {
          if (field == component._id) {
            hasError = true
          }
        })
        this.renderComponent(component, "page_booking_info", hasError)
      })
    }, 100);
  }

  renderComponent(componentValues: any, parent, hasError = false) {
    if (componentValues.type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = this.pageInputField.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.pageId
      comp.instance.parent = parent;
      comp.instance.hasError = hasError
      comp.instance.emitEvent = new EventEmitter();
      comp.instance.emitEvent.subscribe(data => this.catchEvent(data))
    }
  }

  catchEvent(data) {
    if (data.userInput) {
      let updated = false;
      this.inputValue = this.inputValue.map((val: InputValue) => {
        if (val.inputId == data.data.inputId) {
          val = data.data
          updated = true;
        }
        return val;
      })
      if (!updated) {
        this.inputValue.push(data.data);
      }
    }
  }

  submitBooking() {
    const requiredFields = []
    const requiredInputs = []
    let hasError: boolean = false;
    this.bookingInfo.forEach(data => {
      if (data.data.required) {
        let hasValue = false;
        this.inputValue.forEach(value => {
          if (value.inputId == data._id && value.value) {
            hasValue = true;
          }
        })
        if (!hasValue) {
          requiredInputs.push(data._id)
          requiredFields.push(data.data.label)
          hasError = true
        }
      }
    })
    this.requiredInputs = requiredInputs
    if (!hasError) {

      setTimeout(() => {
        this.mainService.canLeave = true;
        this.mainService.addBookingInfo(this.bookingId, this.inputValue).subscribe(
          (response: bookingData) => {
            let params = {queryParams:{}}
             if (this.isManual) params.queryParams["manual"] = true
             if (this.fromDraft) params.queryParams["draft"] = true
            this.router.navigate(["/service-provider/booking-review", this.pageId, this.pageType, this.bookingId], params)
          }
        )
      }, 100);
    } else {
      const error = "Required field"+(requiredFields.length > 1? "s": "" )+": "+requiredFields.join(", ");
      this.presentAlert(error);
      this.setValues();
      this.setPage(this.bookingInfo);
    }

  }
  editSelectedServices() {
    this.mainService.canLeave = true;
    let params = {queryParams:{}}
    if (this.isManual) params.queryParams["manual"] = true
    if (this.fromDraft) params.queryParams["draft"] = true
    this.router.navigate(["/service-provider/select-service", this.pageId, this.bookingId], params)
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
