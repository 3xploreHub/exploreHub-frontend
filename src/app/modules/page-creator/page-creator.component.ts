import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem } from '@capacitor/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';
import { TextComponent } from 'src/app/modules/page-elements/text/text.component';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { popupData } from 'src/app/service-provider/view-booking-as-provider/view-booking-as-provider.page';
import { ElementComponent } from '../elementTools/interfaces/element-component';
import { Page } from '../elementTools/interfaces/page';
import { PageElementListComponent } from '../page-element-list/page-element-list.component';
import { BulletFormTextComponent } from '../page-elements/bullet-form-text/bullet-form-text.component';
import { LabelledTextComponent } from '../page-elements/labelled-text/labelled-text.component';
import { PageInputFieldListComponent } from '../page-input-field-list/page-input-field-list.component';
import { ChoicesInputComponent } from '../page-input-field/choices-input/choices-input.component';
import { DateInputComponent } from '../page-input-field/date-input/date-input.component';
import { NumberInputComponent } from '../page-input-field/number-input/number-input.component';
import { TextInputComponent } from '../page-input-field/text-input/text-input.component';
import { PageServicesListComponent } from '../page-services-list/page-services-list.component';
import { ItemListComponent } from '../page-services/item-list/item-list.component';
import { PageCreatorService } from './page-creator-service/page-creator.service';

@Component({
  selector: 'app-page-creator',
  templateUrl: './page-creator.component.html',
  styleUrls: ['./page-creator.component.scss'],
})

export class PageCreatorComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  @ViewChild('pageInputField', { read: ViewContainerRef }) pageInputField: ViewContainerRef;
  public page: Page;
  public preview: boolean = false;
  public loading: boolean = false;
  public submitting: boolean = false;
  public popupData: popupData;
  public active: string = 'info';
  public showUnfilled: boolean = false;
  public unfilledFields = { components: [], services: [], bookingInfo: [] }
  boxPosition: number;
  components = {
    'text': TextComponent,
    'bullet-form-text': BulletFormTextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
    'item-list': ItemListComponent,
    'text-input': TextInputComponent,
    'number-input': NumberInputComponent,
    'date-input': DateInputComponent,
    'choices-input': ChoicesInputComponent
  }

  constructor(public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public alert: AlertController,
    public mainService: MainServicesService,
    public router: Router,
  ) {
    this.page = { _id: null, creator: null, status: "",initialStatus: "",pageType: "",otherServices: [], components: [], services: [], bookingInfo: [], hostTouristSpot: null, createdAt: "" }
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }
  }

  ngOnInit() {
  }

  setPage(page, pageType) {
    this.pageElement.clear()
    this.pageService.clear();
    this.pageInputField.clear()
    setTimeout(() => {

      this.creator.pageType = pageType;
      this.creator.canLeave = false;
      this.creator.preview = false;
      this.page = page;
      this.creator.currentPageId = this.page._id;

      this.page.components.forEach((component: any) => {
        this.renderComponent(this.pageElement, component, "page")
      })

      this.page.services.forEach((component: any) => {
        this.renderComponent(this.pageService, component, "page")
      })

      this.page.bookingInfo.forEach((component: any) => {
        this.renderComponent(this.pageInputField, component, "page_booking_info")
      })
    }, 100);

  }

  onScroll(event, info: HTMLElement, services: HTMLElement, div: HTMLElement) {

    const width = div.clientWidth;

    const scrolled = event.detail.scrollTop;

    if (info.clientHeight >= scrolled) {
      this.boxPosition = 0;
      this.active = 'info';
    }
    if (info.clientHeight < scrolled) {
      this.boxPosition = width;
      this.active = 'services';
    }
    if ((info.clientHeight + services.clientHeight) < scrolled) {
      this.boxPosition = width * 2;
      this.active = 'booking'
    }
  }

  showComponentList() {
    return this.showModal(this.pageElement, PageElementListComponent, "page");
  }

  showServicesComponentList() {
    // return this.showModal(this.pageService, PageServicesListComponent, "page");
    this.renderComponent(this.pageService, { type: "item-list", unSaved: true }, "page");
  }

  showInputFieldList() {
    return this.showModal(this.pageInputField, PageInputFieldListComponent, "page_booking_info");
  }

  async showModal(type: ViewContainerRef, List: any, parent: string) {
    const modal = await this.modalController.create({
      component: List,
      cssClass: 'componentListModal'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(type, { type: data, unSaved: true }, parent);

    return present;
  }

  goToSection(el: HTMLElement, tab: string, div: HTMLElement) {
    const width = div.clientWidth;
    this.active = tab;
    switch (tab) {
      case 'booking':
        this.boxPosition = width * 2;
        break;
      case 'services':
        this.boxPosition = width;
        break;
      default:
        this.boxPosition = 0
        break;
    }
    el.scrollIntoView();
  }

  presentInfo() {
    setTimeout(() => {
      this.popupData = {
        title: "Your Page was successfully submitted",
        type: 'info',
        otherInfo: `The <b>Explorehub admin</b> will communicate with you for the <b>payment</b>. Please see <b>Messages</b> page. Thank you.`,
        show: true
      }
    }, 200);
  }

  clicked(action) {
      this.popupData.show = false
      this.router.navigate([`/service-provider/dashboard`, this.creator.pageType, this.page._id])
  }

  renderComponent(type: ViewContainerRef, componentValues: any, parent) {
    if (componentValues.type) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentValues.type]);
      const comp = type.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues.unSaved ? null : componentValues;
      comp.instance.parentId = this.page._id;
      comp.instance.parent = parent;
    }
  }

  exit() {
    if (this.page.status != 'Unfinished') {

      this.submitting = true;
      setTimeout(async () => {

        const result = await this.validatePage();
        if (result) {
          this.creator.canLeave = true;
          this.creator.preview = false;
          this.router.navigate(["/service-provider/dashboard", this.creator.pageType, this.page._id])
        }

      }, 200);

    } else {
      this.router.navigate(['/service-provider'])
    }
  }

  previewPage() {
    this.loading = true;
    this.submitting = false;
    setTimeout(async () => {

      const result = await this.validatePage();
      if (!result) {
        this.creator.preview = false;

      } else {
        this.creator.preview = true;
      }

    }, 500);

  }

  async submit() {
    this.submitting = true;
    const result = await this.validatePage()

    if (result) {
      let notificationData = null;
      if (this.page.hostTouristSpot) {
        notificationData = {
          receiver:  this.page.hostTouristSpot["creator"],
          mainReceiver: this.mainService.user._id,
          page: this.page._id,
          booking: null,
          sender: this.mainService.user._id,
          subject: this.page._id,
          message: `<b>${this.mainService.user.fullName}</b> created a service under your page`,
          type: "page-provider",
        }
      }
      this.creator.submitPage(notificationData).subscribe(
        (response) => {
          this.creator.canLeave = true;
          const creator = this.page.hostTouristSpot? this.page.hostTouristSpot["creator"]: ""
          this.mainService.notify({user: this.mainService.user, receiver:[creator, "admin"], type: "page-submission", message: "A service is submitted under your page"})
          this.creator.preview = false;
          this.presentInfo()

        },
        error => {
          this.presentAlert("Unexpected error occured! Please try again later.")
          this.router.navigate(["/service-provider"])
        }
      )
    }
  }

  getUnfilledFields() {
    this.unfilledFields = {
      components: [...this.unfilledFields.components, ...this.creator.unfilledFields.components],
      services: [...this.unfilledFields.services, ...this.creator.unfilledFields.services],
      bookingInfo: [...this.unfilledFields.bookingInfo, ...this.creator.unfilledFields.bookingInfo],
    }
  }

  async validatePage() {
    let valid = [];
    this.showUnfilled = false;
    this.unfilledFields = { components: [], services: [], bookingInfo: [] }
    let result = false;
    const self = this
    function getUpdate() {
      return new Promise(resolve => {
        self.creator.retrievePage(self.page._id, self.creator.pageType).subscribe(
          (response: Page) => {
            self.page = response;

            //check components
            const checkingResult = self.creator.checkIfHasValue(self.page.components)
            if (!checkingResult) {
              valid.push(checkingResult)
              self.getUnfilledFields();
            }

            //check services

            if (self.page.services.length > 0) {
              self.page.services.forEach(item_list => {
                if (item_list.data.length == 1) {
                  valid.push(false)
                  self.getUnfilledFields()
                } else {
                  item_list.data.forEach(item => {
                    let data = item.data;
                    if (item.type != "item") {
                      data = [item]
                    }
                    valid.push(self.creator.checkIfHasValue(data, true))
                    self.getUnfilledFields()
                  });
                }
              })
            }

            //check bookinginfo input fields
            if (self.page.bookingInfo.length > 0) {
              const result = self.creator.checkIfHasValue(self.page.bookingInfo)
              if (!result) {
                valid.push(result)
                self.getUnfilledFields()
              }
            }
            valid = valid.filter(i => !i);

            let fields = { components: [], services: [], bookingInfo: [] }

            fields.components = self.countFields(self.unfilledFields.components);
            fields.services = self.countFields(self.unfilledFields.services);
            fields.bookingInfo = self.countFields(self.unfilledFields.bookingInfo);

            self.unfilledFields = fields;
            self.loading = false;

            if (valid.length > 0) {
              result = false;
              self.showUnfilled = true;
            } else {
              self.showUnfilled = false;
              result = true;
            }

            resolve(result);
          },
          (error) => {
            if (error.status == 404) {
              self.router.navigate(["/service-provider"])
            }
          })
      })
    }
    return await getUpdate();
  }

  countFields(list) {
    let fields = []
    let finalList = []
    list.forEach(f => {
      if (!fields.includes(f)) {
        let count = 0;
        list.forEach(i => {
          if (f == i) {
            count++
          }
        })
        fields.push(f);
        finalList.push(`${f} (${count})`);
      }
    })
    return finalList;
  }
  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  getStatus() {
    const status = this.page.status;
    return {
      'onlineBg': status == 'Online',
      'pendingBg': status == 'Pending',
      'processingBg': status == 'Processing',
      'unfinishedBg': status == 'Unfinished',
      'rejectedBg': status == 'Rejected' || status == 'Cancelled'
    }
  }
}
